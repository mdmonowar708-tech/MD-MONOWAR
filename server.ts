import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

// Initialize Firebase Admin
initializeApp({
  credential: applicationDefault(),
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route to save user FCM token
  app.post("/api/save-token", async (req, res) => {
    const { uid, token } = req.body;

    if (!uid || !token) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        await getFirestore().collection("users").doc(uid).set({
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
        const userDoc = await getFirestore().collection("users").doc(targetUid).get();
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

        const response = await getMessaging().send(message);
        res.json({ success: true, messageId: response });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ error: "Failed to send notification" });
    }
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
