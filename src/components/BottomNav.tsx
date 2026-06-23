import React from "react";
import { Home, ClipboardList, Award, User } from "lucide-react";

interface BottomNavProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
}

export default function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  const tabs = [
    { id: "home-page", label: "Home", icon: Home },
    { id: "exam-page", label: "Exams", icon: ClipboardList },
    { id: "global-leaderboard-page", label: "Leaderboard", icon: Award },
    { id: "profile-page", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-100 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] z-40 flex items-center justify-around px-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className="flex flex-col items-center justify-center w-16 h-full gap-1 border-none bg-transparent cursor-pointer transition-all duration-200"
          >
            <Icon 
              className={`h-5 w-5 transition-transform duration-200 ${
                isActive ? "text-[#00BFA6] scale-110" : "text-neutral-400 hover:text-neutral-600"
              }`} 
            />
            <span 
              className={`text-[10px] font-bold tracking-tight ${
                isActive ? "text-[#009688]" : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
