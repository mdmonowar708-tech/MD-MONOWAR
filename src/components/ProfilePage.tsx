import React from "react";
import { 
  User, Calendar, Award, PlayCircle, BarChart, 
  GraduationCap, History, BookmarkCheck, CheckSquare, Square, Shield 
} from "lucide-react";
import { SAMPLE_ACHIEVEMENTS, SAMPLE_COURSES } from "../simulationData";
import { ExamResult, UserProfile } from "../types";

interface ProfilePageProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  stats: {
    totalPoints: number;
    totalExams: number;
    accuracy: string;
    bestScore: number;
    bestRank: string;
    totalCourses: number;
  };
  resultsHistory: ExamResult[];
  onSignOut: () => void;
  courses?: { id: string; title: string }[];
}

export default function ProfilePage({ user, onUpdateUser, stats, resultsHistory, onSignOut, courses }: ProfilePageProps) {
  
  const handleRoleChange = (role: 'free' | 'premium' | 'course_purchased') => {
    onUpdateUser({
      ...user,
      role,
      premium: role === 'premium',
      purchasedCourses: role === 'course_purchased' ? (user.purchasedCourses || ['course_bcs']) : []
    });
  };

  const handleCourseToggle = (courseId: string) => {
    const list = user.purchasedCourses || [];
    const isExist = list.includes(courseId);
    const newList = isExist ? list.filter(id => id !== courseId) : [...list, courseId];
    onUpdateUser({
      ...user,
      purchasedCourses: newList
    });
  };

  return (
    <div className="pb-24 max-w-lg mx-auto bg-neutral-50 min-h-screen p-4">
      
      {/* Top Profile Card */}
      <div className="bg-linear-to-br from-indigo-500 to-sky-600 rounded-3xl p-5 text-white shadow-xs relative overflow-hidden mb-5">
        <User className="absolute right-4 bottom-2 h-20 w-20 text-white/10" />
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-white text-indigo-600 font-bold text-3xl flex items-center justify-center shadow-md">
            👤
          </div>
          <div>
            <h2 className="text-lg font-extrabold leading-tight">{user.name || "Monowar Hossain"}</h2>
            <p className="text-xs text-white/80 font-medium font-semibold">{user.email || "monowar@gmail.com"}</p>
            <span className="inline-block bg-amber-400 text-neutral-950 font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider mt-2 shadow-xs">
              {user.role === 'premium' || user.premium
                ? "👑 Premium Champion"
                : user.role === 'course_purchased'
                ? `📚 Course Owner (${user.purchasedCourses?.length || 0})`
                : "🆓 Free Member"}
            </span>
          </div>
        </div>
      </div>

      {/* Simulation Dashboard Controller */}
      <div className="bg-white border-2 border-dashed border-[#00BFA6]/40 rounded-3xl p-5 shadow-xs mb-5 space-y-4">
        <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest pb-1 flex items-center gap-1.5 border-b border-rose-50">
          <Shield className="h-4 w-4" /> 🛠️ User Account Level Simulator
        </h4>
        <p className="text-[11px] text-neutral-500 font-semibold leading-normal">
          আমাদের সিস্টেমে ৩ ধরণের এক্সেস লেভেল আছে। নিচের টেস্ট বাটনগুলো ক্লিক করে সাথে সাথে রোল পরিবর্তন করে টেস্ট করতে পারেন:
        </p>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleRoleChange('free')}
            className={`py-2 px-1 rounded-xl font-bold text-[10px] transition-all cursor-pointer border ${
              user.role === 'free' || (!user.role && !user.premium)
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            🆓 ১. ফ্রী ইউজার
          </button>
          
          <button
            onClick={() => handleRoleChange('course_purchased')}
            className={`py-2 px-1 rounded-xl font-bold text-[10px] transition-all cursor-pointer border ${
              user.role === 'course_purchased'
                ? 'bg-[#00BFA6] text-white border-[#00BFA6]'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            📚 ২. কোর্স ক্রেতা
          </button>

          <button
            onClick={() => handleRoleChange('premium')}
            className={`py-2 px-1 rounded-xl font-bold text-[10px] transition-all cursor-pointer border ${
              user.role === 'premium' || user.premium
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            👑 ৩. প্রিমিয়াম ইউজার
          </button>
        </div>

        {/* If course purchased role is selected, show checklist of course select */}
        {user.role === 'course_purchased' && (
          <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-100 mt-2">
            <h5 className="text-[11px] font-extrabold text-[#009688] mb-2">ক্রয়কৃত কোর্স সিলেক্ট করুন (একাধিক সম্ভব):</h5>
            <div className="space-y-2">
              {(courses || SAMPLE_COURSES).map(course => {
                const isPurchased = (user.purchasedCourses || []).includes(course.id);
                return (
                  <label 
                    key={course.id}
                    onClick={() => handleCourseToggle(course.id)}
                    className="flex items-center gap-2 cursor-pointer select-none py-1 text-[11px] font-bold text-neutral-700"
                  >
                    {isPurchased ? (
                      <CheckSquare className="h-4 w-4 text-[#00BFA6]" />
                    ) : (
                      <Square className="h-4 w-4 text-neutral-300" />
                    )}
                    <span>{course.title}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-[9px] text-neutral-400 mt-2 font-bold leading-relaxed">
              💡 আপনি যে কোর্সগুলোর টিক দিবেন, আপনি শুধু ড্যাশবোর্ডে সেই কোর্সের পরীক্ষা দিতে পারবেন। বাকি কোর্সের পরীক্ষা লক থাকবে।
            </p>
          </div>
        )}
      </div>

      {/* User Performance Statistics list */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-2xs mb-5 space-y-4">
        <h4 className="text-xs font-extrabold text-neutral-800 uppercase tracking-widest pb-2 border-b border-neutral-50 flex items-center gap-1.5">
          <BarChart className="h-4 w-4 text-[#00BFA6]" /> Core Performance Metrics
        </h4>

        {/* Info Rows */}
        <div className="space-y-3 text-xs text-neutral-600 font-semibold">
          <div className="flex justify-between items-center py-1">
            <span className="flex items-center gap-1.5 text-neutral-400"><Calendar className="h-4 w-4" /> Member Since</span>
            <span className="text-neutral-800">14 Jun 2026</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="flex items-center gap-1.5 text-neutral-400"><PlayCircle className="h-4 w-4" /> Total Exams Taken</span>
            <span className="text-neutral-800">{stats.totalExams}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="flex items-center gap-1.5 text-neutral-400"><Award className="h-4 w-4" /> Average Score Ratio</span>
            <span className="text-neutral-800">{stats.accuracy}</span>
          </div>

          {/* Progress bar visualizer */}
          <div className="py-1">
            <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
              <div 
                style={{ width: stats.accuracy }}
                className="bg-linear-to-r from-[#00BFA6] to-[#009688] h-full rounded-full transition-all duration-550"
              />
            </div>
            <p className="text-[10px] text-neutral-400 font-bold block text-right mt-1">Accuracy Progress Indicator</p>
          </div>

          <div className="flex justify-between items-center py-1 border-t border-neutral-50 pt-3">
            <span className="flex items-center gap-1.5 text-neutral-400">🏅 Best Exam Score</span>
            <span className="text-neutral-800 font-bold">{stats.bestScore} Points</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="flex items-center gap-1.5 text-neutral-400">🏆 Top Rank Secured</span>
            <span className="text-neutral-800 font-bold">{stats.bestRank}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="flex items-center gap-1.5 text-neutral-400"><GraduationCap className="h-4 w-4" /> Registered Courses</span>
            <span className="text-neutral-800 font-bold">{stats.totalCourses} Active</span>
          </div>
        </div>
      </div>

      {/* Achievements Card Grid */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-2xs mb-5">
        <h4 className="text-xs font-extrabold text-neutral-800 uppercase tracking-widest pb-3 border-b border-neutral-50 flex items-center gap-1.5">
          <BookmarkCheck className="h-4 w-4 text-indigo-500" /> unlocked achievements
        </h4>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {SAMPLE_ACHIEVEMENTS.map((ach) => (
            <div 
              key={ach.id}
              className="bg-neutral-50 hover:bg-indigo-50/30 border border-neutral-100 hover:border-indigo-100 p-4 rounded-2xl text-center transition-all group"
            >
              <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{ach.icon}</span>
              <h5 className="font-extrabold text-neutral-800 text-xs leading-snug">{ach.title}</h5>
              <p className="text-[9px] text-neutral-400 font-semibold leading-relaxed mt-1">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History logs card */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-2xs mb-5">
        <h4 className="text-xs font-extrabold text-neutral-800 uppercase tracking-widest pb-3 border-b border-neutral-50 flex items-center gap-1.5">
          <History className="h-4 w-4 text-emerald-500" /> Exam History logs
        </h4>

        <div className="mt-4 space-y-3">
          {resultsHistory.length > 0 ? (
            resultsHistory.map((log, idx) => (
              <div 
                key={idx}
                className="p-3.5 bg-neutral-50 border border-neutral-100/50 rounded-2xl space-y-1.5 hover:border-emerald-300 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-neutral-800 text-xs truncate max-w-[200px]">
                    📝 {log.examTitle}
                  </span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md">
                    Score: {log.score}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold">
                  <span>🎯 Accuracy: {Math.round(log.percentage)}%</span>
                  <span>⏱ Duration: {log.timeTaken}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-neutral-400 font-bold">No Exam Records Found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sign Out CTA Buttons */}
      <button
        onClick={onSignOut}
        className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-all text-rose-600 font-extrabold py-3.5 rounded-2xl shrink-0 cursor-pointer text-xs uppercase tracking-wider"
      >
        🚪 Logout from system account
      </button>

    </div>
  );
}
