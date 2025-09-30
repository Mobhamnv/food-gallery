// ورژن کش را هر بار که فایل‌ها تغییر می‌کنند، تغییر بده
const CACHE_NAME = "app-cache-v3";  

const FILES_TO_CACHE = [
  "index.html",
  "manifest.json",
  "sw.js",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

// نصب سرویس ورکر و کش کردن فایل‌ها
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // اجازه بده سریع فعال بشه
});

// فعال‌سازی و پاک کردن کش قدیمی
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // بلافاصله کنترل تب‌های باز رو بگیره
});

// گرفتن ریکوئست‌ها
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
