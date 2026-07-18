import { doc, getDoc, updateDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export interface UserProgressData {
    xp: number;
    coins: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastChallengeDate: string; // YYYY-MM-DD local format
    dailyChallengeCompleted: boolean;
    practiceQuestionsSolved: number;
    mockTestsCompleted: number;
    badges: string[];
}

export const XP_RULES = {
    daily_challenge: 50,
    practice_quiz: 10,
    mock_test: 30,
    study_note: 5,
    current_affairs: 10,
    perfect_score: 20
};

export const COIN_RULES = {
    daily_challenge: 20,
    practice_quiz: 5,
    mock_test: 15,
    perfect_score: 10
};

export function getRequiredXpForLevel(level: number): number {
    if (level <= 1) return 0;
    // Level 1: 0 XP
    // Level 2: 100 XP
    // Level 3: 250 XP (+150)
    // Level 4: 450 XP (+200)
    // Level 5: 700 XP (+250)
    // Level N: (level - 1) * (50 + 25 * level)
    return (level - 1) * (50 + 25 * level);
}

export function getLevelForXp(xp: number): number {
    let level = 1;
    while (xp >= getRequiredXpForLevel(level + 1)) {
        level++;
    }
    return level;
}

export class GamificationService {
    /**
     * Get the current date in local YYYY-MM-DD string format
     */
    static getLocalDateString(): string {
        return new Date().toLocaleDateString('en-CA'); // 'en-CA' always returns YYYY-MM-DD
    }

    /**
     * Set up and fill missing gamification fields on the current user
     */
    static async initializeUserIfNeeded(uid: string, existingData: any): Promise<void> {
        if (!uid) return;
        const db = (window as any).db;
        if (!db) return;

        const needsInit = 
            existingData.xp === undefined || 
            existingData.coins === undefined || 
            existingData.level === undefined || 
            existingData.currentStreak === undefined;

        if (needsInit) {
            const initialFields = {
                xp: existingData.xp ?? 0,
                coins: existingData.coins ?? 0,
                level: existingData.level ?? 1,
                currentStreak: existingData.currentStreak ?? 0,
                longestStreak: existingData.longestStreak ?? 0,
                lastChallengeDate: existingData.lastChallengeDate ?? "",
                dailyChallengeCompleted: existingData.dailyChallengeCompleted ?? false,
                practiceQuestionsSolved: existingData.practiceQuestionsSolved ?? 0,
                mockTestsCompleted: existingData.mockTestsCompleted ?? 0,
                badges: existingData.badges ?? []
            };

            try {
                await updateDoc(doc(db, "users", uid), initialFields);
                console.log("Gamification profile successfully initialized for uid:", uid);
            } catch (err) {
                console.error("Failed to initialize gamification profile:", err);
            }
        } else {
            // Check if user's streak was broken yesterday
            const todayStr = this.getLocalDateString();
            const lastDate = existingData.lastChallengeDate || "";

            if (lastDate && lastDate !== todayStr) {
                const today = new Date(todayStr);
                const last = new Date(lastDate);
                const diffTime = Math.abs(today.getTime() - last.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 1) {
                    // Broken streak! Reset to 0
                    try {
                        await updateDoc(doc(db, "users", uid), {
                            currentStreak: 0,
                            dailyChallengeCompleted: false
                        });
                        console.log("Streak reset because user missed yesterday.");
                    } catch (err) {
                        console.error("Failed to reset missed streak:", err);
                    }
                }
            }
        }
    }

    /**
     * Process rewards for completed activity
     */
    static async rewardActivity(
        uid: string, 
        activityType: "daily_challenge" | "practice_quiz" | "mock_test" | "study_note" | "current_affairs", 
        isPerfect: boolean = false
    ): Promise<{ xpGained: number; coinsGained: number; isLevelUp: boolean; streakIncremented: boolean; currentStreak: number }> {
        if (!uid) return { xpGained: 0, coinsGained: 0, isLevelUp: false, streakIncremented: false, currentStreak: 0 };
        const db = (window as any).db;
        if (!db) return { xpGained: 0, coinsGained: 0, isLevelUp: false, streakIncremented: false, currentStreak: 0 };

        // 1. Calculate base rewards
        let xpGained = XP_RULES[activityType] || 0;
        let coinsGained = COIN_RULES[activityType] || 0;

        if (isPerfect) {
            xpGained += XP_RULES.perfect_score;
            coinsGained += COIN_RULES.perfect_score;
        }

        // 2. Fetch current status
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            return { xpGained: 0, coinsGained: 0, isLevelUp: false, streakIncremented: false, currentStreak: 0 };
        }

        const data = userSnap.data();
        const currentXp = data.xp ?? 0;
        const currentCoins = data.coins ?? 0;
        const currentLevel = data.level ?? 1;
        const oldStreak = data.currentStreak ?? 0;
        const oldLongest = data.longestStreak ?? 0;
        const lastChallengeDate = data.lastChallengeDate ?? "";

        const newXp = currentXp + xpGained;
        const newLevel = getLevelForXp(newXp);
        const isLevelUp = newLevel > currentLevel;

        const updates: any = {
            xp: increment(xpGained),
            coins: increment(coinsGained)
        };

        if (isLevelUp) {
            updates.level = newLevel;
        }

        // Handle activity counts
        if (activityType === "practice_quiz") {
            updates.practiceQuestionsSolved = increment(1);
        } else if (activityType === "mock_test") {
            updates.mockTestsCompleted = increment(1);
        }

        // 3. Handle streak for daily_challenge
        let streakIncremented = false;
        let finalStreak = oldStreak;
        let bonusCoins = 0;
        let badgeEarned = "";

        if (activityType === "daily_challenge") {
            const todayStr = this.getLocalDateString();

            if (lastChallengeDate !== todayStr) {
                // Streak logic
                let newStreak = 1;
                if (lastChallengeDate) {
                    const lastDate = new Date(lastChallengeDate);
                    const todayDate = new Date(todayStr);
                    const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        newStreak = oldStreak + 1;
                    }
                }

                streakIncremented = true;
                finalStreak = newStreak;
                updates.currentStreak = newStreak;
                updates.lastChallengeDate = todayStr;
                updates.dailyChallengeCompleted = true;

                if (newStreak > oldLongest) {
                    updates.longestStreak = newStreak;
                }

                // Check streak milestones
                if (newStreak === 7) {
                    bonusCoins = 100;
                    updates.coins = increment(coinsGained + bonusCoins);
                } else if (newStreak === 30) {
                    badgeEarned = "30_days_streak";
                    updates.badges = arrayUnion("30_days_streak");
                }
            } else {
                // Already completed challenge today - just award XP and Coins normally without updating streak again
                updates.dailyChallengeCompleted = true;
            }
        }

        // Apply Firestore updates
        await updateDoc(userRef, updates);

        // Show UI rewards popup
        this.showRewardModal({
            activityType,
            xpGained,
            coinsGained: coinsGained + bonusCoins,
            isPerfect,
            isLevelUp,
            oldLevel: currentLevel,
            newLevel,
            streakIncremented,
            currentStreak: finalStreak,
            badgeEarned
        });

        if (isLevelUp) {
            this.triggerConfetti();
        }

        return {
            xpGained,
            coinsGained: coinsGained + bonusCoins,
            isLevelUp,
            streakIncremented,
            currentStreak: finalStreak
        };
    }

    /**
     * Show beautiful success Reward Modal
     */
    static showRewardModal(rewards: {
        activityType: string;
        xpGained: number;
        coinsGained: number;
        isPerfect: boolean;
        isLevelUp: boolean;
        oldLevel: number;
        newLevel: number;
        streakIncremented: boolean;
        currentStreak: number;
        badgeEarned: string;
    }) {
        // Create or find modal container
        let modal = document.getElementById("gamification-reward-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "gamification-reward-modal";
            modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); z-index: 102500; display: none; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box; font-family: 'Inter', sans-serif;";
            document.body.appendChild(modal);
        }

        const titleText = rewards.isLevelUp ? "🎉 লেভেল আপ! (LEVEL UP!)" : "🎉 চমৎকার পারফরম্যান্স!";
        const activityLabel = {
            daily_challenge: "ডেইলি চ্যালেঞ্জ সম্পন্ন",
            practice_quiz: "অনুশীলন কুইজ সম্পন্ন",
            mock_test: "মক টেস্ট সম্পন্ন",
            study_note: "স্টাডি নোট রিডিং সম্পন্ন",
            current_affairs: "কারেন্ট অ্যাফেয়ার্স সম্পন্ন"
        }[rewards.activityType] || "পড়াশোনা সম্পন্ন";

        const streakHTML = rewards.streakIncremented ? `
            <div style="background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.2); border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 20px;">🔥</span>
                    <div style="text-align: left;">
                        <span style="font-size: 14px; font-weight: 800; color: #EA580C; display: block;">${rewards.currentStreak} দিনের স্ট্রেইক!</span>
                        <span style="font-size: 10px; color: #9A3412;">প্রতিদিন পড়াশোনা বজায় রাখুন!</span>
                    </div>
                </div>
                <span style="background: #EA580C; color: white; font-size: 9px; font-weight: 900; padding: 2px 7px; border-radius: 999px;">🔥 STREAK +1</span>
            </div>
        ` : "";

        const levelUpHTML = rewards.isLevelUp ? `
            <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); border-radius: 14px; padding: 12px; color: white; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25); animation: pulse 2s infinite;">
                <span style="font-size: 24px; display: block;">⭐ LEVEL UP! ⭐</span>
                <span style="font-size: 15px; font-weight: 900;">আপনি লেভেল ${rewards.newLevel} এ উন্নীত হয়েছেন!</span>
                <span style="font-size: 10px; color: rgba(255,255,255,0.8);">নতুন লেভেল এ আপনার জন্য আরও নতুন সুযোগ অপেক্ষা করছে!</span>
            </div>
        ` : "";

        const badgeHTML = rewards.badgeEarned ? `
            <div style="background: rgba(147, 51, 234, 0.1); border: 1px solid rgba(147, 51, 234, 0.2); border-radius: 12px; padding: 10px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <span style="font-size: 32px; animation: bounce 1.5s infinite;">🏅</span>
                <span style="font-size: 13px; font-weight: 800; color: #7E22CE;">নতুন ব্যাজ অর্জন: ৩০ দিনের স্ট্রেইক হিরো!</span>
                <span style="font-size: 10px; color: #6B21A8;">আপনার প্রোফাইলে এই ব্যাজটি যোগ করা হয়েছে।</span>
            </div>
        ` : "";

        modal.innerHTML = `
            <div style="background: white; border-radius: 24px; max-width: 360px; width: 100%; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.3); border: 1px solid #E2E8F0; padding: 20px; overflow: hidden; text-align: center; display: flex; flex-direction: column; gap: 16px; animation: modal-scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); box-sizing: border-box;" class="dark:bg-slate-900 dark:border-slate-800">
                <!-- Emoji Header -->
                <div style="font-size: 48px; margin: 4px 0 0px 0; animation: bounce-header 1s infinite alternate;" id="reward-emoji">🎁</div>

                <!-- Titles -->
                <div>
                    <h3 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0; line-height: 1.2;" class="dark:text-white">${titleText}</h3>
                    <p style="font-size: 12.5px; color: #64748B; margin: 4px 0 0 0; font-weight: 600;" class="dark:text-slate-400">${activityLabel}</p>
                </div>

                <!-- Reward Badges Row -->
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <!-- XP Badge -->
                    <div style="background: #EEF2FF; border: 1.5px solid #C7D2FE; border-radius: 16px; padding: 10px 14px; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;">
                        <span style="font-size: 20px;">⭐</span>
                        <span style="font-size: 16px; font-weight: 900; color: #4338CA;">+${rewards.xpGained} XP</span>
                        <span style="font-size: 9.5px; font-weight: 700; color: #6366F1; text-transform: uppercase;">অভিজ্ঞতা</span>
                    </div>

                    <!-- Coins Badge -->
                    <div style="background: #FEF3C7; border: 1.5px solid #FDE68A; border-radius: 16px; padding: 10px 14px; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;">
                        <span style="font-size: 20px;">🪙</span>
                        <span style="font-size: 16px; font-weight: 900; color: #B45309;">+${rewards.coinsGained}</span>
                        <span style="font-size: 9.5px; font-weight: 700; color: #D97706; text-transform: uppercase;">কয়েন</span>
                    </div>
                </div>

                <!-- Perfect Score Bonus Note if applicable -->
                ${rewards.isPerfect ? `
                    <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 6px 12px; font-size: 11px; font-weight: 700; color: #047857; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
                        🎯 পারফেক্ট স্কোর বোনাস যুক্ত করা হয়েছে! (+২০ XP, +১০ Coins)
                    </div>
                ` : ""}

                <!-- Conditionally render streak / levelUp / badge achievements -->
                ${streakHTML}
                ${levelUpHTML}
                ${badgeHTML}

                <!-- XP Level Progress mini bar -->
                <div style="background: #F1F5F9; border-radius: 12px; padding: 10px; text-align: left;" class="dark:bg-slate-800">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: #475569; margin-bottom: 4px;" class="dark:text-slate-300">
                        <span>লেভেল ${rewards.newLevel}</span>
                        <span>${(window as any).currentUserData?.xp ?? 0} XP</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: #E2E8F0; border-radius: 999px; overflow: hidden;" class="dark:bg-slate-700">
                        <div style="width: ${Math.min(100, (((window as any).currentUserData?.xp ?? 0) / getRequiredXpForLevel(rewards.newLevel + 1)) * 100)}%; height: 100%; background: #4F46E5; border-radius: 999px;"></div>
                    </div>
                </div>

                <!-- Continue Button -->
                <button onclick="document.getElementById('gamification-reward-modal').style.display='none'" style="background: #10B981; color: white; border: none; font-size: 14px; font-weight: 800; padding: 12px; border-radius: 14px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10B981'">
                    চালিয়ে যান 🚀
                </button>
            </div>

            <style>
                @keyframes modal-scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes bounce-header {
                    from { transform: translateY(0); }
                    to { transform: translateY(-8px); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
            </style>
        `;

        modal.style.display = "flex";
    }

    /**
     * Confetti animation effect
     */
    static triggerConfetti() {
        const canvas = document.createElement("canvas");
        canvas.id = "confetti-canvas";
        canvas.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 103000;";
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        interface Particle {
            x: number;
            y: number;
            color: string;
            size: number;
            speedX: number;
            speedY: number;
            rotation: number;
            rotationSpeed: number;
        }

        const colors = ["#FFC107", "#00BFA1", "#2563EB", "#EF4444", "#EC4899", "#8B5CF6", "#10B981"];
        const particles: Particle[] = [];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * -height,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                speedX: Math.random() * 4 - 2,
                speedY: Math.random() * 5 + 3,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: Math.random() * 0.1 - 0.05
            });
        }

        let animationFrameId: number;
        function update() {
            ctx!.clearRect(0, 0, width, height);
            let activeParticles = 0;

            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;

                if (p.y < height) {
                    activeParticles++;
                }

                ctx!.save();
                ctx!.translate(p.x, p.y);
                ctx!.rotate(p.rotation);
                ctx!.fillStyle = p.color;
                ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx!.restore();
            });

            if (activeParticles > 0) {
                animationFrameId = requestAnimationFrame(update);
            } else {
                canvas.remove();
            }
        }

        update();

        // Safety remove after 6 seconds
        setTimeout(() => {
            cancelAnimationFrame(animationFrameId);
            if (canvas.parentNode) canvas.remove();
        }, 6000);
    }
}
