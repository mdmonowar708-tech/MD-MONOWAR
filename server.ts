import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import firebaseConfig from './firebase-applet-config.json';
import fs from 'fs';
import { GoogleGenAI } from "@google/genai";

// Initialize AI (lazy)
let cachedAi: GoogleGenAI | null = null;
function getAi() {
    if (!cachedAi) {
        cachedAi = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY!,
            httpOptions: {
                headers: {
                    'User-Agent': 'aistudio-build',
                }
            }
        });
    }
    return cachedAi;
}

// Lazy initialize Firebase Admin
let cachedApp: any = null;
let cachedDb: any = null;
let cachedMessaging: any = null;

function getFirebaseAdmin() {
  if (!cachedApp) {
    let credential;

    // 1. Check if Service Account JSON is provided via Environment Variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        console.log("Using FIREBASE_SERVICE_ACCOUNT environment variable for Firebase authentication.");
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = cert(serviceAccount);
      } catch (err) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env variable:", err);
      }
    }

    // 2. Check if firebase-service-account.json file exists
    if (!credential) {
      const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');
      if (fs.existsSync(serviceAccountPath)) {
        try {
          console.log("Using firebase-service-account.json file for Firebase authentication.");
          const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
          credential = cert(serviceAccount);
        } catch (err) {
          console.error("Failed to parse firebase-service-account.json file:", err);
        }
      }
    }

    // 3. Fallback to Application Default Credentials
    if (!credential) {
      console.log("Using Application Default Credentials (ADC) for Firebase authentication.");
      credential = applicationDefault();
    }

    cachedApp = initializeApp({
      credential,
      projectId: firebaseConfig.projectId,
    });
  }
  return cachedApp;
}

function getDb() {
  if (!cachedDb) {
    const app = getFirebaseAdmin();
    cachedDb = getFirestore(app);
    if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)") {
      cachedDb.settings({
          databaseId: firebaseConfig.firestoreDatabaseId
      });
    }
  }
  return cachedDb;
}

function getMessagingInstance() {
  if (!cachedMessaging) {
    const app = getFirebaseAdmin();
    cachedMessaging = getMessaging(app);
  }
  return cachedMessaging;
}


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route to ask AI
  app.post("/api/ask-ai", async (req, res) => {
    const { text, image } = req.body;
    if (!text && !image) {
      return res.status(400).json({ error: "Missing prompt or image" });
    }

    try {
      const contents: any[] = [];
      if (image) {
        contents.push({
          inlineData: {
            mimeType: image.mimeType || "image/jpeg",
            data: image.data,
          },
        });
      }
      if (text) {
        contents.push({ text });
      }

      const response = await getAi().models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: contents },
      });
      res.json({ answer: response.text });
    } catch (error) {
      console.error("Error asking AI:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // API route to save user FCM token
  app.post("/api/save-token", async (req, res) => {
    const { uid, token } = req.body;

    if (!uid || !token) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        await getDb().collection("users").doc(uid).set({
            fcmToken: token
        }, { merge: true });
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving token:", error);
        res.status(500).json({ error: "Failed to save token" });
    }
  });

  // API route to send notification
  app.post("/api/send-notification", async (req, res) => {
    const { targetUid, title, body } = req.body;

    if (!targetUid || !title || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Fetch user token (this requires Firestore Admin SDK)
        const userDoc = await getDb().collection("users").doc(targetUid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const fcmToken = userDoc.data()?.fcmToken;
        if (!fcmToken) {
            return res.status(404).json({ error: "User has no push token" });
        }

        const message = {
            notification: {
                title: title,
                body: body
            },
            token: fcmToken
        };

        const response = await getMessagingInstance().send(message);
        res.json({ success: true, messageId: response });
    } catch (error: any) {
        console.error("Error sending notification:", error);
        let errorMsg = error.message || JSON.stringify(error);
        if (errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("Quota exceeded") || (error.code && error.code === "messaging/quota-exceeded")) {
            errorMsg = "Firebase Cloud Messaging (FCM) API Quota Limit Exceeded (RESOURCE_EXHAUSTED). Please check your Google Cloud Console FCM Quota settings (https://console.cloud.google.com/apis/api/fcm.googleapis.com/quotas) and Firebase Plan.";
        }
        res.status(500).json({ error: errorMsg });
    }
  });

  // API route to send notification to all users
  app.post("/api/send-all-notification", async (req, res) => {
    const { title, body } = req.body;
    console.log("Received request to send-all-notification:", { title, body });

    if (!title || !body) {
      console.log("Missing fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const usersSnapshot = await getDb().collection("users").where("fcmToken", ">", "").get();
        console.log("Fetched users, count:", usersSnapshot.size);
        const tokens: string[] = [];
        
        usersSnapshot.forEach(doc => {
            const token = doc.data().fcmToken;
            if (token) {
                tokens.push(token);
            }
        });

        console.log("Tokens found:", tokens.length);

        if (tokens.length === 0) {
            console.log("No tokens found");
            return res.status(404).json({ error: "No users with push tokens found" });
        }

        // Messaging.sendEachForMulticast only supports up to 500 tokens
        console.log("Sending multicast message in chunks of 500");
        
        const chunks = [];
        for (let i = 0; i < tokens.length; i += 500) {
            chunks.push(tokens.slice(i, i + 500));
        }

        let successCount = 0;
        let failureCount = 0;

        for (const chunk of chunks) {
            const message = {
                notification: {
                    title: title,
                    body: body
                },
                tokens: chunk
            };
            const response = await getMessagingInstance().sendEachForMulticast(message);
            successCount += response.successCount;
            failureCount += response.failureCount;
        }
        
        // Log to history
        await getDb().collection("notificationHistory").add({
            title: title,
            body: body,
            timestamp: new Date(),
            successCount: successCount,
            failureCount: failureCount
        });
        
        console.log("Responses summarized:", { successCount, failureCount });
        res.json({ success: true, successCount, failureCount });
    } catch (error: any) {
        console.error("Error sending notification to all:", error);
        let errorMsg = error.message || JSON.stringify(error);
        if (errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("Quota exceeded") || (error.code && error.code === "messaging/quota-exceeded")) {
            errorMsg = "Firebase Cloud Messaging (FCM) API Quota Limit Exceeded (RESOURCE_EXHAUSTED). This usually happens when your Firebase Project has exceeded its daily or rate limits for push notifications. To resolve this:\n1. Check your Google Cloud Console FCM Quota settings (https://console.cloud.google.com/apis/api/fcm.googleapis.com/quotas)\n2. Check your Firebase Plan and pricing limits.";
        }
        res.status(500).json({ error: errorMsg });
    }
  });

  // API route to get notification history
  app.get("/api/notification-history", async (req, res) => {
      try {
          const snapshot = await getDb().collection("notificationHistory").orderBy("timestamp", "desc").limit(50).get();
          const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp.toDate() }));
          res.json(history);
      } catch (error: any) {
          console.error("Error fetching notification history:", error);
          let errorMsg = error.message || JSON.stringify(error);
          if (errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("Quota exceeded")) {
            errorMsg = "Firebase Quota Limit Exceeded (RESOURCE_EXHAUSTED). Please check your Firebase plan and usage limits in the Google Cloud Console.";
          }
          res.status(500).json({ error: errorMsg });
      }
  });

  // Explicit route for service worker
  app.get('/firebase-messaging-sw.js', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'firebase-messaging-sw.js'));
  });

  // API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
