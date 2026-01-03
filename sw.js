const CACHE_NAME = "chobikunjo-offline-v5";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://fonts.googleapis.com/css2?family=Tiro+Bangla&family=Poppins:wght@300;400;500;600&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets for offline use");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Event (Offline Support)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // যদি ক্যাশে থাকে তবে সেখান থেকে দেখাবে, নাহলে ইন্টারনেট থেকে আনবে
      return response || fetch(event.request);
    }).catch(() => {
        // ইন্টারনেট না থাকলে এবং ক্যাশে না থাকলে (ডাটাবেস কল ফেইল করলে) কিছুই করার নেই,
        // তবে অ্যাপের ডিজাইন ঠিকই লোড হবে।
    })
  );
});

// Activate Event (Clean up old caches)
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
