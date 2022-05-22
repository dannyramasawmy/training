const staticCacheName = 'languageTree-v9';

self.addEventListener('install', (e) => {
  console.log("Registering sw");
  e.waitUntil(
    caches.open(staticCacheName).then((cache) => cache.addAll([
      '/languageTree/',
      '/languageTree/data/romanian-tree.js',
      '/languageTree/img/delta-icon.png',
      '/languageTree/src/languageTree.js',
      '/languageTree/src/ui.js',
      '/languageTree/style/rainbow-cards.css',
      '/languageTree/index.html'
    ])),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      )
    })
  )
});

self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
