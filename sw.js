const staticCacheName = 'site-static-v4';
const dynamicCacheName = 'site-dynamic-v4';
const assets = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/education.html',
  '/technologies.html',
  '/skills.html',
  '/work.html',
  '/makki.png',
  '/js/app.js',
  '/js/main.js',
  '/css/main.css',
  '/assets/Makki resume.pdf',
  '/img/portrait_small.jpg',
  '/img/portrait.jpg',
  '/img/circle-cropped.png',
  '/img/background.jpg',
  '/img/hangman.png',
  '/img/tof.png',
  '/icons/apple-icon-180.png',
  '/icons/manifest-icon-512.png',
  '/icons/manifest-icon-192.png',
  'https://use.fontawesome.com/releases/v5.2.0/css/all.css'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener('fetch', evt => {
  if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            // check cached items size
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          })
        });
      }).catch(() => {
        if(evt.request.url.indexOf('.html') > -1){
          return caches.match('/pages/fallback.html');
        } 
      })
    );
  }
});


// const staticCacheName = 'site-static';
// const assets = [
//   '/',
//   '/index.html',
//   '/about.html',
//   '/contact.html',
//   '/work.html',
//   '/makki.png',
//   '/js/app.js',
//   '/js/main.js',
//   '/css/main.css',
//   '/assets/Makki resume.pdf',
//   '/img/portrait_small.jpg',
//   '/img/portrait.jpg',
//   '/img/circle-cropped.png',
//   '/img/background.jpg',
//   '/img/projects/project1.jpg',
//   '/img/projects/project2.jpg',
//   '/img/projects/project3.jpg',
//   '/icons/apple-icon-180.png',
//   '/icons/manifest-icon-512.png',
//   '/icons/manifest-icon-192.png',
// 'https://use.fontawesome.com/releases/v5.2.0/css/all.css'
// ];


// self.addEventListener('install', evt => {
//   console.log('Service worker has been installed');
//   evt.waitUntil(
//     caches.open(staticCacheName).then(cache => {
//       console.log('caching all assets');
//       cache.addAll(assets);
//     })
//   )
// });

// self.addEventListener('activate', evt => {
//   console.log('Service worker has been activated');
// });

// self.addEventListener('fetch', evt => {
//   console.log('Service worker has been fetched');

//   evt.respondWith(
//     caches.match(evt.request).then(cacheRes => {
//       return cacheRes || fetch(evt.request);
//     })
//   )
// });