console.log("SW FILE BERHASIL DIBACA");

const CACHE_NAME = "paskib-cache-v3";

const urlsToCache = [

  "/",
  "/index.html",
  "/home.html",
  "/user.html",
  "/akun.html",
  "/camat.html",
  "/pelatih.html",
  "/purna.html",
  "/view.html",
  "/info.html",
  "/absensi.html",
  "/album.html",
  "/bantuan.html",
  "/contact.html",
  "/detailiklan.html",
  "/detailpostingan.html",
  "/maintenance.html",
  "/postingan.html",
  "/syarat&ketentuan.html",
  "/tentangkami.html",
  "/viewangkatan.html",

  "/manifest.json",

  // ICON PWA
  "/assets/images/launchericon-192x192.png",
  "/assets/images/launchericon-512x512.png"

];



// INSTALL
self.addEventListener("install", (event) => {

  console.log("INSTALL DIMULAI");

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE_NAME)
    .then((cache) => {

      console.log("CACHE BERHASIL DIBUKA");

      return cache.addAll(urlsToCache)
      .then(() => {

        console.log("SEMUA FILE BERHASIL DI CACHE");

      })
      .catch((err) => {

        console.error("CACHE GAGAL:", err);

      });

    })

  );

});



// ACTIVATE
self.addEventListener("activate", (event) => {

  console.log("SW AKTIF");

  event.waitUntil(

    caches.keys().then((keys) => {

      return Promise.all(

        keys.map((key) => {

          if (key !== CACHE_NAME) {

            console.log("HAPUS CACHE LAMA:", key);

            return caches.delete(key);

          }

        })

      );

    })

  );

  self.clients.claim();

});



// FETCH
self.addEventListener("fetch", (event) => {

  console.log("FETCH:", event.request.url);

  event.respondWith(

    caches.match(event.request)
    .then((cachedResponse) => {

      // kalau ada di cache
      if (cachedResponse) {

        console.log("AMBIL DARI CACHE");

        return cachedResponse;

      }

      console.log("AMBIL DARI INTERNET");

      return fetch(event.request)
      .then((networkResponse) => {

        return caches.open(CACHE_NAME)
        .then((cache) => {

          cache.put(event.request, networkResponse.clone());

          return networkResponse;

        });

      })
      .catch((err) => {

        console.error("FETCH ERROR:", err);

        return caches.match("/home.html");

      });

    })

  );

});