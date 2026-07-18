import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc, getDocFromServer } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import firebaseConfig from "../firebase-applet-config.json";
import html2pdf from 'html2pdf.js';
(window as any).html2pdf = html2pdf;

const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent local cache to gracefully handle network issues / offline state
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    }),
    experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)" ? firebaseConfig.firestoreDatabaseId : undefined);

export const auth = getAuth(app);
export const messaging = getMessaging(app);

export const testConnection = async () => {
    try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        return true;
    } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
            console.error("Please check your Firebase configuration.");
        }
        return false;
    }
};
