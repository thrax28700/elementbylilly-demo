// ELEMENT by Lilly — comportements globaux (nav, langue, PWA)

document.addEventListener("DOMContentLoaded", () => {
  // Menu mobile
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileNavClose = document.querySelector(".mobile-nav-close");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => mobileNav.classList.add("open"));
    if (mobileNavClose) mobileNavClose.addEventListener("click", () => mobileNav.classList.remove("open"));
    mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobileNav.classList.remove("open")));
  }

  // Selecteur de langue
  document.querySelectorAll(".lang-switch").forEach(switchEl => {
    const current = switchEl.querySelector(".lang-current");
    current.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".lang-switch").forEach(s => { if (s !== switchEl) s.classList.remove("open"); });
      switchEl.classList.toggle("open");
    });
    switchEl.querySelectorAll("[data-lang-option]").forEach(btn => {
      btn.addEventListener("click", () => {
        setLang(btn.getAttribute("data-lang-option"));
        switchEl.classList.remove("open");
      });
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".lang-switch.open").forEach(s => s.classList.remove("open"));
  });

  // Annee footer
  document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

  // Apparition douce des sections au defilement
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add("in-view"));
    }
  }

  // Video de "Notre histoire" : boutons de lecture, et ambiance du site en sourdine pendant la video
  const storyVideo = document.querySelector("[data-story-video]");
  if (storyVideo) {
    const frame = storyVideo.closest(".story-video-frame");
    document.querySelectorAll("[data-story-play]").forEach(btn => btn.addEventListener("click", () => {
      storyVideo.play();
      frame.scrollIntoView({ behavior: "smooth", block: "center" });
    }));
    // Les commandes n'apparaissent qu'une fois la video lancee : l'apercu reste epure
    storyVideo.addEventListener("click", () => { if (!storyVideo.controls) storyVideo.play(); });
    storyVideo.addEventListener("play", () => {
      storyVideo.controls = true;
      frame.classList.add("is-playing");
      if (typeof Ambiance !== "undefined") Ambiance.duck(true);
    });
    ["pause", "ended"].forEach(type => storyVideo.addEventListener(type, () => {
      if (type === "ended") frame.classList.remove("is-playing");
      if (typeof Ambiance !== "undefined") Ambiance.duck(false);
    }));
  }

  // Enregistrement du service worker (PWA)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
});
