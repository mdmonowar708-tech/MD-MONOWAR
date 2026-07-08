importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAOBUkkt6zGBgOfcHDG-MpnJQuH98ke1mQ",
  projectId: "mcq-preparation-app",
  messagingSenderId: "334888199318",
  appId: "1:334888199318:web:f8e078cb087749bbbfceb7"
});

const messaging = firebase.messaging();
