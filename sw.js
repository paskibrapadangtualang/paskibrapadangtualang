console.log("SW FILE BERHASIL DIBACA");

const CACHE_NAME = "paskib-cache-v4";

const urlsToCache = [

  "./",
  "./index.html",
  "./home.html",
  "./user.html",
  "./akun.html",
  "./camat.html",
  "./pelatih.html",
  "./purna.html",
  "./view.html",
  "./info.html",
  "./absensi.html",
  "./album.html",
  "./bantuan.html",
  "./contact.html",
  "./detailiklan.html",
  "./detailpostingan.html",
  "./maintenance.html",
  "./postingan.html",
  "./syarat&ketentuan.html",
  "./tentangkami.html",
  "./viewangkatan.html",

  "./manifest.json",

  // ICON PWA
  "./assets/images/launchericon-192x192.png",
  "./assets/images/launchericon-512x512.png"

];



// INSTALL
self.addEventListener("fetch", (event) => {

  // ✅ FILTER WAJIB (INI LETAKNYA DI PALING ATAS)
  if (
    !event.request.url.startsWith("http") ||
    event.request.url.includes("firebase") ||
    event.request.url.includes("googleapis") ||
    event.request.url.includes("gstatic")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
    .then((cachedResponse) => {

      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
      .then((networkResponse) => {

        return caches.open(CACHE_NAME)
        .then((cache) => {

          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, networkResponse.clone());
          }

          return networkResponse;
        });

      })

      .catch(() => {
        return caches.match("./home.html");
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

  // ❌ JANGAN CACHE REQUEST NON-GET
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request)
    .then((cachedResponse) => {

      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
      .then((networkResponse) => {

        return caches.open(CACHE_NAME)
        .then((cache) => {

          // ✅ hanya cache GET + same origin
          if (
            event.request.url.startsWith(self.location.origin)
          ) {
            cache.put(event.request, networkResponse.clone());
          }

          return networkResponse;
        });

      })

      .catch(() => {
        return caches.match("./home.html");
      });

    })
  );

});