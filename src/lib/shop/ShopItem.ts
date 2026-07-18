export type ShopItemCategory = "frame" | "theme" | "mystery" | "hint" | "double_xp";

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ShopItemCategory;
    icon: string; // Emoji or Lucide icon description
    value?: string;
}

export const SHOP_ITEMS: ShopItem[] = [
    // 1. Avatar Frames
    {
        id: "frame_bronze",
        name: "ব্রোঞ্জ ফ্রেম (Bronze Frame)",
        description: "আপনার প্রোফাইল ছবিতে একটি ব্রোঞ্জ বর্ডার যোগ করুন।",
        price: 100,
        category: "frame",
        icon: "🥉",
        value: "border: 3px solid #CD7F32; box-shadow: 0 4px 6px rgba(205, 127, 50, 0.35);"
    },
    {
        id: "frame_silver",
        name: "সিলভার ফ্রেম (Silver Frame)",
        description: "মেটালিক সিলভার বর্ডারের সাথে প্রোফাইল উজ্জ্বল করুন।",
        price: 250,
        category: "frame",
        icon: "🥈",
        value: "border: 3.5px solid #C0C0C0; box-shadow: 0 0 8px rgba(192, 192, 192, 0.5);"
    },
    {
        id: "frame_gold",
        name: "গোল্ডেন ফ্রেম (Golden Frame)",
        description: "রাজকীয় গোল্ডেন বর্ডার এবং উজ্জ্বল আলোকছটা!",
        price: 500,
        category: "frame",
        icon: "👑",
        value: "border: 4px solid #F59E0B; box-shadow: 0 0 12px rgba(245, 158, 11, 0.65);"
    },
    {
        id: "frame_diamond",
        name: "ডায়মন্ড ফ্রেম (Diamond Frame)",
        description: "সর্বোচ্চ আভিজাত্য! উজ্জ্বল সায়ান ডায়মন্ড গ্লো।",
        price: 1000,
        category: "frame",
        icon: "💎",
        value: "border: 4.5px solid #38BDF8; box-shadow: 0 0 16px rgba(56, 189, 248, 0.8);"
    },

    // 2. Profile Themes
    {
        id: "theme_blue",
        name: "নীল থিম (Blue Theme)",
        description: "প্রোফাইল ব্যাকগ্রাউন্ডকে সুন্দর নীল রঙে রাঙান।",
        price: 200,
        category: "theme",
        icon: "🔵",
        value: "linear-gradient(135deg, #1E40AF, #3B82F6)"
    },
    {
        id: "theme_green",
        name: "সবুজ থিম (Green Theme)",
        description: "শান্ত স্নিগ্ধ সবুজ ব্যাকগ্রাউন্ড থিম।",
        price: 200,
        category: "theme",
        icon: "🟢",
        value: "linear-gradient(135deg, #065F46, #10B981)"
    },
    {
        id: "theme_purple",
        name: "রঙিন বেগুনি থিম (Purple Theme)",
        description: "আকর্ষণীয় বেগুনি গ্ল্যামার থিম।",
        price: 200,
        category: "theme",
        icon: "🟣",
        value: "linear-gradient(135deg, #5B21B6, #8B5CF6)"
    },
    {
        id: "theme_dark",
        name: "ডার্ক থিম (Dark Theme)",
        description: "চোখের সুরক্ষায় মেটালিক স্লিম ডার্ক থিম।",
        price: 200,
        category: "theme",
        icon: "⚫",
        value: "linear-gradient(135deg, #1E293B, #475569)"
    },

    // 3. Mystery Box
    {
        id: "mystery_box",
        name: "রহস্য বাক্স (Mystery Box)",
        description: "+৫০ XP, +১০০ XP, দুর্লভ ব্যাজ, স্পেশাল রেইনবো থিম বা ডাবল XP বোনাস পেতে পারেন!",
        price: 100,
        category: "mystery",
        icon: "🎁"
    },

    // 4. Hint Tokens
    {
        id: "hint_token",
        name: "হিন্ট টোকেন (Hint Token)",
        description: "ব্যাটল কুইজে ব্যবহারের জন্য ১টি হিন্ট টোকেন। ভুল অপশন দূর করতে সাহায্য করবে।",
        price: 50,
        category: "hint",
        icon: "💡"
    },

    // 5. Double XP Card
    {
        id: "double_xp",
        name: "ডাবল এক্সপি কার্ড (Double XP - 24h)",
        description: "পরবর্তী ২৪ ঘণ্টার জন্য সকল পড়াশোনা অ্যাক্টিভিটিতে দ্বিগুণ (2X) XP অর্জন করুন!",
        price: 300,
        category: "double_xp",
        icon: "⚡"
    }
];
