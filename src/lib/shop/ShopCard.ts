import { ShopItem } from "./ShopItem.ts";

/**
 * Renders the HTML string for a specific shop item card
 * @param item The shop item object
 * @param isOwned Whether the user already owns this item
 * @param isActive Whether this is currently active/equipped (applicable to theme/frame)
 */
export function renderShopCardHTML(item: ShopItem, isOwned: boolean, isActive: boolean): string {
    const isConsumable = item.category === "hint" || item.category === "mystery";
    
    // Choose status class and text for button
    let buttonHTML = "";
    if (isOwned && !isConsumable) {
        if (isActive) {
            buttonHTML = `
                <button disabled 
                    class="w-full bg-emerald-500 text-white text-xs font-black py-2.5 px-4 rounded-xl border-none flex items-center justify-center gap-1.5 opacity-90 cursor-not-allowed">
                    <span style="font-size: 14px;">✅</span> অ্যাক্টিভ (Active)
                </button>
            `;
        } else {
            buttonHTML = `
                <button onclick="window.equipShopItem('${item.id}', '${item.category}')" 
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-2.5 px-4 rounded-xl border-none flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all transform hover:scale-102">
                    🔄 পরিধান করুন (Equip)
                </button>
            `;
        }
    } else {
        // Not owned or consumable (can buy multiple times)
        const priceText = `${item.price} কয়েন`;
        const buttonText = item.category === "mystery" ? "📦 বক্স খুলুন" : (item.category === "hint" ? "💡 টোকেন কিনুন" : "🛒 কিনুন");
        
        buttonHTML = `
            <button onclick="window.purchaseShopItem('${item.id}')" 
                class="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-black py-2.5 px-4 rounded-xl border-none flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all transform hover:scale-102">
                🪙 ${priceText} • ${buttonText}
            </button>
        `;
    }

    // Category badge
    const badgeColors: Record<string, string> = {
        frame: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
        theme: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
        mystery: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400",
        hint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
        double_xp: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
    };

    const categoryNames: Record<string, string> = {
        frame: "অবতার ফ্রেম",
        theme: "প্রোফাইল থিম",
        mystery: "মিস্ট্রি বক্স",
        hint: "হিন্ট টোকেন",
        double_xp: "ডাবল এক্সপি"
    };

    const badgeClass = badgeColors[item.category] || "bg-slate-100 text-slate-700";
    const categoryName = categoryNames[item.category] || item.category;

    return `
        <div id="shop-card-${item.id}" 
            class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 transform hover:translate-y-[-2px]"
            style="transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);">
            
            <div class="flex flex-col gap-2.5">
                <!-- Icon and Badge -->
                <div class="flex justify-between items-start">
                    <div class="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-3xl shadow-inner transform transition-transform duration-300 hover:rotate-6">
                        ${item.icon}
                    </div>
                    <span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${badgeClass}">
                        ${categoryName}
                    </span>
                </div>

                <!-- Info -->
                <div class="text-left">
                    <h3 class="font-extrabold text-slate-800 dark:text-white text-sm tracking-tight leading-tight">
                        ${item.name}
                    </h3>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed mt-1.5">
                        ${item.description}
                    </p>
                </div>
            </div>

            <!-- Action Area -->
            <div class="pt-3 border-t border-slate-50 dark:border-slate-800/60 mt-auto">
                ${buttonHTML}
            </div>
        </div>
    `;
}
