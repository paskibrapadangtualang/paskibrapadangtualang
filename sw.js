console.log("SW FILE BERHASIL DIBACA");

const CACHE_NAME = "paskib-cache-v8";

const urlsToCache = [

  "./",
  "./index.html",
  "./offline.html",

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

  if (event.request.method !== "GET") {
    return;
  }

  if (

    event.request.url.includes("firebase") ||
    event.request.url.includes("googleapis") ||
    event.request.url.includes("gstatic") ||
    event.request.url.includes("fcmregistrations")

  ) {
    return;
  }

event.respondWith(

(async()=>{

try{

// coba ambil dari internet dulu
const networkResponse =
await fetch(
event.request
);

// simpan ke cache
if(

event.request.url.startsWith(
self.location.origin
)

){

const cache =
await caches.open(
CACHE_NAME
);

cache.put(
event.request,
networkResponse.clone()
);

}

// kirim hasil network
return networkResponse;

}

catch(error){

// kalau buka halaman html
if(

event.request.mode ===
"navigate"

||

event.request.destination ===
"document"

){

const offlinePage =
await caches.match(
"./offline.html"
);

if(
offlinePage
){

return offlinePage;

}

return new Response(

"Offline",

{

status:503,

headers:{

"Content-Type":
"text/plain"

}

}

);

}

// file lain ambil dari cache
const cachedFile =
await caches.match(
event.request
);

if(
cachedFile
){

return cachedFile;

}

// fallback terakhir
return new Response(

"Offline",

{

status:503,

headers:{

"Content-Type":
"text/plain"

}

}

);

}

})()

);

});