import React from "react";
import { 
  X, Home, BookOpen, FileSpreadsheet, Award, User, Settings, GraduationCap, Sparkles 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  onNavigate: (pageId: string) => void;
  isPremium: boolean;
}

export default function Sidebar({ isOpen, onClose, activePage, onNavigate, isPremium }: SidebarProps) {
  const menuItems = [
    { id: "home-page", label: "Dashboard", icon: Home },
    { id: "exam-page", label: "Live Exams", icon: FileSpreadsheet },
    { id: "routine-page", label: "Routine & Lectures 📅", icon: BookOpen },
    { id: "profile-page", label: "Profile & History", icon: User },
    { id: "global-leaderboard-page", label: "Global Leaderboard", icon: Award },
    { id: "admin-settings-page", label: "Admin Controls 🛠️", icon: Settings },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs z-45"
          onClick={onClose}
        />
      )}

      {/* Slide Drawer */}
      <div 
        className={`fixed top-0 bottom-0 left-0 w-72 bg-white border-r border-neutral-100 shadow-2xl z-50 transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-[#00BFA6]" />
            <span className="font-extrabold text-2xl tracking-tight text-neutral-900">
              MCQ <span className="text-[#00BFA6]">HERO</span>
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer text-neutral-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                alt="Avatar" 
                className="h-11 w-11 rounded-full object-cover ring-2 ring-[#00BFA6]/20"
              />
              {isPremium && (
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-neutral-950 p-0.5 rounded-full text-xs">
                  👑
                </span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-neutral-800 text-sm">Monowar Hossain</h4>
              <p className="text-xs text-neutral-500 font-medium">monowar@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold text-sm transition-all duration-150 cursor-pointer ${
                  isActive 
                    ? "bg-[#00BFA6]/10 text-[#009688]" 
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-[#00BFA6]" : "text-neutral-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-5 border-t border-neutral-100 text-center">
          <div className="inline-flex items-center gap-1 text-xs text-neutral-400 font-semibold mb-1">
            <span>Powered by</span>
            <span className="text-[#00BFA6]">Vite + React</span>
          </div>
          <p className="text-[10px] text-neutral-400">© 2026 MCQ HERO. Code Cleared.</p>
        </div>
      </div>
    </>
  );
}
