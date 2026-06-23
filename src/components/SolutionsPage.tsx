import React from "react";
import { ArrowLeft, Check, X, HelpCircle, AlertCircle } from "lucide-react";
import { Question } from "../types";

interface SolutionsPageProps {
  questions: Question[];
  savedAnswers: Record<number, { questionId: string; answer: number }>;
  onBack: () => void;
}

export default function SolutionsPage({ questions, savedAnswers, onBack }: SolutionsPageProps) {
  return (
    <div className="pb-24 max-w-lg mx-auto bg-neutral-50 min-h-screen p-4">
      
      {/* Header */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-4 flex items-center gap-3.5 mb-5 shadow-xs">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-neutral-100 rounded-xl transition-all border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <div>
          <h2 className="text-base font-extrabold text-neutral-900">📖 Solutions & Review</h2>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Exam Questions Walkthrough</p>
        </div>
      </div>

      {/* Solutions list */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const userAnswer = savedAnswers[idx]?.answer || null;
          const isCorrect = userAnswer === q.correctAnswer;
          
          const options = [q.option1, q.option2, q.option3, q.option4];
          const userAnswerText = userAnswer ? options[userAnswer - 1] : "Not Answered";
          const correctAnswerText = options[q.correctAnswer - 1];

          return (
            <div 
              key={q.id}
              className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.01)] space-y-4"
            >
              {/* Question Identifier banner */}
              <div className="flex justify-between items-center pb-2 border-b border-neutral-50">
                <span className="font-extrabold text-xs text-neutral-400">
                  Question {idx + 1}
                </span>
                {userAnswer === null ? (
                  <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    Skipped ⚪️
                  </span>
                ) : isCorrect ? (
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    Correct ✅
                  </span>
                ) : (
                  <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    Wrong ❌
                  </span>
                )}
              </div>

              {/* Main question description */}
              <h3 className="font-extrabold text-neutral-900 leading-snug">
                {q.question}
              </h3>

              {/* Answers block */}
              <div className="space-y-3">
                
                {/* User selection display */}
                <div 
                  className={`p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2.5 leading-relaxed ${
                    userAnswer === null
                      ? "bg-slate-50 text-slate-700 border border-slate-100"
                      : isCorrect
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                        : "bg-rose-50 text-rose-800 border border-rose-100"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {userAnswer === null ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : isCorrect ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <X className="h-4 w-4 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-neutral-500 uppercase tracking-wider text-[9px] block mb-0.5">Your Answer</span>
                    <span className="text-sm font-extrabold">{userAnswerText}</span>
                  </div>
                </div>

                {/* Correct answer display (strictly present if user was incorrect or skipped) */}
                {(!isCorrect || userAnswer === null) && (
                  <div className="p-3.5 bg-emerald-50/55 text-emerald-800 border border-emerald-100 rounded-2xl text-xs font-semibold flex items-start gap-2.5 leading-relaxed">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-500 uppercase tracking-wider text-[9px] block mb-0.5">Correct Option</span>
                      <span className="text-sm font-extrabold">{correctAnswerText}</span>
                    </div>
                  </div>
                )}

                {/* Explanation text */}
                <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-xs font-medium text-sky-850 leading-relaxed">
                  <div className="flex items-center gap-1 text-sky-700 font-bold mb-1.5 uppercase tracking-wider text-[9px]">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Explanation & Solutions Context</span>
                  </div>
                  <p>{q.explanation || "এই প্রশ্নের জন্য কোনো অতিরিক্ত ব্যাখ্যা আপলোড করা হয়নি।"}</p>
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
