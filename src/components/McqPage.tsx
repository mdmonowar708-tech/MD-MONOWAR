import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Clock, Info, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { LiveExam, Question } from "../types";

interface McqPageProps {
  exam: LiveExam;
  questions: Question[];
  savedAnswers: Record<number, { questionId: string; answer: number }>;
  onSelectAnswer: (questionIndex: number, answerNo: number) => void;
  onFinishExam: (timeLeftSeconds: number) => void;
  onCancel: () => void;
}

export default function McqPage({ 
  exam, 
  questions, 
  savedAnswers, 
  onSelectAnswer, 
  onFinishExam, 
  onCancel 
}: McqPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer Effect
  useEffect(() => {
    setTimeLeft(exam.duration * 60);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          onFinishExam(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [exam.id]);

  const currentQuestion = questions[currentIndex];

  // Helper formats
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentSelectedOption = savedAnswers[currentIndex]?.answer || null;

  return (
    <div className="pb-24 max-w-lg mx-auto bg-neutral-50 min-h-screen p-4">
      
      {/* Top Header */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-4 flex justify-between items-center mb-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (window.confirm("আপনি কি পরীক্ষা বাতিল করতে চান? আংশিক উত্তরগুলো হারিয়ে যাবে।")) {
                onCancel();
              }
            }}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 text-neutral-600" />
          </button>
          <div className="max-w-[200px]">
            <h3 className="font-extrabold text-neutral-800 text-sm truncate">{exam.title}</h3>
            <p className="text-[10px] text-neutral-400 font-bold">Negative: -{exam.negativeMark}</p>
          </div>
        </div>

        {/* Floating Timer */}
        <div className="bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-rose-600 font-bold text-sm">
          <Clock className="h-4 w-4 animate-pulse" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Primary Question Box */}
      {currentQuestion ? (
        <div className="space-y-4">
          <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.01)]">
            
            {/* Index Tracker */}
            <div className="flex justify-between items-center mb-3">
              <span className="bg-indigo-50 text-indigo-600 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-neutral-400 font-bold text-xs">
                {currentSelectedOption ? "🟢 Answered" : "⚪️ Pending"}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-base font-extrabold text-neutral-900 leading-relaxed mb-5">
              {currentQuestion.question}
            </h2>

            {/* Option Radios */}
            <div className="space-y-3">
              {[
                { no: 1, prefix: "ক", text: currentQuestion.option1 },
                { no: 2, prefix: "খ", text: currentQuestion.option2 },
                { no: 3, prefix: "গ", text: currentQuestion.option3 },
                { no: 4, prefix: "ঘ", text: currentQuestion.option4 }
              ].map((opt) => {
                const isSelected = currentSelectedOption === opt.no;
                return (
                  <div
                    key={opt.no}
                    onClick={() => onSelectAnswer(currentIndex, opt.no)}
                    className={`flex items-center gap-3 border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? "border-[#00BFA6] bg-[#00BFA6]/5" 
                        : "border-neutral-150 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div 
                      className={`h-8 w-8 rounded-full font-black text-sm flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected 
                          ? "bg-[#00BFA6] text-white" 
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {opt.prefix}
                    </div>
                    <span className="text-[#111827] text-sm font-semibold">{opt.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action flow buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex-1 py-3.5 bg-neutral-200 hover:bg-neutral-300 disabled:opacity-45 text-neutral-800 rounded-2xl font-bold flex items-center justify-center gap-1.5 transition-all border-none cursor-pointer text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={() => {
                  if (window.confirm("আপনি কি পরীক্ষা সাবমিট করতে চান? সব উত্তর যাচাই করে নিন।")) {
                    onFinishExam(timeLeft);
                  }
                }}
                className="flex-1 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:opacity-95 text-white rounded-2xl font-black text-sm transition-all border-none cursor-pointer"
              >
                🏁 Submit Exam
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex-1 py-3.5 bg-[#00BFA6] hover:bg-[#009688] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-1.5 transition-all border-none cursor-pointer"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Index grid palette */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs">
            <h4 className="font-bold text-neutral-700 text-xs uppercase tracking-wider mb-4 flex items-center gap-1">
              <Info className="h-4 w-4 text-neutral-400" /> Question Navigator
            </h4>
            
            <div className="grid grid-cols-5 gap-2.5">
              {questions.map((_, idx) => {
                const isCurrent = idx === currentIndex;
                const hasAnswered = !!savedAnswers[idx];
                
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center border-none cursor-pointer ${
                      isCurrent 
                        ? "bg-indigo-650 text-white ring-2 ring-indigo-300 shadow-sm" 
                        : hasAnswered 
                          ? "bg-emerald-500 text-white" 
                          : "bg-neutral-150 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center bg-white rounded-3xl p-10 border border-neutral-100">
          <p className="text-neutral-500 font-bold">No Questions Found.</p>
        </div>
      )}
    </div>
  );
}
