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

  // Enregistrement du service worker (PWA)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  // Invite d'installation PWA
  let deferredPrompt = null;
  const installBanner = document.querySelector(".install-banner");
  const installBtn = document.querySelector(".install-banner button");
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBanner) installBanner.hidden = false;
  });
  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (installBanner) installBanner.hidden = true;
    });
  }
  window.addEventListener("appinstalled", () => {
    if (installBanner) installBanner.hidden = true;
  });
});
