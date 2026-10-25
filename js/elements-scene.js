// ELEMENT by Lilly — scene animee de l'accueil : les cinq elements prennent vie en fond.
// Eau : bulles et houle · Terre : poussiere ocre et courbes de niveau · Bois : feuilles qui tombent
// Vent : filets d'air · Feu : braises qui montent. Au centre, l'embleme de la marque prend la couleur de l'element. Le choix d'un element pilote aussi l'ambiance sonore.

const ELEMENT_COLORS = {
  eau: ["#BFE3F0", "#7CB7D1"],
  terre: ["#E8C39E", "#C98E5F"],
  bois: ["#B9D3A8", "#E3C77C"],
  vent: ["#FFFFFF", "#D7E6EE"],
  feu: ["#FFC27A", "#FF7A3D"],
};

function setActiveElement(name, source){
  document.dispatchEvent(new CustomEvent("elementchange", { detail: { element: name, source } }));
}

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector("[data-ehero]");
  if (!hero) return;
  const canvas = hero.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, dpr = 1;
  let mode = "eau";
  let userChose = false;
  let visible = true;
  let pointer = { x: -9999, y: -9999 };
  const layers = { eau: 1, terre: 0, bois: 0, vent: 0, feu: 0 };
  const particles = [];
  const COUNT = window.innerWidth < 700 ? 45 : 85;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const rand = (a, b) => a + Math.random() * (b - a);

  function spawn(p, initial){
    p.mode = mode;
    p.age = 0;
    p.life = rand(6, 14) * 60;
    p.r = rand(1, 3.4);
    p.color = ELEMENT_COLORS[mode][Math.random() < 0.5 ? 0 : 1];
    p.rot = rand(0, Math.PI * 2);
    p.spin = rand(-0.02, 0.02);
    p.phase = rand(0, Math.PI * 2);
    switch (mode) {
      case "eau": p.x = rand(0, W); p.y = initial ? rand(0, H) : H + 10; p.vx = 0; p.vy = rand(-0.9, -0.35); p.r = rand(1.5, 6); break;
      case "feu": p.x = rand(0, W); p.y = initial ? rand(0, H) : H + 10; p.vx = rand(-0.2, 0.2); p.vy = rand(-1.6, -0.6); p.r = rand(1, 2.6); break;
      case "bois": p.x = rand(0, W); p.y = initial ? rand(0, H) : -20; p.vx = rand(-0.3, 0.3); p.vy = rand(0.4, 1.0); p.r = rand(4, 9); break;
      case "vent": p.x = initial ? rand(0, W) : -60; p.y = rand(0, H); p.vx = rand(2.2, 4.5); p.vy = 0; p.r = rand(30, 90); break;
      default: p.x = rand(0, W); p.y = rand(0, H); p.vx = rand(-0.25, 0.25); p.vy = rand(-0.15, 0.15); p.r = rand(0.8, 2.4);
    }
  }

  function step(p){
    p.age++;
    p.phase += 0.02;
    if (p.mode === "eau") p.x += Math.sin(p.phase) * 0.4;
    if (p.mode === "bois") { p.x += Math.sin(p.phase) * 0.8; p.rot += p.spin; }
    if (p.mode === "feu") p.x += Math.sin(p.phase * 1.7) * 0.5;
    if (p.mode === "vent") p.y += Math.sin(p.phase) * 0.4;
    // Le pointeur ecarte doucement les particules
    const dx = p.x - pointer.x, dy = p.y - pointer.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < 14000) { const f = (14000 - d2) / 14000 * 1.6; const d = Math.sqrt(d2) || 1; p.x += dx / d * f; p.y += dy / d * f; }
    p.x += p.vx; p.y += p.vy;
    const out = p.y < -40 || p.y > H + 40 || p.x < -120 || p.x > W + 120;
    if (p.age > p.life || out) spawn(p, false);
  }

  function alphaOf(p){
    const fadeIn = Math.min(1, p.age / 60);
    const fadeOut = Math.min(1, (p.life - p.age) / 60);
    const modeFade = p.mode === mode ? 1 : Math.max(0, layers[p.mode]);
    return Math.max(0, Math.min(fadeIn, fadeOut)) * modeFade;
  }

  function drawParticle(p){
    const a = alphaOf(p);
    if (a <= 0.01) return;
    ctx.globalAlpha = a;
    switch (p.mode) {
      case "eau":
        ctx.strokeStyle = p.color; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
        break;
      case "feu": {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, p.color); g.addColorStop(1, "rgba(255,120,60,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case "bois":
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.globalAlpha = a * 0.75;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.42, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        break;
      case "vent":
        ctx.strokeStyle = p.color; ctx.lineWidth = 1; ctx.globalAlpha = a * 0.5;
        ctx.beginPath(); ctx.moveTo(p.x - p.r, p.y);
        ctx.quadraticCurveTo(p.x - p.r / 2, p.y - 6 * Math.sin(p.phase), p.x, p.y);
        ctx.stroke();
        break;
      default:
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  let tick = 0;
  function drawLayers(){
    // Houle (eau)
    if (layers.eau > 0.01) {
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.globalAlpha = layers.eau * (0.1 + i * 0.03);
        ctx.strokeStyle = "#BFE3F0";
        ctx.beginPath();
        const base = H * (0.6 + i * 0.08);
        for (let x = 0; x <= W; x += 16) {
          const y = base + Math.sin(x * 0.006 + tick * 0.012 + i) * (14 + i * 4) + Math.sin(x * 0.013 - tick * 0.008) * 6;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    }
    // Courbes de niveau (terre)
    if (layers.terre > 0.01) {
      ctx.lineWidth = 1; ctx.strokeStyle = "#E8C39E";
      for (let i = 0; i < 7; i++) {
        ctx.globalAlpha = layers.terre * 0.14;
        ctx.beginPath();
        const cx = W * 0.72, cy = H * 0.58, rx = 60 + i * 55, ry = 34 + i * 30;
        for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.1) {
          const wob = 1 + Math.sin(a * 3 + i + tick * 0.004) * 0.06;
          const x = cx + Math.cos(a) * rx * wob, y = cy + Math.sin(a) * ry * wob;
          a ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    }
    // Lueur basse (feu)
    if (layers.feu > 0.01) {
      const g = ctx.createRadialGradient(W * 0.5, H * 1.05, 0, W * 0.5, H * 1.05, H * 0.9);
      g.addColorStop(0, "rgba(255,140,70,.35)"); g.addColorStop(1, "rgba(255,140,70,0)");
      ctx.globalAlpha = layers.feu * (0.85 + Math.sin(tick * 0.05) * 0.15);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
  }

  function frame(){
    if (!visible) return;
    tick++;
    Object.keys(layers).forEach(k => {
      const target = k === mode ? 1 : 0;
      layers[k] += (target - layers[k]) * 0.03;
    });
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    drawLayers();
    particles.forEach(p => { step(p); drawParticle(p); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  function drawStill(){
    ctx.clearRect(0, 0, W, H);
    Object.keys(layers).forEach(k => { layers[k] = k === mode ? 1 : 0; });
    drawLayers();
    particles.forEach(p => { if (p.mode !== mode) spawn(p, true); p.age = 60; drawParticle(p); });
  }

  // ---------- Interface : boutons d'element, embleme, phrase ----------
  const buttons = hero.querySelectorAll("[data-element]");
  const emblemSymbols = hero.querySelectorAll(".emb-el");
  const nameEl = hero.querySelector("[data-element-name]");
  const lineEl = hero.querySelector("[data-element-line]");

  function renderText(){
    if (nameEl) { nameEl.textContent = t("el." + mode); nameEl.setAttribute("data-i18n", "el." + mode); }
    if (lineEl) { lineEl.textContent = t("el." + mode + ".line"); lineEl.setAttribute("data-i18n", "el." + mode + ".line"); }
  }

  function apply(name){
    mode = name;
    hero.setAttribute("data-mode", name);
    buttons.forEach(b => {
      const on = b.getAttribute("data-element") === name;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    renderText();
    if (reduced) drawStill();
  }

  document.addEventListener("elementchange", (e) => apply(e.detail.element));

  buttons.forEach(b => b.addEventListener("click", () => {
    userChose = true;
    setActiveElement(b.getAttribute("data-element"), "hero");
  }));

  // Les symboles de l'embleme sont aussi cliquables
  emblemSymbols.forEach(g => g.addEventListener("click", () => {
    userChose = true;
    setActiveElement(g.getAttribute("class").match(/emb-(eau|terre|bois|vent|feu)/)[1], "hero");
  }));

  // Tant que le visiteur n'a rien choisi, les elements se succedent lentement
  setInterval(() => {
    if (userChose || document.hidden || !visible) return;
    const order = ELEMENT_ORDER;
    setActiveElement(order[(order.indexOf(mode) + 1) % order.length], "auto");
  }, 9000);

  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
  });
  hero.addEventListener("pointerleave", () => { pointer.x = pointer.y = -9999; });

  resize();
  for (let i = 0; i < COUNT; i++) { const p = {}; spawn(p, true); p.age = rand(60, p.life - 60); particles.push(p); }
  apply(mode);
  window.addEventListener("resize", () => { resize(); if (reduced) drawStill(); });
  document.addEventListener("langchange", renderText);

  if (reduced) { drawStill(); return; }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      const was = visible;
      visible = entries[0].isIntersecting;
      if (visible && !was) requestAnimationFrame(frame);
    }).observe(hero);
  }
  requestAnimationFrame(frame);
});
