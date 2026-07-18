import { doc, getDoc, updateDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ShopItem, SHOP_ITEMS } from "./ShopItem.ts";

export interface MysteryBoxReward {
    type: "xp_50" | "xp_100" | "badge_rare" | "theme_special" | "double_xp_1d" | "coins_refund_150" | "coins_refund_100";
    label: string;
    bengaliLabel: string;
    description: string;
    icon: string;
}

export class ShopService {
    /**
     * Get user reference in Firestore
     */
    private static getUserRef(uid: string) {
        const db = (window as any).db;
        if (!db) throw new Error("Firebase database instance not found.");
        return doc(db, "users", uid);
    }

    /**
     * Purchase an item from the shop using Coins
     */
    static async purchaseItem(uid: string, itemId: string): Promise<{ success: boolean; error?: string; updatedData?: any }> {
        if (!uid) return { success: false, error: "User not logged in." };
        
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return { success: false, error: "Item not found." };

        try {
            const userRef = this.getUserRef(uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                return { success: false, error: "User profile not found." };
            }

            const data = userSnap.data();
            const coins = data.coins ?? 0;
            const ownedItems = data.ownedItems ?? [];

            // 1. Double-check ownership
            if (ownedItems.includes(itemId) && item.category !== "hint" && item.category !== "mystery") {
                return { success: false, error: "আপনি ইতিমধ্যে এই আইটেমটি কিনেছেন!" };
            }

            // 2. Check funds
            if (coins < item.price) {
                return { success: false, error: "not_enough_coins" };
            }

            // Prepare update object
            const updates: any = {
                coins: increment(-item.price)
            };

            // Non-consumables are added to ownedItems
            if (item.category !== "hint" && item.category !== "mystery") {
                updates.ownedItems = arrayUnion(itemId);
            }

            // Handle specific item types
            if (item.category === "hint") {
                updates.hintTokens = increment(1);
            } else if (item.category === "double_xp") {
                const currentExpiry = data.doubleXpExpiry;
                let baseTime = Date.now();
                
                if (currentExpiry) {
                    const existingExpiryMs = typeof currentExpiry.toDate === "function" 
                        ? currentExpiry.toDate().getTime() 
                        : new Date(currentExpiry).getTime();
                    
                    if (existingExpiryMs > Date.now()) {
                        baseTime = existingExpiryMs; // Stack time
                    }
                }
                
                const dayInMs = 24 * 60 * 60 * 1000;
                updates.doubleXpExpiry = new Date(baseTime + dayInMs).toISOString();
            }

            // Save to Firebase
            await updateDoc(userRef, updates);
            
            // Get freshly updated document
            const updatedSnap = await getDoc(userRef);
            return { success: true, updatedData: updatedSnap.data() };
        } catch (err: any) {
            console.error("Shop purchase transaction failed:", err);
            return { success: false, error: err.message || "পেমেন্ট সম্পন্ন করতে সমস্যা হয়েছে।" };
        }
    }

    /**
     * Equip an owned theme or avatar frame
     */
    static async equipItem(uid: string, itemId: string, category: "theme" | "frame"): Promise<{ success: boolean; error?: string }> {
        if (!uid) return { success: false, error: "User not logged in." };

        try {
            const userRef = this.getUserRef(uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                return { success: false, error: "User profile not found." };
            }

            const data = userSnap.data();
            const ownedItems = data.ownedItems ?? [];

            // Verify ownership (except empty string which means default)
            if (itemId !== "" && !ownedItems.includes(itemId)) {
                return { success: false, error: "প্রথমে এই আইটেমটি ক্রয় করুন।" };
            }

            const updates: any = {};
            if (category === "theme") {
                updates.activeTheme = itemId;
            } else if (category === "frame") {
                updates.avatarFrame = itemId;
            }

            await updateDoc(userRef, updates);
            return { success: true };
        } catch (err: any) {
            console.error("Failed to equip item:", err);
            return { success: false, error: err.message || "আইটেমটি সেট করতে সমস্যা হয়েছে।" };
        }
    }

    /**
     * Open a Mystery Box
     * Deducts 100 coins and rolls a random reward with weights.
     */
    static async openMysteryBox(uid: string): Promise<{ success: boolean; error?: string; reward?: MysteryBoxReward; updatedData?: any }> {
        if (!uid) return { success: false, error: "User not logged in." };

        try {
            const userRef = this.getUserRef(uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                return { success: false, error: "User profile not found." };
            }

            const data = userSnap.data();
            const coins = data.coins ?? 0;

            if (coins < 100) {
                return { success: false, error: "not_enough_coins" };
            }

            // Define Mystery Box Rewards with probabilities
            const rewardsList: { reward: MysteryBoxReward; weight: number }[] = [
                {
                    weight: 25, // 25%
                    reward: {
                        type: "xp_50",
                        label: "+50 XP Boost",
                        bengaliLabel: "+৫০ এক্সপি (XP) বৃদ্ধি!",
                        description: "আপনার স্টাডি লেভেল দ্রুত বাড়াতে সাহায্য করবে।",
                        icon: "⭐"
                    }
                },
                {
                    weight: 20, // 20%
                    reward: {
                        type: "xp_100",
                        label: "+100 Super XP Boost",
                        bengaliLabel: "+১০০ সুপার এক্সপি (XP) বৃদ্ধি!",
                        description: "মহা অভিজ্ঞতার সঞ্চার হলো!",
                        icon: "🌟"
                    }
                },
                {
                    weight: 15, // 15%
                    reward: {
                        type: "double_xp_1d",
                        label: "Double XP (1 Day)",
                        bengaliLabel: "১ দিনের ডাবল এক্সপি কার্ড!",
                        description: "আগামী ২৪ ঘণ্টা আপনার পড়াশোনা দ্বিগুণ দ্রুতগতিতে চলবে।",
                        icon: "⚡"
                    }
                },
                {
                    weight: 15, // 15%
                    reward: {
                        type: "coins_refund_100",
                        label: "100 Coins Refund",
                        bengaliLabel: "১০০ কয়েন ফেরত (১০০% রিফান্ড!)",
                        description: "আপনার কয়েন সম্পূর্ণ ফেরত দেওয়া হলো!",
                        icon: "🪙"
                    }
                },
                {
                    weight: 10, // 10%
                    reward: {
                        type: "coins_refund_150",
                        label: "150 Coins Jackpot",
                        bengaliLabel: "১৫০ কয়েন জ্যাকপট বোনাস!",
                        description: "বক্সের মূল্যের চেয়ে বেশি ৫০ কয়েন অতিরিক্ত লাভ!",
                        icon: "💰"
                    }
                },
                {
                    weight: 10, // 10%
                    reward: {
                        type: "theme_special",
                        label: "Mystery Rainbow Theme",
                        bengaliLabel: "অপূর্ব রেইনবো প্রোফাইল থিম!",
                        description: "আপনার প্রোফাইল কার্ডকে অসাধারণ নিয়ন-রংধনুর রঙে ফুটিয়ে তুলুন।",
                        icon: "🌈"
                    }
                },
                {
                    weight: 5, // 5%
                    reward: {
                        type: "badge_rare",
                        label: "Legendary Mystery Badge",
                        bengaliLabel: "লেজেন্ডারি মিস্ট্রি ব্যাজ!",
                        description: "শুধুমাত্র ভাগ্যশালীদের অর্জিত অত্যন্ত দুর্লভ একটি মেডেল!",
                        icon: "🏅"
                    }
                }
            ];

            // Select random item based on weights
            const totalWeight = rewardsList.reduce((acc, r) => acc + r.weight, 0);
            let randomRoll = Math.random() * totalWeight;
            let selectedReward: MysteryBoxReward | null = null;

            for (const item of rewardsList) {
                randomRoll -= item.weight;
                if (randomRoll <= 0) {
                    selectedReward = item.reward;
                    break;
                }
            }

            if (!selectedReward) {
                selectedReward = rewardsList[0].reward; // Fallback
            }

            // Prepare Firestore updates
            const updates: any = {
                coins: increment(-100), // Mystery box cost
                mysteryBoxesOpened: increment(1)
            };

            // Apply chosen reward changes
            if (selectedReward.type === "xp_50") {
                updates.xp = increment(50);
            } else if (selectedReward.type === "xp_100") {
                updates.xp = increment(100);
            } else if (selectedReward.type === "coins_refund_100") {
                updates.coins = increment(-100 + 100); // Net 0
            } else if (selectedReward.type === "coins_refund_150") {
                updates.coins = increment(-100 + 150); // Net +50
            } else if (selectedReward.type === "double_xp_1d") {
                const currentExpiry = data.doubleXpExpiry;
                let baseTime = Date.now();
                if (currentExpiry) {
                    const existingExpiryMs = typeof currentExpiry.toDate === "function" 
                        ? currentExpiry.toDate().getTime() 
                        : new Date(currentExpiry).getTime();
                    if (existingExpiryMs > Date.now()) {
                        baseTime = existingExpiryMs;
                    }
                }
                updates.doubleXpExpiry = new Date(baseTime + 24 * 60 * 60 * 1000).toISOString();
            } else if (selectedReward.type === "theme_special") {
                updates.ownedItems = arrayUnion("theme_mystery_rainbow");
                updates.activeTheme = "theme_mystery_rainbow"; // Equip immediately!
            } else if (selectedReward.type === "badge_rare") {
                updates.badges = arrayUnion("rare_mystery_badge");
            }

            // Save updates in Firestore
            await updateDoc(userRef, updates);

            // Fetch newly refreshed data
            const updatedSnap = await getDoc(userRef);
            return {
                success: true,
                reward: selectedReward,
                updatedData: updatedSnap.data()
            };
        } catch (err: any) {
            console.error("Error opening mystery box:", err);
            return { success: false, error: err.message || "মিস্ট্রি বক্স খুলতে সমস্যা হয়েছে।" };
        }
    }
}
