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

// BACKGROUND NOTIF
messaging.onBackgroundMessage((payload) => {
  console.log("Background message:", payload);

  const title = payload?.notification?.title || "Notifikasi";
  const body = payload?.notification?.body || "";

  const url = payload?.data?.url || "/home.html";

  self.registration.showNotification(title, {
    body: body,
    icon: "/assets/images/launchericon-192x192.png",
    data: {
      url: url
    }
  });
});

// KLIK NOTIF → BUKA HALAMAN
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url = event.notification.data?.url;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {

      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});