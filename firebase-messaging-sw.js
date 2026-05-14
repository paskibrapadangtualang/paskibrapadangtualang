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

messaging.onBackgroundMessage((payload) => {

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "assets/images/launchericon-192x192.png"
    }
  );

});