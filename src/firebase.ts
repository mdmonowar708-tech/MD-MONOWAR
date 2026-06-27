import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAOBUkkt6zGBgOfcHDG-MpnJQuH98ke1mQ",
    authDomain: "mcq-preparation-app.firebaseapp.com",
    projectId: "mcq-preparation-app",
    storageBucket: "mcq-preparation-app.firebasestorage.app",
    messagingSenderId: "334888199318",
    appId: "1:334888199318:web:f8e078cb087749bbbfceb7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);

export const testConnection = async () => {
    return true;
};
