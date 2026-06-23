import React, { useState, useMemo } from "react";
import { 
  Calendar, BookOpen, Download, Search, ChevronRight, FileText, Sparkles, ArrowLeft 
} from "lucide-react";

interface RoutineItem {
  date: string;
  topic: string;
  description?: string;
}

interface Course {
  id: string;
  title: string;
  category?: string;
  categoryName?: string;
  routine?: RoutineItem[];
}

interface RoutinePageProps {
  courses: Course[];
  customFiles?: any[]; // optional list of lecture files from admin
  onBack?: () => void;
}

export default function RoutinePage({ courses = [], customFiles = [], onBack }: RoutinePageProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses[0]?.id || ""
  );
  const [activeTab, setActiveTab] = useState<"routine" | "pdfs">("routine");
  const [searchQuery, setSearchQuery] = useState("");

  const activeCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId) || courses[0];
  }, [courses, selectedCourseId]);

  // Normalize/collect PDFs for the active course
  const coursePdfs = useMemo(() => {
    if (!activeCourse) return [];
    
    // Extract base pdfs from course itself (if loaded via course document)
    const basePdfs = Array.isArray((activeCourse as any).pdfs) ? (activeCourse as any).pdfs : [];

    // Filter from customFiles where courseId matches
    const matched = customFiles.filter(f => 
      String(f.courseId || f.course_id) === String(activeCourse.id)
    );
    const matchedMapped = matched.map(f => ({
      title: f.title || f.name || "Lecture Sheet PDF",
      link: f.link || f.url || "#",
      date: f.date || f.time || "আজ"
    }));

    const combined = [...basePdfs, ...matchedMapped];
    // filter duplicates
    const unique: any[] = [];
    combined.forEach(p => {
      if (!unique.some(existing => existing.link === p.link)) {
        unique.push(p);
      }
    });

    return unique.filter(f => f.link && f.link !== "#");
  }, [activeCourse, customFiles]);

  const filteredRoutine = useMemo(() => {
    if (!activeCourse || !activeCourse.routine) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return activeCourse.routine;
    return activeCourse.routine.filter(item => 
      item.topic.toLowerCase().includes(q) || item.date.toLowerCase().includes(q)
    );
  }, [activeCourse, searchQuery]);

  const filteredPdfs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return coursePdfs;
    return coursePdfs.filter(pdf => 
      pdf.title.toLowerCase().includes(q) || pdf.date.toLowerCase().includes(q)
    );
  }, [coursePdfs, searchQuery]);

  return (
    <div className="pb-24 max-w-lg mx-auto bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4.5 sticky top-0 z-10 flex items-center justify-between shadow-xs">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-neutral-100 rounded-xl transition-all cursor-pointer text-[#009688] flex items-center justify-center border-none bg-transparent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-base font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
          📅 অল কোর্স রুটিন ও লেকচার ড্যাশবোর্ড
        </h2>
        <div className="w-9"></div>
      </div>

      <div className="p-4 space-y-5">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-[-15px] bottom-[-15px] text-white/10 text-8xl font-black select-none pointer-events-none">
            📅
          </div>
          <div className="relative">
            <span className="bg-white/25 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest">
              SCHEDULE & RESOURCES
            </span>
            <h3 className="text-base font-black mt-3 leading-tight">
              পরীক্ষার রুটিন ও লেকচার ড্যাশবোর্ড
            </h3>
            <p className="text-[11px] text-white/95 mt-1 font-bold">
              নিচের যেকোনো কোর্স নির্বাচন করে আজকের ক্লাসের পিডিএফ বা আসন্ন গুরুত্বপূর্ণ পরীক্ষার রুটিন এখনই চেক করে নিন।
            </p>
          </div>
        </div>

        {/* Courses List Selector */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-neutral-800 text-sm flex items-center gap-1.5 pb-1">
            <span className="w-2 h-4 bg-[#00BFA1] rounded-xs inline-block"></span>
            আপনার সক্রিয় কোর্সসমূহ নির্বাচন করুনঃ
          </h4>

          {courses.length === 0 ? (
            <div className="text-center py-6 text-neutral-400 text-xs font-bold bg-white border border-neutral-100 rounded-2xl">
              ⚠️ কোনো কোর্স পাওয়া যায়নি।
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {courses.map((course) => {
                const isSelected = course.id === selectedCourseId;
                const matchPdfs = customFiles.filter(f => 
                  String(f.courseId || f.course_id) === String(course.id)
                );
                return (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center justify-between p-4.5 rounded-2xl text-left transition-all border cursor-pointer ${
                      isSelected 
                        ? "bg-[#00BFA6]/10 border-[#00BFA6] shadow-sm" 
                        : "bg-white border-neutral-100 hover:border-neutral-200"
                    }`}
                  >
                    <div className="min-width-0 flex-1 pr-2">
                      <h4 className={`text-sm font-extrabold mr-2 line-clamp-1 ${
                        isSelected ? "text-[#009688]" : "text-neutral-800"
                      }`}>
                        🎓 {course.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-bold mt-1.5 space-x-2">
                        <span className="bg-neutral-100 px-2 py-0.5 rounded-md text-neutral-600">
                          📋 {course.routine?.length || 0}টি রুটিন আইটেম
                        </span>
                        <span className="bg-amber-50 px-2 py-0.5 rounded-md text-amber-700 font-bold ml-1">
                          📄 {matchPdfs.length}টি পিডিএফ লার্নিং শিট
                        </span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span className="text-[9px] bg-[#00BFA1] text-white font-black px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      )}
                      <ChevronRight className={`h-4.5 w-4.5 ${isSelected ? "text-[#009688]" : "text-neutral-400"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Course Routine & Lectures Content Column */}
        {activeCourse && (
          <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs space-y-4">
            <div>
              <span className="bg-sky-50 text-sky-700 text-[10px] font-black px-2 py-0.5 rounded-md">
                {activeCourse.categoryName || activeCourse.category || "General Studies"}
              </span>
              <h3 className="text-base font-extrabold text-neutral-900 mt-1">
                {activeCourse.title}
              </h3>
            </div>

            {/* Tab switchers */}
            <div className="flex bg-neutral-100 p-1 rounded-xl gap-1">
              <button
                onClick={() => {
                  setActiveTab("routine");
                  setSearchQuery("");
                }}
                className={`flex-1 py-2 rounded-lg font-extrabold text-xs border-none cursor-pointer text-center flex items-center justify-center gap-1 transition-all ${
                  activeTab === "routine"
                    ? "bg-white text-[#009688] shadow-xs font-black"
                    : "text-neutral-500 bg-transparent hover:text-neutral-700"
                }`}
              >
                📋 পরীক্ষার রুটিন ({activeCourse.routine?.length || 0})
              </button>
              <button
                onClick={() => {
                  setActiveTab("pdfs");
                  setSearchQuery("");
                }}
                className={`flex-1 py-2 rounded-lg font-extrabold text-xs border-none cursor-pointer text-center flex items-center justify-center gap-1 transition-all ${
                  activeTab === "pdfs"
                    ? "bg-white text-[#009688] shadow-xs font-black"
                    : "text-neutral-500 bg-transparent hover:text-neutral-700"
                }`}
              >
                📄 পিডিএফ শিটসমূহ ({coursePdfs.length})
              </button>
            </div>

            {/* Inline search bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="সিলেবাস বা টপিক কিওয়ার্ড খুজুন..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#00BFA6] focus:bg-white box-border"
              />
            </div>

            {/* Active Content rendering */}
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {activeTab === "routine" ? (
                // Routine day items
                filteredRoutine.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 text-xs font-bold leading-relaxed">
                    🍂 কোনো পরীক্ষা সময়সূচী পাওয়া যায়নি।
                  </div>
                ) : (
                  filteredRoutine.map((item, index) => {
                    const durationText = item.duration || "১৫ মিঃ";
                    const marksText = item.marks ? (item.marks.includes("নম্বর") || item.marks.includes("প্রশ্ন") ? item.marks : `${item.marks} নম্বর`) : "২০ নম্বর";
                    return (
                      <div 
                        key={index}
                        className="bg-neutral-50/70 border border-neutral-100 rounded-2xl p-4 flex flex-col gap-2.5 hover:border-[#00BFA1]/30 transition-all text-left"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="bg-[#ECFDF5] text-[#009688] font-bold text-[10px] px-2.5 py-1.5 rounded-xl text-center flex flex-col justify-center min-w-[70px] border border-emerald-100/30 font-mono">
                            <span className="text-[9px] text-[#009688]/80 font-black">সময়কাল</span>
                            <span className="text-xs font-black mt-0.5">{item.date}</span>
                          </div>
                          <div className="min-width-0 flex-1">
                            <h4 className="text-sm font-extrabold text-neutral-800 leading-snug">
                              {item.topic}
                            </h4>
                            {item.syllabus && (
                              <p className="text-xs text-neutral-500 font-semibold mt-1.5">
                                <span className="text-sky-700 font-bold">📖 সিলেবাসঃ</span> {item.syllabus}
                              </p>
                            )}
                            <div className="text-[10px] text-neutral-400 font-bold mt-2.5 flex flex-wrap items-center gap-1.5">
                              <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md text-[9px]">🎯 এমসিকিউ পরীক্ষা</span>
                              <span>•</span>
                              <span>⏱ {durationText}</span>
                              <span>•</span>
                              <span>📑 {marksText}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )
              ) : (
                // PDF lecture file download list
                filteredPdfs.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 text-xs font-bold leading-relaxed">
                    📂 এখনও কোনো পিডিএফ বুকলেট বা লেকচার শিট আপলোড করা হয়নি।
                  </div>
                ) : (
                  filteredPdfs.map((pdf, index) => (
                    <div 
                      key={index}
                      className="bg-white border border-neutral-100 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-3xs hover:border-[#00BFA1]/20 transition-all text-left"
                    >
                      <div className="min-width-0 flex-1">
                        <h4 className="text-xs font-extrabold text-neutral-800 line-clamp-2 leading-relaxed">
                          📄 {pdf.title}
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-semibold mt-1 block">
                          আপলোডঃ {pdf.date}
                        </span>
                      </div>
                      <a 
                        href={pdf.link}
                        target="_blank"
                        rel="referer"
                        className="flex-shrink-0 bg-gradient-to-r from-[#00BFA6] to-[#009688] hover:shadow-md transition-all text-white font-extrabold text-[11px] px-4 py-2.5 rounded-xl border-none text-center cursor-pointer flex items-center gap-1"
                      >
                        <Download className="h-3.5 w-3.5" /> ডাউনলোড
                      </a>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
