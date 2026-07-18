export interface UserInventory {
    ownedItems: string[]; // List of shop item IDs owned by user
    activeTheme: string;  // Active theme item ID, empty string if default
    avatarFrame: string;  // Active avatar frame ID, empty string if default
    doubleXpExpiry: string | null; // ISO Date String or null
    hintTokens: number;   // Number of hints remaining
    mysteryBoxesOpened: number; // Statistic of mystery boxes opened
}

/**
 * Checks if Double XP is currently active based on the expiry string
 * @param doubleXpExpiry ISO string or timestamp of expiry
 */
export function isDoubleXpActive(doubleXpExpiry: string | null | any): boolean {
    if (!doubleXpExpiry) return false;
    try {
        let expiryMs = 0;
        if (typeof doubleXpExpiry === "string") {
            expiryMs = new Date(doubleXpExpiry).getTime();
        } else if (doubleXpExpiry.toDate && typeof doubleXpExpiry.toDate === "function") {
            expiryMs = doubleXpExpiry.toDate().getTime();
        } else if (typeof doubleXpExpiry === "number") {
            expiryMs = doubleXpExpiry;
        } else {
            expiryMs = new Date(doubleXpExpiry).getTime();
        }
        return expiryMs > Date.now();
    } catch (e) {
        console.warn("Error parsing doubleXpExpiry:", e);
        return false;
    }
}

/**
 * Returns the remaining time in a human-readable format (e.g., "14h 22m")
 * @param doubleXpExpiry Expiry value
 */
export function getDoubleXpTimeRemaining(doubleXpExpiry: string | null | any): string {
    if (!doubleXpExpiry) return "";
    try {
        let expiryMs = 0;
        if (typeof doubleXpExpiry === "string") {
            expiryMs = new Date(doubleXpExpiry).getTime();
        } else if (doubleXpExpiry.toDate && typeof doubleXpExpiry.toDate === "function") {
            expiryMs = doubleXpExpiry.toDate().getTime();
        } else if (typeof doubleXpExpiry === "number") {
            expiryMs = doubleXpExpiry;
        } else {
            expiryMs = new Date(doubleXpExpiry).getTime();
        }
        
        const diff = expiryMs - Date.now();
        if (diff <= 0) return "";

        const totalMinutes = Math.floor(diff / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        if (hours > 0) {
            return `${hours} ঘণ্টা ${minutes} মিনিট`;
        }
        return `${minutes} মিনিট`;
    } catch (e) {
        return "";
    }
}
