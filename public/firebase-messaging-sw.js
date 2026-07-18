importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAOBUkkt6zGBgOfcHDG-MpnJQuH98ke1mQ",
  projectId: "mcq-preparation-app",
  messagingSenderId: "334888199318",
  appId: "1:334888199318:web:f8e078cb087749bbbfceb7"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || "নতুন নোটিফিকেশন";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: '/app_icon.png',
    badge: '/app_icon.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
