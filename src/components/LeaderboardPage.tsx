import React, { useState } from "react";
import { Award, Trophy, Filter, ShieldCheck, Flame } from "lucide-react";
import { SAMPLE_GLOBAL_USERS } from "../simulationData";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"today" | "weekly" | "monthly" | "all">("all");

  const tabs = [
    { id: "today", label: "Today" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "all", label: "All Time" }
  ];

  // Modify scores/points slightly depending on filter selected to simulate filter changes elegantly
  const getMultiplier = (tab: string) => {
    switch (tab) {
      case "today": return 0.12;
      case "weekly": return 0.45;
      case "monthly": return 0.78;
      default: return 1.0;
    }
  };

  const multiplier = getMultiplier(activeTab);
  const orderedUsers = [...SAMPLE_GLOBAL_USERS]
    .map((usr) => ({
      ...usr,
      points: Math.round(usr.points * multiplier)
    }))
    .sort((a, b) => b.points - a.points);

  const topThree = orderedUsers.slice(0, 3);
  const remaingList = orderedUsers.slice(3);

  // Helper podium layout details
  const crownMedal = (idx: number) => {
    if (idx === 0) return "🥇";
    if (idx === 1) return "🥈";
    return "🥉";
  };

  return (
    <div className="pb-24 max-w-lg mx-auto bg-neutral-50 min-h-screen p-4">
      
      {/* Top Banner */}
      <div className="bg-linear-to-br from-[#00BFA6] to-[#009688] rounded-3xl p-5 text-white shadow-xs relative overflow-hidden mb-5">
        <Trophy className="absolute right-3 bottom-2 h-20 w-20 text-white/10" />
        <div className="relative">
          <span className="bg-white/20 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
            MCQ Rankings
          </span>
          <h2 className="text-xl font-extrabold mt-3">Global Leaderboard</h2>
          <p className="text-xs text-white/85 font-medium mt-1">
            Top performing candidates based on accuracy & speed
          </p>
        </div>
      </div>

      {/* Tabs Filter Selection block */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-1.5 flex gap-1 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 text-center font-bold text-xs rounded-xl border-none cursor-pointer transition-all ${
              activeTab === tab.id
                ? "bg-[#00BFA6] text-white shadow-xs"
                : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium layout */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[1, 0, 2].map((orderedIndex) => {
          const user = topThree[orderedIndex];
          if (!user) return null;

          const isFirst = orderedIndex === 0;
          return (
            <div 
              key={user.uid}
              className={`bg-white border text-center p-4 rounded-3xl flex flex-col justify-between items-center relative shadow-xs transition-all ${
                isFirst 
                  ? "border-[#00BFA6]/50 bg-gradient-to-b from-[#00BFA6]/5 to-white scale-105 ring-2 ring-[#00BFA6]/10" 
                  : "border-neutral-100"
              }`}
            >
              {/* Medal Indicator */}
              <div className="text-3xl mb-1">{crownMedal(orderedIndex)}</div>

              <div className="mb-2">
                <span className="font-extrabold text-neutral-800 text-xs block leading-tight truncate max-w-[80px]">
                  {user.name}
                </span>
                {isFirst && (
                  <span className="inline-block bg-[#00BFA6]/10 text-[#009688] font-black text-[8px] px-1.5 py-0.5 rounded-md mt-1 uppercase tracking-widest">
                    Champion
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs font-black text-[#00BFA6]">{user.points}</span>
                <p className="text-[8px] text-neutral-400 font-bold uppercase">Points</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Roster List Candidates index */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-4 shadow-2xs space-y-2.5">
        <h4 className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest pb-2 border-b border-neutral-50 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" /> candidates ranked #4 and below
        </h4>

        {remaingList.map((user, idx) => {
          const actualRank = idx + 4;
          return (
            <div 
              key={user.uid}
              className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Seed Badge index */}
                <div className="h-7 w-7 rounded-lg bg-neutral-200 text-neutral-700 font-extrabold text-xs flex items-center justify-center">
                  #{actualRank}
                </div>
                <div>
                  <span className="font-bold text-neutral-800 text-xs block leading-none">{user.name}</span>
                  <span className="text-[9px] text-neutral-400 font-semibold tracking-wide">Competitor Candidate</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-black text-[#009688] text-xs block">{user.points} pts</span>
                <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Level 18</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
