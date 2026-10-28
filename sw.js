// ELEMENT by Lilly — service worker (cache basique pour usage hors-ligne / installation PWA)
const CACHE_NAME = "ebl-cache-v21";
const CORE_ASSETS = [
  "index.html",
  "boutique.html",
  "histoire.html",
  "contact.html",
  "css/style.css",
  "js/i18n.js",
  "js/main.js",
  "js/catalog.js",
  "js/products.js",
  "js/ambiance.js",
  "js/elements-scene.js",
  "js/protect.js",
  "assets/img/site/logo.png",
  "assets/img/site/emblem.svg",
  "assets/img/site/icon-192.png",
  "assets/img/site/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Reseau d'abord : on sert toujours la derniere version en ligne, le cache ne sert qu'hors connexion.
// (Le cache d'abord melangeait d'anciens fichiers avec les nouveaux apres une mise a jour.)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
