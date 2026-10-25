// ELEMENT by Lilly — ambiance sonore douce, generee en direct dans le navigateur (Web Audio).
// Aucun fichier audio, aucun droit d'auteur : des nappes lentes, quelques notes de cristal,
// et une texture propre a chaque element (eau, terre, bois, vent, feu).
// Active par defaut : elle demarre des que le navigateur l'autorise (souvent au premier clic ou a la
// premiere touche, les navigateurs bloquant le son sans geste du visiteur). Le bouton permet de la couper,
// et ce choix est memorise d'une page a l'autre.

const Ambiance = (() => {
  const PREF_KEY = "ebl_sound";
  const MASTER_LEVEL = 0.32;
  // Progression calme en re majeur (Dmaj9, Bm7, Gmaj7, Aadd9)
  const CHORDS = [
    [146.83, 220.00, 277.18, 329.63],
    [123.47, 185.00, 220.00, 293.66],
    [98.00, 196.00, 246.94, 293.66],
    [110.00, 164.81, 246.94, 277.18],
  ];
  const PENTA = [587.33, 659.25, 739.99, 880.00, 987.77, 1174.66, 1318.51];
  const CHORD_SECONDS = 12;

  let ctx = null, master = null, reverb = null, dry = null;
  let textures = {};
  let current = "eau";
  let playing = false;
  let timers = [];
  let session = 0;

  function getPref(){ try { return localStorage.getItem(PREF_KEY) !== "off"; } catch(e){ return false; } }
  function setPref(on){ try { localStorage.setItem(PREF_KEY, on ? "on" : "off"); } catch(e){} }

  function noiseBuffer(seconds, brown){
    const len = ctx.sampleRate * seconds;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      if (brown) { last = (last + 0.02 * white) / 1.02; data[i] = last * 3.5; }
      else data[i] = white;
    }
    return buf;
  }

  function impulse(seconds){
    const len = ctx.sampleRate * seconds;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return buf;
  }

  function loopNoise(brown){
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(4, brown);
    src.loop = true;
    src.start();
    return src;
  }

  function lfo(freq, depth, target){
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = freq;
    g.gain.value = depth;
    osc.connect(g).connect(target);
    osc.start();
  }

  function build(){
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    reverb = ctx.createConvolver();
    reverb.buffer = impulse(5);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    reverb.connect(wet).connect(master);
    dry = ctx.createGain();
    dry.gain.value = 0.5;
    dry.connect(master);
    dry.connect(reverb);
    buildTextures();
    return true;
  }

  function textureBus(){
    const g = ctx.createGain();
    g.gain.value = 0;
    g.connect(dry);
    return g;
  }

  function buildTextures(){
    // Eau : ressac lent, bruit grave qui respire comme des vagues
    const eau = textureBus();
    const eauLp = ctx.createBiquadFilter();
    eauLp.type = "lowpass"; eauLp.frequency.value = 520;
    const eauSwell = ctx.createGain();
    eauSwell.gain.value = 0.5;
    loopNoise(true).connect(eauLp).connect(eauSwell).connect(eau);
    lfo(0.09, 0.45, eauSwell.gain);
    textures.eau = { bus: eau, level: 0.5 };

    // Vent : souffle filtre qui balaie lentement les frequences
    const vent = textureBus();
    const ventBp = ctx.createBiquadFilter();
    ventBp.type = "bandpass"; ventBp.frequency.value = 700; ventBp.Q.value = 1.4;
    loopNoise(false).connect(ventBp).connect(vent);
    lfo(0.05, 420, ventBp.frequency);
    textures.vent = { bus: vent, level: 0.09 };

    // Terre : bourdon tres grave (re et la), presque ressenti plus qu'entendu
    const terre = textureBus();
    [73.42, 110.0].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine"; o.frequency.value = f; o.detune.value = i ? 4 : -3;
      const g = ctx.createGain(); g.gain.value = i ? 0.18 : 0.28;
      o.connect(g).connect(terre); o.start();
    });
    textures.terre = { bus: terre, level: 0.55 };

    // Feu : braises douces — grave chaud + petits craquements aleatoires
    const feu = textureBus();
    const feuLp = ctx.createBiquadFilter();
    feuLp.type = "lowpass"; feuLp.frequency.value = 260;
    const feuBed = ctx.createGain(); feuBed.gain.value = 0.35;
    loopNoise(true).connect(feuLp).connect(feuBed).connect(feu);
    textures.feu = { bus: feu, level: 0.6, crackle: true };

    // Bois : le bus sert aux notes boisees (type kalimba) jouees par le planificateur
    const bois = textureBus();
    textures.bois = { bus: bois, level: 0.8, pluck: true };
  }

  function playChord(index, when){
    const notes = CHORDS[index % CHORDS.length];
    const attack = 4, hold = CHORD_SECONDS - 2, release = 6;
    notes.forEach(freq => {
      [-6, 6].forEach(det => {
        const o = ctx.createOscillator();
        o.type = "triangle"; o.frequency.value = freq; o.detune.value = det;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass"; lp.frequency.value = 900;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, when);
        g.gain.linearRampToValueAtTime(0.022, when + attack);
        g.gain.setValueAtTime(0.022, when + hold);
        g.gain.linearRampToValueAtTime(0, when + hold + release);
        o.connect(lp).connect(g).connect(dry);
        o.start(when); o.stop(when + hold + release + 0.1);
      });
    });
  }

  function bell(freq, level, dest, type, decay){
    const t0 = ctx.currentTime + 0.02;
    const o = ctx.createOscillator();
    o.type = type; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(level, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + decay);
    o.connect(g).connect(dest);
    o.start(t0); o.stop(t0 + decay + 0.1);
  }

  function crackle(){
    const t0 = ctx.currentTime + 0.01;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(0.05, false);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 1800 + Math.random() * 2500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.05 + Math.random() * 0.06, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.04);
    src.connect(hp).connect(g).connect(textures.feu.bus);
    src.start(t0);
  }

  function every(minMs, maxMs, fn){
    const tick = () => {
      if (!playing) return;
      fn();
      timers.push(setTimeout(tick, minMs + Math.random() * (maxMs - minMs)));
    };
    timers.push(setTimeout(tick, minMs + Math.random() * (maxMs - minMs)));
  }

  function startSchedulers(){
    let chord = 0;
    const nextChord = () => {
      if (!playing) return;
      playChord(chord++, ctx.currentTime + 0.05);
      timers.push(setTimeout(nextChord, CHORD_SECONDS * 1000));
    };
    nextChord();
    // Notes de cristal, rares et lointaines
    every(3500, 8000, () => bell(PENTA[Math.floor(Math.random() * PENTA.length)], 0.03, reverb, "sine", 3.5));
    // Notes boisees quand l'element Bois est actif
    every(1400, 3600, () => {
      if (current !== "bois") return;
      bell(PENTA[Math.floor(Math.random() * 5)] / 2, 0.09, textures.bois.bus, "triangle", 1.2);
    });
    // Craquements du feu
    every(90, 700, () => { if (current === "feu") crackle(); });
  }

  function applyElement(name, seconds){
    if (!ctx) return;
    const now = ctx.currentTime;
    Object.entries(textures).forEach(([key, tex]) => {
      const target = key === name ? tex.level : 0;
      tex.bus.gain.cancelScheduledValues(now);
      tex.bus.gain.setValueAtTime(tex.bus.gain.value, now);
      tex.bus.gain.linearRampToValueAtTime(target, now + seconds);
    });
  }

  function start(){
    if (playing) return;
    if (!ctx && !build()) return;
    playing = true;
    const mine = ++session;
    setPref(true);
    updateButtons();
    // On ne planifie les notes qu'une fois le contexte audio reellement lance,
    // sinon elles s'accumuleraient et partiraient toutes d'un coup
    ctx.resume().then(() => {
      if (!playing || mine !== session) return;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(MASTER_LEVEL, now + 4);
      applyElement(current, 3);
      startSchedulers();
    }).catch(() => {});
  }

  function stop(){
    if (!playing) return;
    playing = false;
    timers.forEach(clearTimeout);
    timers = [];
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 1.5);
    setTimeout(() => { if (!playing) ctx.suspend(); }, 1700);
    setPref(false);
    updateButtons();
  }

  function toggle(){ armed = false; playing ? stop() : start(); }

  // Tente de lancer le son des l'ouverture ; si le navigateur refuse, il demarre au premier geste du visiteur.
  let armed = false;
  function armAutoplay(){
    armed = true;
    if (!ctx && !build()) return;
    ctx.resume().catch(() => {});
    setTimeout(() => { if (armed && ctx.state === "running") { armed = false; start(); } }, 250);
    const onGesture = (e) => {
      ["pointerup", "keydown"].forEach(type => document.removeEventListener(type, onGesture, true));
      if (!armed) return;
      armed = false;
      if (e.target.closest && e.target.closest("[data-sound-toggle]")) return;
      start();
    };
    ["pointerup", "keydown"].forEach(type => document.addEventListener(type, onGesture, true));
  }

  function setElement(name){
    if (!textures || !name) return;
    current = name;
    if (playing) applyElement(name, 2.5);
  }

  function updateButtons(){
    document.querySelectorAll("[data-sound-toggle]").forEach(btn => {
      btn.classList.toggle("is-on", playing);
      btn.setAttribute("aria-pressed", playing ? "true" : "false");
      const label = btn.querySelector("[data-sound-label]");
      if (label) label.textContent = t(playing ? "sound.on" : "sound.off");
    });
  }

  function mountToggle(){
    const btn = document.createElement("button");
    btn.className = "sound-toggle";
    btn.type = "button";
    btn.setAttribute("data-sound-toggle", "");
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = `
      <span class="sound-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span data-sound-label>${t("sound.off")}</span>
    `;
    document.body.appendChild(btn);
  }

  function init(){
    mountToggle();
    document.querySelectorAll("[data-sound-toggle]").forEach(btn => btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle();
    }));
    if (getPref()) armAutoplay();
    document.addEventListener("elementchange", (e) => setElement(e.detail.element));
    document.addEventListener("langchange", updateButtons);
    document.addEventListener("visibilitychange", () => {
      if (!ctx || !playing) return;
      document.hidden ? ctx.suspend() : ctx.resume();
    });
    updateButtons();
  }

  document.addEventListener("DOMContentLoaded", init);
  return { start, stop, toggle, setElement };
})();
