import React from "react";
import { ArrowLeft, Clock, HelpCircle, AlertTriangle, Play } from "lucide-react";
import { LiveExam } from "../types";
import { SAMPLE_COURSES } from "../simulationData";

interface ExamSummaryProps {
  exam: LiveExam;
  onBack: () => void;
  onRealStart: () => void;
}

export default function ExamSummary({ exam, onBack, onRealStart }: ExamSummaryProps) {
  const course = SAMPLE_COURSES.find((c) => c.id === exam.courseId);
  const courseTitle = course ? course.title : "General Course Assessment";

  return (
    <div className="pb-24 max-w-lg mx-auto bg-neutral-50 min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 bg-white border border-neutral-100 hover:bg-neutral-50 rounded-xl transition-all cursor-pointer text-neutral-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-neutral-800">Exam Overview</h2>
          <p className="text-xs text-neutral-400 font-semibold">Verify details before starting</p>
        </div>
      </div>

      {/* Main card description */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
        
        {/* Title */}
        <div className="text-center pb-5 border-b border-neutral-50">
          <span className="inline-block bg-[#00BFA6]/10 text-[#009688] font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            {courseTitle}
          </span>
          <h1 className="text-xl font-extrabold text-neutral-900 leading-snug">{exam.title}</h1>
          <p className="text-xs text-neutral-400 font-bold mt-1">General MCQ Mock Syllabus</p>
        </div>

        {/* Specifications grids */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-neutral-50 p-4 rounded-2xl text-center">
            <HelpCircle className="h-5 w-5 text-[#00BFA6] mx-auto mb-1.5" />
            <h3 className="text-lg font-black text-neutral-800">{exam.questionIds.length}</h3>
            <p className="text-[10px] text-neutral-400 font-bold">Questions</p>
          </div>
          
          <div className="bg-neutral-50 p-4 rounded-2xl text-center">
            <Clock className="h-5 w-5 text-indigo-500 mx-auto mb-1.5" />
            <h3 className="text-lg font-black text-neutral-800">{exam.duration}</h3>
            <p className="text-[10px] text-neutral-400 font-bold">Minutes</p>
          </div>

          <div className="bg-neutral-50 p-4 rounded-2xl text-center">
            <AlertTriangle className="h-5 w-5 text-rose-500 mx-auto mb-1.5" />
            <h3 className="text-lg font-black text-rose-600">-{exam.negativeMark}</h3>
            <p className="text-[10px] text-neutral-400 font-bold">Negative</p>
          </div>
        </div>

        {/* Cautions info */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-amber-800">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <h4 className="font-extrabold text-xs">গুরুত্বপূর্ণ নির্দেশনা:</h4>
            <p className="text-[11px] font-semibold text-neutral-650 leading-relaxed mt-1">
              একবার 'Start Exam' বাটন ক্লিক করলে টাইমার কাউন্টডাউন শুরু হয়ে যাবে। পূর্ববর্তী পেইজে ফিরে যাওয়া যাবে না এবং সাবমিট বাটনে ক্লিক করা ছাড়া পরীক্ষা সমাপ্তি হবে না।
            </p>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={onRealStart}
          className="w-full bg-[#00BFA6] hover:bg-[#009688] text-white font-extrabold py-4 px-4 rounded-2xl transition-all shadow-[0_4px_16px_rgba(0,191,166,0.2)] flex items-center justify-center gap-2 border-none cursor-pointer text-sm"
        >
          <Play className="h-4 w-4 fill-white" /> Start Live Exam Now
        </button>

      </div>
    </div>
  );
}
