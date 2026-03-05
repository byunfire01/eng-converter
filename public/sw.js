// Service Worker - Network-first (pass-through) strategy
// PWA 설치 요건 충족을 위한 최소 구현

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
