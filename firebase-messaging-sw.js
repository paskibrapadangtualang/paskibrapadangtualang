importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBextWTeGMT1x9c1MHOv4GoHXP8OgW2WsY",
  authDomain: "paskibra2026-300eb.firebaseapp.com",
  projectId: "paskibra2026-300eb",
  messagingSenderId: "937469132434",
  appId: "1:937469132434:web:d1924e1160350000d1b04b"
});

const messaging = firebase.messaging();


// ===============================
// BACKGROUND NOTIFICATION
// ===============================

messaging.onBackgroundMessage((payload) => {

  console.log("BACKGROUND MESSAGE:", payload);

  const title =
    payload?.notification?.title || "Postingan Baru";

  const body =
    payload?.notification?.body || "";

  const postId =
    payload?.data?.postId || "";

  const url =
    payload?.data?.url ||
    "/detailpostingan.html?id=" + postId;

  self.registration.showNotification(title, {
    body: body,

    icon: "/assets/images/launchericon-192x192.png",

    badge: "/assets/images/launchericon-192x192.png",

    data: {
      url: url,
      postId: postId
    }

  });

});


// ===============================
// CLICK NOTIFICATION
// ===============================

self.addEventListener(
  "notificationclick",
  function(event) {

    event.notification.close();

    const url =
      event.notification.data?.url ||
      "/home.html";

    event.waitUntil(

      clients.matchAll({
        type: "window",
        includeUncontrolled: true
      }).then((clientList) => {

        for (const client of clientList) {

          if ("focus" in client) {

            client.navigate(url);

            return client.focus();

          }

        }

        if (clients.openWindow) {

          return clients.openWindow(url);

        }

      })

    );

  }

);