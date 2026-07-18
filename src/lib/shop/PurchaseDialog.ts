/**
 * PurchaseDialog handles all shop visual feedback, dialogs, and animations.
 * Features:
 * - Buying Scale Animation
 * - Insufficient Coins Dialog
 * - Mystery Box Shaking & Bursting Opening Animation
 * - XP Reward Flying Stars Canvas Animation
 * - Coins Refund Flying Coins Canvas Animation
 */

export class PurchaseDialog {
    /**
     * Show Insufficient Coins Dialog
     */
    static showInsufficientCoins() {
        this.closeAllShopModals();

        const modal = document.createElement("div");
        modal.id = "shop-insufficient-modal";
        modal.className = "fixed inset-0 z-[110000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs font-sans";
        modal.style.cssText = "animation: fade-in 0.25s ease-out;";

        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 dark:border-slate-800 transform transition-all scale-100"
                 style="animation: modal-scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                
                <!-- Icon -->
                <div class="text-5xl mb-4 animate-bounce">🪙</div>

                <!-- Header -->
                <h3 class="text-xl font-black text-slate-800 dark:text-white leading-tight">পর্যাপ্ত কয়েন নেই!</h3>
                <p class="text-xs text-amber-600 dark:text-amber-400 font-extrabold mt-1">Not Enough Coins</p>

                <!-- Explanation -->
                <div class="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4 my-5 text-left text-xs font-bold text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                    <div class="flex items-center gap-2">
                        <span>📚</span>
                        <span>অনুশীলন করুন এবং কুইজে অংশ নিন।</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span>🎯</span>
                        <span>মক টেস্টে ভালো স্কোর করে বোনাস জিতুন।</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span>🔥</span>
                        <span>ডেইলি চ্যালেঞ্জ বজায় রেখে স্ট্রেইক ধরে রাখুন।</span>
                    </div>
                </div>

                <p class="text-[11px] text-slate-400 font-bold mb-5">
                    "পড়াশোনা করুন → কয়েন আর্ন করুন → রিওয়ার্ড কিনুন!"
                </p>

                <!-- Buttons -->
                <button onclick="document.getElementById('shop-insufficient-modal').remove()" 
                    class="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold py-3 rounded-2xl cursor-pointer border-none transition-colors text-sm shadow-md">
                    ঠিক আছে, বুঝতে পেরেছি 👍
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Show Generic Purchase Success Dialog
     */
    static showPurchaseSuccess(itemName: string, itemIcon: string, isTheme: boolean = false) {
        this.closeAllShopModals();

        const modal = document.createElement("div");
        modal.id = "shop-success-modal";
        modal.className = "fixed inset-0 z-[110000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs font-sans";
        modal.style.cssText = "animation: fade-in 0.25s ease-out;";

        const ctaText = isTheme ? "প্রোফাইলে ইকুয়িপ করা হয়েছে! 🎨" : "আপনার ইনভেন্টরিতে যোগ করা হয়েছে! 🎉";

        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 dark:border-slate-800 transform transition-all scale-100"
                 style="animation: modal-scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                
                <!-- Confetti background / icon -->
                <div class="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/30 rounded-full text-4xl shadow-inner animate-pulse">
                    ${itemIcon}
                    <span class="absolute -top-1 -right-1 text-2xl animate-spin" style="animation-duration: 3s;">✨</span>
                </div>

                <!-- Header -->
                <h3 class="text-xl font-black text-slate-800 dark:text-white leading-tight">ক্রয় সফল হয়েছে!</h3>
                <p class="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">Purchase Successful</p>

                <!-- Details -->
                <div class="my-5">
                    <p class="text-sm font-extrabold text-slate-700 dark:text-slate-200">"${itemName}"</p>
                    <p class="text-xs font-bold text-emerald-500 mt-2">${ctaText}</p>
                </div>

                <!-- Close -->
                <button onclick="document.getElementById('shop-success-modal').remove()" 
                    class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3 rounded-2xl cursor-pointer border-none transition-colors text-sm shadow-md">
                    দুর্দান্ত! 🚀
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // Trigger particles
        this.triggerFlyingStars(window.innerWidth / 2, window.innerHeight / 2 - 100);
    }

    /**
     * Show Mystery Box Shaking & Bursting Animation
     */
    static showMysteryBoxOpening(rewardLabel: string, rewardIcon: string, rewardDesc: string, rewardType: string, onComplete: () => void) {
        this.closeAllShopModals();

        const modal = document.createElement("div");
        modal.id = "shop-mystery-modal";
        modal.className = "fixed inset-0 z-[110000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm font-sans";
        
        modal.innerHTML = `
            <div class="text-center max-w-sm w-full p-4 flex flex-col items-center gap-6">
                
                <!-- Unboxing Container -->
                <div id="mystery-box-container" class="relative w-48 h-48 flex items-center justify-center">
                    <!-- Shaking Box Emoji -->
                    <div id="mystery-box-emoji" class="text-8xl select-none filter drop-shadow-2xl cursor-pointer"
                         style="animation: mystery-shake 0.8s infinite alternate cubic-bezier(.36,.07,.19,.97);">
                         🎁
                    </div>
                    <!-- Glow Burst Behind -->
                    <div id="mystery-glow" class="absolute inset-0 bg-amber-400/40 rounded-full blur-3xl opacity-0 scale-50 transition-all duration-500 pointer-events-none"></div>
                </div>

                <!-- Stage Header -->
                <div id="mystery-stage-header">
                    <h3 class="text-lg font-black text-amber-400 tracking-wider">রহস্য বাক্স খোলা হচ্ছে...</h3>
                    <p class="text-xs text-slate-400 font-bold mt-1">Opening Mystery Box...</p>
                </div>

                <!-- Final Revealed Reward (Hidden initially) -->
                <div id="mystery-reveal-card" class="hidden flex-col items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl w-full shadow-2xl transform scale-90 opacity-0 transition-all duration-300">
                    <div class="w-20 h-20 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-center text-4xl shadow-inner animate-pulse">
                        ${rewardIcon}
                    </div>
                    <div>
                        <span class="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                            পুরস্কার (REWARD)
                        </span>
                        <h4 class="font-black text-slate-800 dark:text-white text-lg mt-3 leading-tight">${rewardLabel}</h4>
                        <p class="text-xs text-slate-500 dark:text-slate-400 font-bold mt-2 leading-relaxed">${rewardDesc}</p>
                    </div>

                    <button id="mystery-reveal-close-btn" class="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold py-3 rounded-2xl cursor-pointer border-none transition-colors text-sm shadow-md mt-2">
                        দারুণ, ধন্যবাদ! 🥳
                    </button>
                </div>
            </div>

            <!-- Styles injection for shaking keyframes -->
            <style>
                @keyframes mystery-shake {
                    0% { transform: rotate(0) scale(1); }
                    15% { transform: rotate(8deg) scale(1.08); }
                    30% { transform: rotate(-8deg) scale(1.08); }
                    45% { transform: rotate(6deg) scale(1.1); }
                    60% { transform: rotate(-6deg) scale(1.1); }
                    75% { transform: rotate(4deg) scale(1.12); }
                    90% { transform: rotate(-4deg) scale(1.12); }
                    100% { transform: rotate(0) scale(1.15); }
                }
            </style>
        `;

        document.body.appendChild(modal);

        const container = document.getElementById("mystery-box-container")!;
        const boxEmoji = document.getElementById("mystery-box-emoji")!;
        const glow = document.getElementById("mystery-glow")!;
        const header = document.getElementById("mystery-stage-header")!;
        const revealCard = document.getElementById("mystery-reveal-card")!;
        const closeBtn = document.getElementById("mystery-reveal-close-btn")!;

        // Triggers the explosion and reveal after 1.8 seconds of shaking
        setTimeout(() => {
            // Remove shaking animation
            boxEmoji.style.animation = "none";
            
            // Add scale up flash
            boxEmoji.style.transition = "all 0.25s ease-out";
            boxEmoji.style.transform = "scale(1.8)";
            boxEmoji.style.opacity = "0";
            
            glow.style.opacity = "1";
            glow.style.transform = "scale(1.8)";

            // Explosion flash visual
            const flash = document.createElement("div");
            flash.className = "absolute inset-0 bg-white rounded-full z-50 animate-ping opacity-75";
            container.appendChild(flash);

            setTimeout(() => {
                flash.remove();
                header.className = "hidden";
                
                // Show reveal card with custom transitions
                revealCard.classList.remove("hidden");
                setTimeout(() => {
                    revealCard.style.transform = "scale(1)";
                    revealCard.style.opacity = "1";
                }, 50);

                // Run corresponding particle animation based on reward types
                const rect = container.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                if (rewardType.includes("xp")) {
                    this.triggerFlyingStars(centerX, centerY);
                } else if (rewardType.includes("coins")) {
                    this.triggerFlyingCoins(centerX, centerY);
                } else {
                    this.triggerFlyingStars(centerX, centerY);
                }

                // Attach click handler on close button
                closeBtn.addEventListener("click", () => {
                    modal.remove();
                    onComplete();
                });
            }, 250);
        }, 1800);
    }

    /**
     * Utility: Close any open shop dialog modals
     */
    private static closeAllShopModals() {
        const ids = ["shop-insufficient-modal", "shop-success-modal", "shop-mystery-modal"];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    }

    /**
     * Flying Stars Canvas Animation (for XP rewards)
     */
    static triggerFlyingStars(startX: number, startY: number) {
        const canvas = document.createElement("canvas");
        canvas.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 120000;";
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d")!;
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        interface Star {
            x: number;
            y: number;
            vx: number;
            vy: number;
            color: string;
            size: number;
            alpha: number;
            rotation: number;
            rotationSpeed: number;
        }

        const stars: Star[] = [];
        const colors = ["#FBBF24", "#F59E0B", "#FDE047", "#60A5FA", "#EC4899"];

        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 3;
            stars.push({
                x: startX,
                y: startY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                alpha: 1,
                rotation: Math.random() * Math.PI,
                rotationSpeed: Math.random() * 0.1 - 0.05
            });
        }

        function drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string, alpha: number) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.beginPath();
            let rot = Math.PI / 2 * 3;
            let x = cx;
            let y = cy;
            const step = Math.PI / spikes;

            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            ctx.lineTo(cx, cy - outerRadius);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        let animationId = 0;
        function update() {
            ctx.clearRect(0, 0, width, height);
            let alive = false;

            stars.forEach(s => {
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.1; // gravity
                s.vx *= 0.98; // drag
                s.alpha -= 0.015;
                s.rotation += s.rotationSpeed;

                if (s.alpha > 0) {
                    alive = true;
                    ctx.save();
                    ctx.translate(s.x, s.y);
                    ctx.rotate(s.rotation);
                    drawStar(0, 0, 5, s.size, s.size / 2, s.color, s.alpha);
                    ctx.restore();
                }
            });

            if (alive) {
                animationId = requestAnimationFrame(update);
            } else {
                canvas.remove();
            }
        }

        update();
    }

    /**
     * Flying Coins Canvas Animation (for coin refunds/jackpots)
     */
    static triggerFlyingCoins(startX: number, startY: number) {
        const canvas = document.createElement("canvas");
        canvas.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 120000;";
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d")!;
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        interface Coin {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            rotationX: number;
            rotationXSpeed: number;
            alpha: number;
        }

        const coins: Coin[] = [];

        for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 4;
            coins.push({
                x: startX,
                y: startY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2, // Slight upward trajectory
                size: Math.random() * 10 + 12, // Coins are bigger
                rotationX: Math.random() * Math.PI,
                rotationXSpeed: Math.random() * 0.15 + 0.05,
                alpha: 1
            });
        }

        let animationId = 0;
        function update() {
            ctx.clearRect(0, 0, width, height);
            let alive = false;

            coins.forEach(c => {
                c.x += c.vx;
                c.y += c.vy;
                c.vy += 0.2; // heavier gravity
                c.vx *= 0.97; // slightly more drag
                c.alpha -= 0.012;
                c.rotationX += c.rotationXSpeed;

                if (c.alpha > 0) {
                    alive = true;
                    ctx.save();
                    ctx.globalAlpha = c.alpha;
                    ctx.translate(c.x, c.y);
                    ctx.scale(Math.abs(Math.sin(c.rotationX)), 1); // Mimic flipping coin
                    
                    // Draw gold coin circle
                    ctx.fillStyle = "#F59E0B"; // Gold color
                    ctx.strokeStyle = "#B45309"; // Dark bronze border
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    // Inner coin details
                    ctx.fillStyle = "#FBBF24"; // Lighter gold
                    ctx.beginPath();
                    ctx.arc(0, 0, c.size / 3, 0, Math.PI * 2);
                    ctx.fill();

                    // Centered currency symbol text "C" or "🪙"
                    ctx.fillStyle = "#B45309";
                    ctx.font = `bold ${c.size / 2}px sans-serif`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText("৳", 0, 0.5);

                    ctx.restore();
                }
            });

            if (alive) {
                animationId = requestAnimationFrame(update);
            } else {
                canvas.remove();
            }
        }

        update();
    }
}
