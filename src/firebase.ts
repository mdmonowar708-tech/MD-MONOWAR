import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

// MCQ HERO Firebase Client Configuration using user credentials
const firebaseConfig = {
  apiKey: "AIzaSyAOBUkkt6zGBgOfcHDG-MpnJQuH98ke1mQ",
  authDomain: "mcq-preparation-app.firebaseapp.com",
  projectId: "mcq-preparation-app",
  storageBucket: "mcq-preparation-app.firebasestorage.app",
  messagingSenderId: "334888199318",
  appId: "1:334888199318:web:f8e078cb087749bbbfceb7"
};

// Lazy initialization or existing app retrieval
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Connectivity check helper
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "settings", "app_config"));
    console.log("Firebase connected successfully");
    return true;
  } catch (error) {
    console.warn("Firebase offline or setting not found, continuing with simulation support:", error);
    return false;
  }
}
