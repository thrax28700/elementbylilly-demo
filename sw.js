// ELEMENT by Lilly — service worker (cache basique pour usage hors-ligne / installation PWA)
const CACHE_NAME = "ebl-cache-v2";
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
  "assets/img/site/logo.png",
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

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
