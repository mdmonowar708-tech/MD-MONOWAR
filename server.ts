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
        if (serviceAccount.project_id && serviceAccount.project_id !== firebaseConfig.projectId) {
          console.warn(`⚠️ WARNING: Environment Service Account Project ID (${serviceAccount.project_id}) does not match firebase-applet-config.json Project ID (${firebaseConfig.projectId}). Push notifications may fail due to sender mismatch!`);
        }
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
          if (serviceAccount.project_id && serviceAccount.project_id !== firebaseConfig.projectId) {
            console.warn(`⚠️ WARNING: File Service Account Project ID (${serviceAccount.project_id}) does not match firebase-applet-config.json Project ID (${firebaseConfig.projectId}). Push notifications may fail due to sender mismatch!`);
          }
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

const USERS_FILE = path.join(process.cwd(), 'local_users.json');
const HISTORY_FILE = path.join(process.cwd(), 'local_history.json');
const COURSES_FILE = path.join(process.cwd(), 'local_courses.json');

const DEFAULT_COURSES = [
    { id: "bcs_prep", title: "৪৪তম বিসিএস প্রিলি প্রিপারেশন কোর্স" },
    { id: "primary_exam", title: "প্রাথমিক শিক্ষক নিয়োগ স্পেশাল কোর্স" },
    { id: "bank_job", title: "ব্যাংক জবস কমপ্লিট সল্যুশন" }
];

async function readCoursesLocally(): Promise<any[]> {
    try {
        if (fs.existsSync(COURSES_FILE)) {
            const data = fs.readFileSync(COURSES_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Error reading local courses file:", e);
    }
    return DEFAULT_COURSES;
}

async function writeCoursesLocally(courses: any[]) {
    try {
        fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2), 'utf8');
    } catch (e) {
        console.error("Error writing local courses file:", e);
    }
}

function isQuotaError(error: any): boolean {
    if (!error) return false;
    const str = String(error.message || error);
    return str.includes("RESOURCE_EXHAUSTED") || str.includes("Quota exceeded") || error.code === 8 || error.code === 'RESOURCE_EXHAUSTED';
}

async function readUsersLocally(): Promise<Record<string, { fcmToken: string }>> {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Error reading local users file:", e);
    }
    return {};
}

async function writeUsersLocally(users: Record<string, { fcmToken: string }>) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (e) {
        console.error("Error writing local users file:", e);
    }
}

async function readHistoryLocally(): Promise<any[]> {
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            const data = fs.readFileSync(HISTORY_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Error reading local history file:", e);
    }
    return [];
}

async function writeHistoryLocally(history: any[]) {
    try {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
    } catch (e) {
        console.error("Error writing local history file:", e);
    }
}

const SCHEDULED_FILE = path.join(process.cwd(), 'local_scheduled.json');

interface ScheduledNotification {
    id: string;
    title: string;
    body: string;
    audience: string;
    courseId?: string;
    scheduledTime: string; // ISO string
    status: 'pending' | 'sent' | 'cancelled';
}

async function readScheduledLocally(): Promise<ScheduledNotification[]> {
    try {
        if (fs.existsSync(SCHEDULED_FILE)) {
            const data = fs.readFileSync(SCHEDULED_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Error reading scheduled file:", e);
    }
    return [];
}

async function writeScheduledLocally(notifs: ScheduledNotification[]) {
    try {
        fs.writeFileSync(SCHEDULED_FILE, JSON.stringify(notifs, null, 2), 'utf8');
    } catch (e) {
        console.error("Error writing scheduled file:", e);
    }
}

async function executeNotificationSending(title: string, body: string, audience: string, courseId?: string) {
    const userTokens: { uid: string, token: string }[] = [];
    try {
        const usersSnapshot = await getDb().collection("users").where("fcmToken", ">", "").get();
        console.log(`[Targeting Query] Fetched ${usersSnapshot.size} potential recipients from Firestore`);
        
        const localBackup: Record<string, { fcmToken: string }> = {};
        usersSnapshot.forEach((doc: any) => {
            const data = doc.data();
            const token = data.fcmToken;
            if (token) {
                let matched = true;
                if (audience === "premium") {
                    const isPremium = data.premium === true || data.role === "premium" || data.membership === "premium";
                    if (!isPremium) matched = false;
                } else if (audience === "course" && courseId) {
                    const enrolled = data.enrolledCourses || [];
                    const isEnrolled = enrolled.includes(courseId) || data.courseId === courseId;
                    if (!isEnrolled) matched = false;
                }
                if (matched) {
                    userTokens.push({ uid: doc.id, token });
                }
                localBackup[doc.id] = { fcmToken: token };
            }
        });
        
        if (Object.keys(localBackup).length > 0) {
            await writeUsersLocally(localBackup);
            console.log(`[Targeting Cache] Successfully updated local_users.json with ${Object.keys(localBackup).length} active user tokens.`);
        }
    } catch (error: any) {
        if (isQuotaError(error)) {
            console.warn("⚠️ Firebase Quota Exceeded on fetching users for targeting. Falling back to local storage.");
            const users = await readUsersLocally();
            for (const [uid, udata] of Object.entries(users)) {
                if (udata && udata.fcmToken) {
                    const anyData = udata as any;
                    let matched = true;
                    if (audience === "premium") {
                        const isPremium = anyData.premium === true || anyData.role === "premium" || anyData.membership === "premium";
                        if (!isPremium) matched = false;
                    } else if (audience === "course" && courseId) {
                        const enrolled = anyData.enrolledCourses || [];
                        const isEnrolled = enrolled.includes(courseId) || anyData.courseId === courseId;
                        if (!isEnrolled) matched = false;
                    }
                    if (matched) {
                        userTokens.push({ uid, token: udata.fcmToken });
                    }
                }
            }
        } else {
            throw error;
        }
    }

    if (userTokens.length === 0) {
        const users = await readUsersLocally();
        for (const [uid, udata] of Object.entries(users)) {
            if (udata && udata.fcmToken) {
                const anyData = udata as any;
                let matched = true;
                if (audience === "premium") {
                    const isPremium = anyData.premium === true || anyData.role === "premium" || anyData.membership === "premium";
                    if (!isPremium) matched = false;
                } else if (audience === "course" && courseId) {
                    const enrolled = anyData.enrolledCourses || [];
                    const isEnrolled = enrolled.includes(courseId) || anyData.courseId === courseId;
                    if (!isEnrolled) matched = false;
                }
                if (matched) {
                    userTokens.push({ uid, token: udata.fcmToken });
                }
            }
        }
    }

    const totalTokens = userTokens.length;
    let successCount = 0;
    let failureCount = 0;
    let invalidTokensRemoved = 0;
    const errorGroups: Record<string, number> = {};
    const uidsWithInvalidTokens: string[] = [];

    if (totalTokens > 0) {
        const chunks = [];
        for (let i = 0; i < userTokens.length; i += 500) {
            chunks.push(userTokens.slice(i, i + 500));
        }

        for (const chunk of chunks) {
            const chunkTokens = chunk.map(ut => ut.token);
            const message = {
                notification: { title, body },
                tokens: chunkTokens
            };

            try {
                const response = await getMessagingInstance().sendEachForMulticast(message);
                successCount += response.successCount;
                failureCount += response.failureCount;

                for (let idx = 0; idx < response.responses.length; idx++) {
                    const sendRes = response.responses[idx];
                    if (!sendRes.success && sendRes.error) {
                        const errorCode = sendRes.error.code;
                        errorGroups[errorCode] = (errorGroups[errorCode] || 0) + 1;

                        if (errorCode === "messaging/registration-token-not-registered" || 
                            errorCode === "messaging/invalid-registration-token") {
                            
                            const targetUser = chunk[idx];
                            if (targetUser && targetUser.uid) {
                                uidsWithInvalidTokens.push(targetUser.uid);
                                invalidTokensRemoved++;
                            }
                        }
                    }
                }
            } catch (multicastErr) {
                console.error("Multicast sending error chunk:", multicastErr);
                failureCount += chunk.length;
            }
        }
    }

    // Robust Deletion Loop/Batch processing for failed FCM tokens
    if (uidsWithInvalidTokens.length > 0) {
        console.log(`[FCM Cleanup] Initiating deletion loop/batch for ${uidsWithInvalidTokens.length} invalid tokens.`);
        
        // 1. Bulk Firestore updates in batches of 500
        try {
            const db = getDb();
            const firestoreChunks = [];
            for (let i = 0; i < uidsWithInvalidTokens.length; i += 500) {
                firestoreChunks.push(uidsWithInvalidTokens.slice(i, i + 500));
            }
            for (const chunkUids of firestoreChunks) {
                const batch = db.batch();
                chunkUids.forEach((uid: string) => {
                    batch.update(db.collection("users").doc(uid), { fcmToken: "" });
                });
                await batch.commit();
            }
            console.log(`[FCM Cleanup] Firestore successfully cleaned up ${uidsWithInvalidTokens.length} tokens.`);
        } catch (cleanError) {
            console.error("[FCM Cleanup] Failed to remove tokens from Firestore:", cleanError);
        }

        // 2. Single-pass local JSON file update
        try {
            const users = await readUsersLocally();
            let localChanged = false;
            uidsWithInvalidTokens.forEach((uid: string) => {
                if (users[uid]) {
                    users[uid].fcmToken = "";
                    localChanged = true;
                }
            });
            if (localChanged) {
                await writeUsersLocally(users);
                console.log(`[FCM Cleanup] Local users file successfully cleaned up.`);
            }
        } catch (localErr) {
            console.error("[FCM Cleanup] Failed to update local users file:", localErr);
        }
    }

    const targetLabel = audience === "premium" ? "শুধুমাত্র প্রিমিয়াম" : audience === "course" ? `নির্দিষ্ট কোর্স (${courseId})` : "সকল ব্যবহারকারী";
    
    // Required summary object structured according to specifications
    const historyItem = {
        title,
        body,
        targetAudience: targetLabel,
        totalTokens,
        successCount,
        failureCount,
        invalidTokensRemoved,
        "Total Tokens": totalTokens,
        "Success": successCount,
        "Failure": failureCount,
        "Invalid Removed": invalidTokensRemoved,
        timestamp: new Date().toISOString()
    };

    // Save to Firestore
    try {
        await getDb().collection("notificationHistory").add({
            ...historyItem,
            timestamp: new Date(historyItem.timestamp)
        });
    } catch (historyErr) {
        console.warn("Could not save history item to Firestore, fallback to local:", historyErr);
    }

    // Save to local history JSON file
    try {
        const localHistory = await readHistoryLocally();
        localHistory.unshift({
            id: "local_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            ...historyItem
        });
        await writeHistoryLocally(localHistory.slice(0, 100));
    } catch (localHistoryError) {
        console.error("Failed to save local history:", localHistoryError);
    }

    // Structured and beautifully formatted logs
    console.log("\n=========================================");
    console.log("📬 PUSH NOTIFICATION SENDING REPORT");
    console.log("=========================================");
    console.log(`Title:               "${title}"`);
    console.log(`Audience:            ${targetLabel}`);
    console.log(`Total Tokens:        ${totalTokens}`);
    console.log(`Success count:       ${successCount}`);
    console.log(`Unsuccessful count:  ${failureCount}`);
    console.log(`Invalid Removed:     ${invalidTokensRemoved}`);
    console.log("-----------------------------------------");
    console.log("Status breakdowns by type:");
    if (Object.keys(errorGroups).length > 0) {
        console.log(JSON.stringify(errorGroups, null, 2));
    } else {
        console.log("  (None)");
    }
    console.log("=========================================\n");

    return { successCount, failureCount, invalidTokensRemoved, totalTokens };
}

async function processScheduledNotifications() {
    try {
        const list = await readScheduledLocally();
        const now = new Date();
        let changed = false;

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.status === 'pending') {
                const triggerTime = new Date(item.scheduledTime);
                if (triggerTime <= now) {
                    console.log(`[Scheduler] Triggering scheduled notification: "${item.title}"`);
                    item.status = 'sent';
                    changed = true;
                    // Trigger sending asynchronously
                    executeNotificationSending(item.title, item.body, item.audience, item.courseId)
                        .catch(err => console.error("Error executing scheduled notification:", err));
                }
            }
        }

        if (changed) {
            await writeScheduledLocally(list);
        }
    } catch (e) {
        console.error("Error processing scheduled notifications:", e);
    }
}

// Start the scheduler intervals
setInterval(processScheduledNotifications, 10000);


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
        
        // Also keep local backup synchronized
        const users = await readUsersLocally();
        users[uid] = { fcmToken: token };
        await writeUsersLocally(users);

        res.json({ success: true });
    } catch (error: any) {
        if (isQuotaError(error)) {
            console.warn("⚠️ Firebase Quota Exceeded on saving token. Falling back to local storage.", error.message);
            try {
                const users = await readUsersLocally();
                users[uid] = { fcmToken: token };
                await writeUsersLocally(users);
                return res.json({ success: true, fallback: true });
            } catch (localError) {
                console.error("Local save fallback failed:", localError);
            }
        }

        console.error("Full Error:", error);
        console.error("Code:", error.code);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        res.status(500).json({
            success: false,
            code: error.code,
            message: error.message,
            details: error
        });
    }
  });

  // API route to send notification
  app.post("/api/send-notification", async (req, res) => {
    const { targetUid, title, body } = req.body;

    if (!targetUid || !title || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        let fcmToken: string | undefined;
        try {
            // Fetch user token (this requires Firestore Admin SDK)
            const userDoc = await getDb().collection("users").doc(targetUid).get();
            if (userDoc.exists) {
                fcmToken = userDoc.data()?.fcmToken;
            }
        } catch (error: any) {
            if (isQuotaError(error)) {
                console.warn("⚠️ Firebase Quota Exceeded on fetching user doc. Falling back to local storage.");
                const users = await readUsersLocally();
                fcmToken = users[targetUid]?.fcmToken;
            } else {
                throw error;
            }
        }

        // Fallback check if token is not found or was read from local
        if (!fcmToken) {
            const users = await readUsersLocally();
            fcmToken = users[targetUid]?.fcmToken;
        }

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
        const errorCode = error.code;
        if (errorCode === "messaging/registration-token-not-registered" || 
            errorCode === "messaging/invalid-registration-token") {
            try {
                await getDb().collection("users").doc(targetUid).update({ fcmToken: "" });
            } catch (cleanError: any) {
                if (isQuotaError(cleanError)) {
                    console.warn(`⚠️ Firebase Quota Exceeded on single user token cleanup for user ${targetUid}. Cleared locally only.`);
                } else {
                    console.error(`[FCM Cleanup] Failed to remove token from Firestore for user ${targetUid}:`, cleanError);
                }
            }
            // Always clear locally
            try {
                const users = await readUsersLocally();
                if (users[targetUid]) {
                    users[targetUid].fcmToken = "";
                    await writeUsersLocally(users);
                }
                console.log(`[FCM Cleanup] Automatically removed invalid token locally for single user ${targetUid}`);
            } catch (localError) {
                console.error("Failed to clean up token locally:", localError);
            }
        }

        console.error("Full Error:", error);
        console.error("Code:", error.code);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        res.status(500).json({
            success: false,
            code: error.code,
            message: error.message,
            details: error
        });
    }
  });

  // API route to get courses list
  app.get("/api/courses", async (req, res) => {
    try {
        const snapshot = await getDb().collection("courses").get();
        const courses = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        if (courses.length > 0) {
            await writeCoursesLocally(courses);
            return res.json(courses);
        }
    } catch (e: any) {
        if (isQuotaError(e)) {
            console.warn("⚠️ Firebase Quota Exceeded on fetching courses. Serving from local storage.");
        } else {
            console.warn("Failed fetching courses from Firestore, returning defaults:", e.message || e);
        }
    }
    // Return local backup/default course options
    const localCourses = await readCoursesLocally();
    return res.json(localCourses);
  });

  // API route to get scheduled notifications
  app.get("/api/scheduled-notifications", async (req, res) => {
    try {
        const list = await readScheduledLocally();
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
  });

  // API route to cancel a scheduled notification
  app.post("/api/cancel-scheduled-notification", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "Missing ID" });
    try {
        const scheduled = await readScheduledLocally();
        const updated = scheduled.map(item => {
            if (item.id === id) {
                return { ...item, status: 'cancelled' as const };
            }
            return item;
        });
        await writeScheduledLocally(updated);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
  });

  // API route to get dashboard analytics
  app.get("/api/notification-analytics", async (req, res) => {
    try {
        let history: any[] = [];
        try {
            const snapshot = await getDb().collection("notificationHistory").orderBy("timestamp", "desc").limit(100).get();
            history = snapshot.docs.map((doc: any) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp
                };
            });
        } catch (error: any) {
            if (isQuotaError(error)) {
                console.warn("⚠️ Firebase Quota Exceeded on fetching analytics history. Serving from local storage.");
            } else {
                console.warn("Firestore query failed for analytics history, reading locally:", error.message || error);
            }
            history = await readHistoryLocally();
        }

        if (history.length === 0) {
            history = await readHistoryLocally();
        }

        let totalSent = 0;
        let successCount = 0;
        let failureCount = 0;
        let invalidTokensRemoved = 0;

        history.forEach(item => {
            const succ = Number(item.successCount || 0);
            const fail = Number(item.failureCount || 0);
            successCount += succ;
            failureCount += fail;
            totalSent += (succ + fail);
            invalidTokensRemoved += Number(item.invalidTokensRemoved || 0);
        });

        res.json({
            totalNotifications: history.length,
            totalSent,
            successCount,
            failureCount,
            invalidTokensRemoved,
            history
        });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
  });

  // API route to send notification to users (supports audience filters & scheduling)
  app.post("/api/send-all-notification", async (req, res) => {
    const { title, body, audience, courseId, scheduledTime } = req.body;
    console.log("Received request to send-all-notification with targeting & scheduling options:", { title, body, audience, courseId, scheduledTime });

    if (!title || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const activeAudience = audience || "all";

    if (scheduledTime) {
        try {
            const scheduledList = await readScheduledLocally();
            const newItem: ScheduledNotification = {
                id: "sched_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                title,
                body,
                audience: activeAudience,
                courseId,
                scheduledTime,
                status: 'pending'
            };
            scheduledList.unshift(newItem);
            await writeScheduledLocally(scheduledList);
            return res.json({ success: true, scheduled: true, item: newItem });
        } catch (err) {
            return res.status(500).json({ error: "Failed to schedule notification: " + String(err) });
        }
    }

    try {
        const result = await executeNotificationSending(title, body, activeAudience, courseId);
        res.json({ 
            success: true, 
            totalTokens: result.totalTokens,
            successCount: result.successCount, 
            failureCount: result.failureCount, 
            invalidTokensRemoved: result.invalidTokensRemoved
        });
    } catch (error: any) {
        console.error("Send all notifications error:", error);
        res.status(500).json({
            success: false,
            message: error.message || String(error)
        });
    }
  });

  // API route to get notification history directly (legacy support)
  app.get("/api/notification-history", async (req, res) => {
      try {
          const snapshot = await getDb().collection("notificationHistory").orderBy("timestamp", "desc").limit(50).get();
          const history = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp.toDate() }));
          res.json(history);
      } catch (error: any) {
          if (isQuotaError(error)) {
              console.warn("⚠️ Firebase Quota Exceeded on fetching notification history. Serving from local storage.");
              try {
                  const localHistory = await readHistoryLocally();
                  const parsedLocalHistory = localHistory.map(item => ({
                      ...item,
                      timestamp: new Date(item.timestamp)
                  }));
                  return res.json(parsedLocalHistory);
              } catch (localError) {
                  console.error("Failed to read local history as fallback:", localError);
              }
          }

          res.status(500).json({
              success: false,
              message: error.message
          });
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
