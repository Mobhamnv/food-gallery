const CACHE_NAME = "app-cache-v-networkFirst";  

const FILES_TO_CACHE = [
  "index.html",
  "manifest.json",
  "sw.js",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

// نصب: یکسری فایل پایه کش میشه
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// فعال‌سازی: کش‌های قدیمی پاک میشن
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// استراتژی "Network First": 
// سعی کن همیشه از اینترنت بگیری، اگه نشد از کش
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // نسخه جدید فایل → می‌ریزیم تو کش
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
