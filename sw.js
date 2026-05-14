console.log("SW FILE BERHASIL DIBACA");

const CACHE_NAME = "paskib-cache-v5";

const urlsToCache = [

  "./",
  "./index.html",
  "./home.html",
  "./user.html",
  "./akun.html",
  "./postingan.html",
  "./detailpostingan.html",
  "./info.html",
  "./manifest.json",

  "./assets/images/launchericon-192x192.png",
  "./assets/images/launchericon-512x512.png"

];


// ===============================
// INSTALL
// ===============================

self.addEventListener("install", (event) => {

  console.log("SW INSTALL");

  event.waitUntil(

    caches.open(CACHE_NAME)
    .then((cache) => {

      return cache.addAll(urlsToCache);

    })

  );

  self.skipWaiting();

});


// ===============================
// ACTIVATE
// ===============================

self.addEventListener("activate", (event) => {

  console.log("SW AKTIF");

  event.waitUntil(

    caches.keys().then((keys) => {

      return Promise.all(

        keys.map((key) => {

          if (key !== CACHE_NAME) {

            console.log(
              "HAPUS CACHE:",
              key
            );

            return caches.delete(key);

          }

        })

      );

    })

  );

  self.clients.claim();

});


// ===============================
// FETCH
// ===============================

self.addEventListener("fetch", (event) => {

  // ❌ JANGAN CACHE NON GET
  if (event.request.method !== "GET") {
    return;
  }

  // ❌ JANGAN CACHE FIREBASE / FCM
  if (

    event.request.url.includes("firebase") ||
    event.request.url.includes("googleapis") ||
    event.request.url.includes("gstatic") ||
    event.request.url.includes("fcmregistrations")

  ) {
    return;
  }

  event.respondWith(

    caches.match(event.request)

    .then((cachedResponse) => {

      // CACHE ADA

      if (cachedResponse) {

        console.log(
          "AMBIL DARI CACHE:",
          event.request.url
        );

        return cachedResponse;

      }

      // FETCH NETWORK

      return fetch(event.request)

      .then((networkResponse) => {

        return caches.open(CACHE_NAME)

        .then((cache) => {

          // CACHE SAME ORIGIN ONLY

          if (

            event.request.url.startsWith(
              self.location.origin
            )

          ) {

            console.log(
              "SIMPAN CACHE:",
              event.request.url
            );

            cache.put(
              event.request,
              networkResponse.clone()
            );

          }

          return networkResponse;

        });

      })

      .catch(() => {

        return caches.match(
          "./home.html"
        );

      });

    })

  );

});