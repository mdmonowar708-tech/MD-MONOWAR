import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import firebaseConfig from "../firebase-applet-config.json";
import html2pdf from 'html2pdf.js';
(window as any).html2pdf = html2pdf;

const app = initializeApp(firebaseConfig);
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

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
