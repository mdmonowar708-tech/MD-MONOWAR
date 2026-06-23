import React from "react";
import { Award, CheckCircle, XCircle, Clock, BookOpen, BarChart3, HelpCircle, ArrowLeft } from "lucide-react";
import { ExamResult } from "../types";

interface ResultPageProps {
  result: ExamResult;
  onViewSolutions: () => void;
  onNavigateToLeaderboard: () => void;
  onBackToHome: () => void;
}

export default function ResultPage({ 
  result, 
  onViewSolutions, 
  onNavigateToLeaderboard, 
  onBackToHome 
}: ResultPageProps) {
  // Safe calculate dynamic color gradient for circle
  const percentage = Math.round(result.percentage || 0);
  const conicStyle = {
    background: `conic-gradient(#00BFA6 ${percentage}%, #F3F4F6 ${percentage}% 100%)`
  };

  return (
    <div className="pb-24 max-w-lg mx-auto bg-neutral-50 min-h-screen p-4">
      {/* Top controls */}
      <div className="flex justify-between items-center mb-5">
        <button 
          onClick={onBackToHome}
          className="p-2 bg-white hover:bg-neutral-50 border border-neutral-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-bold text-xs text-neutral-700"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </button>
        <span className="font-extrabold text-xs text-neutral-400">Exam Outcome</span>
      </div>

      {/* Main card */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center space-y-6">
        
        {/* Badge & Greetings */}
        <div>
          <span className="inline-block text-5xl mb-3 animate-bounce">🏆</span>
          <h2 className="text-xl font-extrabold text-neutral-800">Excellent Try!</h2>
          <p className="text-xs text-neutral-400 font-semibold mt-1">
            You completed <span className="font-bold text-neutral-700">{result.examTitle}</span>
          </p>
        </div>

        {/* Dynamic circular radial display chart */}
        <div className="relative flex justify-center items-center py-2">
          <div 
            style={conicStyle}
            className="w-44 h-44 rounded-full flex items-center justify-center shadow-inner relative transition-all duration-700"
          >
            {/* White masking circle to make it a ring */}
            <div className="w-36 h-36 bg-white rounded-full flex flex-col justify-center items-center shadow-xs">
              <span className="text-3xl font-extrabold text-neutral-900 tracking-tight">{percentage}%</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Overall Score</span>
            </div>
          </div>
        </div>

        {/* Core Stats indicators Grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-emerald-50 border border-emerald-100/50 p-2.5 rounded-2xl">
            <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
            <h4 className="font-black text-emerald-800 text-sm">{result.correct}</h4>
            <p className="text-[9px] text-emerald-600 font-bold">Correct</p>
          </div>

          <div className="bg-rose-50 border border-rose-100/50 p-2.5 rounded-2xl">
            <XCircle className="h-4 w-4 text-rose-500 mx-auto mb-1" />
            <h4 className="font-black text-rose-800 text-sm">{result.wrong}</h4>
            <p className="text-[9px] text-rose-600 font-bold">Wrong</p>
          </div>

          <div className="bg-slate-50 border border-slate-100/50 p-2.5 rounded-2xl">
            <HelpCircle className="h-4 w-4 text-slate-500 mx-auto mb-1" />
            <h4 className="font-black text-slate-800 text-sm">{result.unanswered}</h4>
            <p className="text-[9px] text-slate-600 font-bold">Skipped</p>
          </div>

          <div className="bg-violet-50 border border-violet-100/50 p-2.5 rounded-2xl">
            <Clock className="h-4 w-4 text-violet-500 mx-auto mb-1" />
            <h4 className="font-bold text-violet-800 text-[10px] leading-relaxed truncate">{result.timeTaken}</h4>
            <p className="text-[9px] text-violet-600 font-bold">Duration</p>
          </div>
        </div>

        {/* Rank overview block */}
        <div className="bg-neutral-50/80 border border-neutral-100 rounded-2xl p-4 flex justify-between items-center text-left">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold block">Your Grade</span>
            <span className="text-base font-extrabold text-[#009688]">{result.score} Points</span>
          </div>
          <div className="text-center h-10 w-0.5 bg-neutral-200" />
          <div className="text-center">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold block">Calculated Rank</span>
            <span className="text-base font-extrabold text-neutral-900">#{result.rank} of {result.totalParticipants}</span>
          </div>
          <div className="text-center h-10 w-0.5 bg-neutral-200" />
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold block">Percentile</span>
            <span className="text-base font-extrabold text-amber-500">{percentage}%</span>
          </div>
        </div>

        {/* Option CTA buttons */}
        <div className="grid grid-cols-2 gap-3.5 pt-2">
          <button
            onClick={onViewSolutions}
            className="py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-extrabold rounded-2xl transition-all border-none cursor-pointer flex items-center justify-center gap-2 text-xs"
          >
            <BookOpen className="h-4 w-4 text-[#00BFA6]" /> View Solutions
          </button>
          
          <button
            onClick={onNavigateToLeaderboard}
            className="py-3.5 bg-linear-to-r from-[#00C6A7] to-[#009688] text-white font-extrabold rounded-2xl hover:opacity-95 transition-all border-none cursor-pointer flex items-center justify-center gap-2 text-xs"
          >
            <BarChart3 className="h-4 w-4" /> Global Leaderboard
          </button>
        </div>

      </div>
    </div>
  );
}
