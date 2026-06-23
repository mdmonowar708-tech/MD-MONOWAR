import React, { useState } from "react";
import { 
  Menu, Bell, Flame, Award, Percent, BookOpen, Star, Sparkles, CheckCircle2, ChevronRight,
  Calendar, FileText, Download, X, AlertCircle, ExternalLink
} from "lucide-react";
import { LiveExam, UserProfile, Course } from "../types";
import { SAMPLE_NOTICES, SAMPLE_COURSES } from "../simulationData";

interface DashboardProps {
  onOpenSidebar: () => void;
  exams: LiveExam[];
  onStartExam: (examId: string) => void;
  isPremium: boolean;
  user?: UserProfile;
  onUpgrade: () => void;
  onNavigate: (pageId: string) => void;
  userStats: {
    totalPoints: number;
    totalExams: number;
    accuracy: string;
    rank: string;
  };
  courses?: Course[];
}

export default function Dashboard({ 
  onOpenSidebar, 
  exams, 
  onStartExam, 
  isPremium, 
  user,
  onUpgrade, 
  onNavigate,
  userStats,
  courses
}: DashboardProps) {
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);
  const [modalTab, setModalTab] = useState<"routine" | "pdfs">("routine");

  // Routine tab specific states
  const activeCourses = courses && courses.length > 0 ? courses : SAMPLE_COURSES;
  const [selectedRoutineCourseId, setSelectedRoutineCourseId] = useState<string>(activeCourses[0]?.id || "");
  const [routineCardTab, setRoutineCardTab] = useState<"routine" | "pdfs">("routine");

  const getCourseRoutine = (course: any) => {
    if (course && course.routine && course.routine.length > 0) return course.routine;
    if (course && course.id === "course_bcs") {
      return [
        { date: "২৪ জুন", topic: "বাংলা ব্যাকরণ ও চর্যাপদ স্পেশাল টেস্ট" },
        { date: "২৬ জুন", topic: "গণিত - শতকরা ও সুদের হার বিশ্লেষণ" },
        { date: "২৮ জুন", topic: "English - Parts of Speech & Tense" }
      ];
    }
    if (course && course.id === "course_math") {
      return [
        { date: "২৫ জুন", topic: "লাভ-ক্ষতি ও সরল সুদকষা" },
        { date: "২৭ জুন", topic: "বীজগণিতীয় সূত্রাবলী ও মান নির্ণয়" }
      ];
    }
    return [
      { date: "শীঘ্রই", topic: "এই কোর্সের প্রথম পরীক্ষা সময়সূচী শীঘ্রই দেওয়া হবে।" }
    ];
  };

  const getCoursePdfs = (course: any) => {
    if (course && course.pdfs && course.pdfs.length > 0) return course.pdfs;
    if (course && course.id === "course_bcs") {
      return [
        { title: "১. গুরুত্ত্বপূর্ণ চর্যাপদ প্রশ্নত্তোর শিট", link: "https://drive.google.com/drive/folders/representative1", date: "২৩ জুন" },
        { title: "২. বাংলা ভাষা ও ব্যাকরণ শর্ট সাজেশন্স", link: "https://drive.google.com/drive/folders/representative2", date: "২৪ জুন" }
      ];
    }
    if (course && course.id === "course_math") {
      return [
        { title: "১. বিসিএস প্রিলিমিনারি গণিত ফর্মুলা শিট", link: "https://drive.google.com/drive/folders/representative3", date: "২৪ জুন" }
      ];
    }
    return [
      { title: "১. ফ্রি স্টাডি গাইড ও বিগত বছরের প্রশ্ন ব্যাংক", link: "https://drive.google.com/drive/folders/representative4", date: "আজ" }
    ];
  };

  const activeRoutineCourse = activeCourses.find(c => c.id === selectedRoutineCourseId) || activeCourses[0];
  const routineList = getCourseRoutine(activeRoutineCourse);
  const pdfList = getCoursePdfs(activeRoutineCourse);

  return (
    <div className="pb-24 max-w-lg mx-auto bg-neutral-50 min-h-screen">
      {/* Top Header */}
      <header className="sticky top-0 bg-white border-b border-neutral-100 px-4 py-4 flex items-center justify-between z-30">
        <button 
          onClick={onOpenSidebar}
          className="p-2 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer text-neutral-800"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="font-extrabold text-xl tracking-tight text-neutral-900">
          MCQ <span className="text-[#00BFA6]">HERO</span>
        </span>
        <button className="p-2 hover:bg-neutral-50 rounded-xl transition-colors relative">
          <Bell className="h-5 w-5 text-neutral-600" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-white" />
        </button>
      </header>

      {/* Body Content */}
      <div className="px-4 pt-4 space-y-5">
        
        {/* Welcome Card & Membership status */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">Welcome Back</p>
              <h2 className="text-xl font-bold text-neutral-800">{user?.name || "Monowar Hossain"}</h2>
              <p className="text-xs text-neutral-500 font-medium">Barchart #17 Top Ranked</p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
              alt="Avatar" 
              className="h-14 w-14 rounded-2xl object-cover ring-4 ring-[#00BFA6]/10"
            />
          </div>

          {/* Premium banner inside welcome card */}
          {user?.role === 'premium' || isPremium ? (
            <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-800">PREMIUM STATUS ACTIVE</h4>
                  <p className="text-[10px] text-emerald-600 font-semibold">Valid till 15 May 2027</p>
                </div>
              </div>
              <span className="bg-emerald-500 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                Active
              </span>
            </div>
          ) : user?.role === 'course_purchased' ? (
            <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                <div>
                  <h4 className="text-xs font-extrabold text-indigo-800">COURSE ENROLLED LEVEL</h4>
                  <p className="text-[10px] text-indigo-600 font-semibold">Enrolled in {user?.purchasedCourses?.length || 0} Courses</p>
                </div>
              </div>
              <span className="bg-indigo-500 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                Paid
              </span>
            </div>
          ) : (
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">👑</span>
                <div>
                  <h4 className="text-xs font-extrabold text-amber-800">FREE MEMBERSHIP STATUS</h4>
                  <p className="text-[10px] text-amber-600 font-semibold">Upgrade for unlimited questions</p>
                </div>
              </div>
              <button 
                onClick={onUpgrade}
                className="bg-[#00BFA6] hover:bg-[#009688] text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all cursor-pointer border-none"
              >
                Upgrade
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Notice Banner */}
        <div 
          className="bg-sky-50 border-l-4 border-[#00BFA6] rounded-2xl p-4 cursor-pointer hover:bg-sky-100/50 transition-colors"
          onClick={() => setCurrentNoticeIndex((prev) => (prev + 1) % SAMPLE_NOTICES.length)}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">📢</span>
            <div className="flex-1">
              <h4 className="text-xs font-extrabold text-[#009688] uppercase tracking-wider mb-1">Latest Announcement</h4>
              <p className="text-xs text-neutral-700 leading-relaxed font-semibold">
                {SAMPLE_NOTICES[currentNoticeIndex]}
              </p>
              <p className="text-[10px] text-neutral-400 mt-2 font-bold flex items-center gap-1">
                <span>Click template to next notice</span>
                <ChevronRight className="h-3 w-3" />
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-neutral-150/50 text-center shadow-xs">
            <h3 className="text-lg font-extrabold text-[#00BFA6]">{userStats.totalPoints}</h3>
            <p className="text-[10px] text-neutral-400 font-bold mt-1">Score</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-neutral-150/50 text-center shadow-xs">
            <h3 className="text-lg font-extrabold text-indigo-500">{userStats.totalExams}</h3>
            <p className="text-[10px] text-neutral-400 font-bold mt-1">Exams</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-neutral-150/50 text-center shadow-xs">
            <h3 className="text-lg font-extrabold text-[#22C55E]">{userStats.accuracy}</h3>
            <p className="text-[10px] text-neutral-400 font-bold mt-1">Accuracy</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-neutral-150/50 text-center shadow-xs">
            <h3 className="text-lg font-extrabold text-amber-500">{userStats.rank}</h3>
            <p className="text-[10px] text-neutral-400 font-bold mt-1">Rank</p>
          </div>
        </div>

        {/* Today's Exams Lists */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-extrabold text-neutral-800 text-sm flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" /> Today's Live Exams
            </h3>
            <span className="text-xs text-neutral-400 font-bold">Active Today</span>
          </div>

          <div className="space-y-3.5">
            {(() => {
              const isExamToday = (exam: LiveExam) => {
                const examDateVal = (exam as any).date || (exam as any).examDate || (exam as any).startDate || exam.startTime || (exam as any).dateTime;
                if (!examDateVal) return true; // Default to true if no date field exists on mock structure
                let d: Date;
                if (examDateVal && (examDateVal.toDate || typeof examDateVal.seconds === 'number')) {
                  d = examDateVal.toDate ? examDateVal.toDate() : new Date(examDateVal.seconds * 1000);
                } else {
                  d = new Date(examDateVal);
                }

                if (isNaN(d.getTime())) {
                  const str = String(examDateVal).trim();
                  const today = new Date();
                  const day = String(today.getDate()).padStart(2, '0');
                  const month = String(today.getMonth() + 1).padStart(2, '0');
                  const year = today.getFullYear();
                  if (str.includes(`${day}-${month}-${year}`) || str.includes(`${year}-${month}-${day}`)) {
                    return true;
                  }
                  return false;
                }

                const today = new Date();
                return d.getDate() === today.getDate() &&
                       d.getMonth() === today.getMonth() &&
                       d.getFullYear() === today.getFullYear();
              };

              const todayExams = exams.filter(isExamToday);

              if (todayExams.length === 0) {
                return (
                  <div className="text-center py-8 text-neutral-400 font-bold text-xs bg-white border border-neutral-100 rounded-3xl">
                    আজকে কোনো লাইভ পরীক্ষা নেই।
                  </div>
                );
              }

              return todayExams.map((exam) => (
                <div 
                  key={exam.id} 
                  className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.015)] relative overflow-hidden hover:border-[#00BFA6]/40 transition-all group"
                >
                  {/* Access badge tag */}
                  <div className="absolute top-4 right-4">
                    {exam.access === "free" ? (
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Free Access
                      </span>
                    ) : exam.access === "premium" ? (
                      <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        👑 Premium
                      </span>
                    ) : (
                      <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Course Exclusive
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="h-11 w-11 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center font-bold text-lg">
                      📝
                    </div>
                    <div>
                      <h4 className="font-extrabold text-neutral-800 group-hover:text-[#00BFA6] transition-colors">
                        {exam.title}
                      </h4>
                      <p className="text-xs text-neutral-400 font-semibold">General Knowledge & BCS Syllabus</p>
                    </div>
                  </div>

                  {/* Meta details */}
                  <div className="flex items-center justify-between border-t border-neutral-50 pt-3.5 mb-4 text-xs text-neutral-500 font-bold">
                    <span>📋 {exam.questionIds.length} Questions</span>
                    <span>🏆 {exam.questionIds.length} Marks</span>
                    <span>⏱ {exam.duration} Mins</span>
                  </div>

                  <button
                    onClick={() => onStartExam(exam.id)}
                    className="w-full bg-linear-to-r from-[#00BFA6] to-[#009688] hover:shadow-lg transition-all text-white font-extrabold py-3.5 px-4 rounded-2xl border-none cursor-pointer text-sm"
                  >
                    🚀 Start Exam
                  </button>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Daily Challenges */}
        <div className="bg-linear-to-br from-[#00BFA6] to-[#009688] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-10px] text-white/10 text-9xl font-black">
            ⚡️
          </div>
          <div className="relative">
            <span className="bg-white/20 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest">
              Daily Challenge
            </span>
            <h3 className="text-lg font-black mt-3 leading-tight">BCS Core General Knowledge Blitz</h3>
            <p className="text-xs text-white/80 font-semibold mt-1">20 Questions • Boost your accuracy with this daily tracker</p>
            <button 
              onClick={() => onStartExam("exam_bcs_05")}
              className="mt-4 bg-white text-[#009688] hover:bg-neutral-50 transition-all font-extrabold text-xs px-4 py-2.5 rounded-xl border-none cursor-pointer"
            >
              Start Challenges Now
            </button>
          </div>
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-100">
          <h4 className="font-extrabold text-neutral-800 text-sm mb-3 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-[#00BFA6]" /> My Registered Courses
          </h4>
          <div className="space-y-2">
            {(courses || SAMPLE_COURSES).map((course) => (
              <div 
                key={course.id}
                className="bg-neutral-50 hover:bg-[#00BFA6]/5 border border-transparent hover:border-[#00BFA6]/20 py-3.5 px-4 rounded-2xl font-bold text-xs text-neutral-750 flex justify-between items-center transition-all cursor-pointer shadow-2xs"
                onClick={() => {
                  setSelectedCourseForDetails(course);
                  setModalTab("routine");
                }}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-extrabold text-neutral-800 text-xs">📘 {course.title}</span>
                  <p className="text-[10px] text-neutral-400 font-bold">পরীক্ষার রুটিন ও পিডিএফ দেখতে ট্যাপ করুন</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-[#009688] font-black px-2.5 py-1 rounded-xl">বিস্তারিত</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Dynamic Course Details Model for Routine and PDFs */}
      {selectedCourseForDetails && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden max-h-[85vh] flex flex-col shadow-2xl border border-neutral-150 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-[#009688] text-white relative">
              <button 
                onClick={() => setSelectedCourseForDetails(null)}
                className="absolute right-4 top-4 p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer border-none bg-transparent text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-5 w-5" />
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">Course Dashboard</span>
              </div>
              <h3 className="text-base font-black leading-tight mt-1">{selectedCourseForDetails.title}</h3>
            </div>

            {/* Modal Tabs Row */}
            <div className="flex border-b border-neutral-100 bg-neutral-50 p-1 gap-1">
              <button
                onClick={() => setModalTab("routine")}
                className={`flex-1 py-3 text-xs font-black rounded-2xl cursor-pointer border-none transition-all flex items-center justify-center gap-1.5 ${
                  modalTab === "routine" 
                    ? "bg-white text-[#009688] shadow-2xs" 
                    : "text-neutral-500 hover:text-neutral-800 bg-transparent"
                }`}
              >
                <Calendar className="h-4 w-4" /> পরীক্ষা রুটিন
              </button>
              <button
                onClick={() => setModalTab("pdfs")}
                className={`flex-1 py-3 text-xs font-black rounded-2xl cursor-pointer border-none transition-all flex items-center justify-center gap-1.5 ${
                  modalTab === "pdfs" 
                    ? "bg-white text-[#009688] shadow-2xs" 
                    : "text-neutral-500 hover:text-neutral-800 bg-transparent"
                }`}
              >
                <FileText className="h-4 w-4" /> লেকচার শিট (PDF)
              </button>
            </div>

            {/* Modal Content Area */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {modalTab === "routine" ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#009688] bg-[#009688]/5 p-3 rounded-2xl border border-[#009688]/10">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p className="text-[10px] font-bold leading-relaxed">নিয়মিত পরীক্ষার আপডেট এবং সময়সূচী লক্ষ্য রাখুন।</p>
                  </div>

                  {!selectedCourseForDetails.routine || selectedCourseForDetails.routine.length === 0 ? (
                    <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                      <Calendar className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                      <p className="text-xs text-neutral-500 font-extrabold">কোনো পরীক্ষার সময়সূচী পাওয়া যায়নি!</p>
                      <p className="text-[10px] text-neutral-400 font-semibold mt-1">এডমিন নতুন সময়সূচী দিলে তা এখানে দেখতে পাবেন।</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedCourseForDetails.routine.map((item, index) => (
                        <div 
                          key={index} 
                          className="p-3.5 bg-neutral-50 hover:bg-neutral-100/50 rounded-2xl border border-neutral-100 flex items-start gap-3 transition-colors shadow-2xs"
                        >
                          <span className="bg-emerald-50 text-[#009688] text-[10px] font-black px-2 py-1 rounded-xl whitespace-nowrap">
                            {item.date}
                          </span>
                          <div className="flex-1">
                            <h4 className="text-xs font-extrabold text-neutral-800 leading-normal">{item.topic}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#009688] bg-[#009688]/5 p-3 rounded-2xl border border-[#009688]/10">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p className="text-[10px] font-bold leading-relaxed">ক্লাসের সব পিডিএফ ও লেকচার মেটেরিয়াল ডাউনলোড করে রাখুন।</p>
                  </div>

                  {!selectedCourseForDetails.pdfs || selectedCourseForDetails.pdfs.length === 0 ? (
                    <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                      <FileText className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                      <p className="text-xs text-neutral-500 font-extrabold">কোনো পিডিএফ লেকচার শিট আপলোড করা হয়নি!</p>
                      <p className="text-[10px] text-neutral-400 font-semibold mt-1">এডমিন লেকচার শিট সংযুক্ত করলে তা এখানে পাবেন।</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedCourseForDetails.pdfs.map((item, index) => (
                        <div 
                          key={index} 
                          className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between transition-colors shadow-2xs"
                        >
                          <div className="mr-3 leading-snug">
                            <h4 className="text-xs font-extrabold text-neutral-800 mb-0.5">{item.title}</h4>
                            <span className="text-[9px] text-neutral-400 font-semibold">আপডেট: {item.date || "আজ"}</span>
                          </div>
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            referrerPolicy="no-referrer"
                            className="bg-sky-50 text-[#009688] hover:bg-sky-100 p-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                            title="Download PDF"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex gap-2">
              <button
                onClick={() => setSelectedCourseForDetails(null)}
                className="flex-1 py-3 text-xs font-bold text-neutral-500 hover:text-neutral-800 bg-white hover:bg-neutral-100 rounded-xl border border-neutral-200 cursor-pointer transition-colors"
              >
                বন্ধ করুন (Close)
              </button>
              <button
                onClick={() => {
                  setSelectedCourseForDetails(null);
                  onNavigate("exam-page");
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3 rounded-xl border-none text-xs cursor-pointer flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                পরীক্ষা দিন (Start Test)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
