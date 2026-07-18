import React, { useState, useEffect } from 'react';
import { LiveExam, Question } from '../types';
import TtsButton from './TtsButton';
import { Sparkles, Clock, CheckCircle2, AlertCircle, HelpCircle, X, Volume2, ArrowRight, Loader2, BookOpen, FileText } from 'lucide-react';

interface McqPageProps {
  exam: LiveExam;
  questions: Question[];
  savedAnswers: Record<number, { questionId: string; answer: number }>;
  onSelectAnswer: (index: number, answer: number) => void;
  onFinishExam: (timeLeft: number) => void;
  onCancel: () => void;
}

interface AiHelpState {
  loading: boolean;
  explanation: string;
  mode: 'hint' | 'explain';
  error: string | null;
}

export default function McqPage({ exam, questions, savedAnswers, onSelectAnswer, onFinishExam, onCancel }: McqPageProps) {
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [aiStates, setAiStates] = useState<Record<string, AiHelpState>>({});

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      // Auto submit when time is up
      alert("⏰ সময় শেষ! আপনার উত্তরসমূহ স্বয়ংক্রিয়ভাবে সাবমিট করা হচ্ছে।");
      onFinishExam(0);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onFinishExam]);

  // Format time display as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Build educational AI prompt
  const buildAiPrompt = (question: Question, mode: 'hint' | 'explain') => {
    const optionsText = [
      `১. ${question.option1}`,
      `২. ${question.option2}`,
      `৩. ${question.option3}`,
      `৪. ${question.option4}`
    ].join('\n');

    if (mode === 'hint') {
      return `You are a friendly, highly skilled educational tutor helping a student with an MCQ question.
The student is currently taking a live exam and is stuck.
Do NOT reveal the correct option directly (do not mention which number or text is correct).
Instead, explain the core concepts, provide a smart hint, explain formulas/principles, and guide them on how they can think to solve it.

Question:
${question.question}

Options:
${optionsText}

${question.explanation ? `Context Hint: ${question.explanation}` : ''}

Response Guideline:
- Write in Bengali.
- Do NOT name the correct option or final answer text.
- Give a quick, encouraging hint or calculation formula.
- Use simple Markdown with **bold words** and bullets for outstanding readability.
- Keep it concise (under 120 words) so they can read it quickly during the test.`;
    } else {
      return `You are a friendly, expert educational tutor. Provide a simplified, crystal-clear, step-by-step explanation of the correct answer.

Question:
${question.question}

Options:
${optionsText}

Correct Option Number: ${question.correctAnswer} (which is: ${question[`option${question.correctAnswer}` as keyof Question]})

${question.explanation ? `Context: ${question.explanation}` : ''}

Response Guideline:
- Explicitly explain why option ${question.correctAnswer} (${question[`option${question.correctAnswer}` as keyof Question]}) is the correct answer.
- Show step-by-step mathematical calculations simply if applicable (e.g. series, ratio, interest calculation).
- Write in Bengali.
- Use simple Markdown with **bold text** for key takeaway concepts.
- Keep it engaging, educational, and clear (under 150 words).`;
    }
  };

  // Call server-side ask-ai endpoint
  const handleAskAi = async (question: Question, mode: 'hint' | 'explain') => {
    const qid = question.id;

    // Set loading state
    setAiStates((prev) => ({
      ...prev,
      [qid]: {
        loading: true,
        explanation: '',
        mode: mode,
        error: null
      }
    }));

    try {
      const prompt = buildAiPrompt(question, mode);
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt })
      });

      if (!res.ok) {
        throw new Error("AI সার্ভিস রেসপন্স দিতে ব্যর্থ হয়েছে।");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAiStates((prev) => ({
        ...prev,
        [qid]: {
          loading: false,
          explanation: data.answer || "কোনো সমাধান পাওয়া যায়নি।",
          mode: mode,
          error: null
        }
      }));
    } catch (err: any) {
      console.error("AI Error:", err);
      setAiStates((prev) => ({
        ...prev,
        [qid]: {
          loading: false,
          explanation: '',
          mode: mode,
          error: err.message || "AI রেসপন্স পেতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
        }
      }));
    }
  };

  // Speech helper for AI explanations
  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      alert("আপনার ব্রাউজারে টেক্সট-টু-স্পিচ সাপোর্ট নেই।");
      return;
    }
    window.speechSynthesis.cancel(); // Stop active audio
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Close/reset AI panel for a question
  const closeAiPanel = (qid: string) => {
    setAiStates((prev) => {
      const copy = { ...prev };
      delete copy[qid];
      return copy;
    });
  };

  // Parse markdown bold (**text**) and bullet lists safely
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-neutral-800 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, index) => {
          let cleanLine = line.trim();
          if (!cleanLine) return <div key={index} className="h-2" />;

          const isBullet = cleanLine.startsWith('-') || cleanLine.startsWith('*') || cleanLine.startsWith('•');
          if (isBullet) {
            cleanLine = cleanLine.substring(1).trim();
          }

          const parts = [];
          let currentIndex = 0;
          const boldRegex = /\*\*(.*?)\*\*/g;
          let match;

          while ((match = boldRegex.exec(cleanLine)) !== null) {
            const matchIndex = match.index;
            if (matchIndex > currentIndex) {
              parts.push(cleanLine.substring(currentIndex, matchIndex));
            }
            parts.push(<strong key={matchIndex} className="font-extrabold text-[#009688]">{match[1]}</strong>);
            currentIndex = boldRegex.lastIndex;
          }

          if (currentIndex < cleanLine.length) {
            parts.push(cleanLine.substring(currentIndex));
          }

          if (isBullet) {
            return (
              <div key={index} className="flex items-start gap-2 ml-2">
                <span className="text-[#00BFA6] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00BFA6]" />
                <span className="flex-1">{parts.length > 0 ? parts : cleanLine}</span>
              </div>
            );
          }

          return (
            <p key={index}>
              {parts.length > 0 ? parts : cleanLine}
            </p>
          );
        })}
      </div>
    );
  };

  // Stats calculation
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(savedAnswers).length;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // Style timer badge based on time remaining
  const getTimerStyles = () => {
    if (timeLeft < 60) {
      return "bg-red-50 text-red-600 border-red-200 animate-pulse";
    }
    if (timeLeft < 180) {
      return "bg-amber-50 text-amber-600 border-amber-200";
    }
    return "bg-teal-50 text-teal-700 border-teal-200";
  };

  return (
    <div className="bg-neutral-50 min-h-screen pb-28">
      {/* Sticky Exam Hub Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-20 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-base font-extrabold text-neutral-800 tracking-tight flex items-center gap-2">
              <FileText size={18} className="text-[#00BFA6]" />
              {exam.title}
            </h2>
            <p className="text-[11px] text-neutral-400 font-bold uppercase mt-0.5 tracking-wider">
              {exam.courseId ? "BCS PREPARATION COURSE" : "GENERAL KNOWLEDGE & MATH"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown Clock */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-black transition-colors ${getTimerStyles()}`}>
              <Clock size={15} />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Quick Progress Indicator */}
            <span className="text-[11px] font-black text-neutral-500 bg-neutral-100 px-2.5 py-1.5 rounded-full">
              {answeredCount}/{totalQuestions} Answered
            </span>
          </div>
        </div>

        {/* Top Slim Progress Bar */}
        <div className="w-full bg-neutral-100 h-1.5">
          <div 
            className="bg-[#00BFA6] h-1.5 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Questions Layout */}
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {questions.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-neutral-100 shadow-xs">
            <HelpCircle className="mx-auto text-neutral-300 mb-2" size={40} />
            <p className="text-neutral-500 font-bold">পরীক্ষায় কোনো প্রশ্ন পাওয়া যায়নি।</p>
          </div>
        ) : (
          questions.map((q, idx) => {
            const selectedAnswer = savedAnswers[idx]?.answer;
            const hasAiHelp = !!aiStates[q.id];
            const aiHelp = aiStates[q.id];

            return (
              <div 
                key={q.id} 
                className="bg-white border border-neutral-100 rounded-3xl p-5 sm:p-6 shadow-xs transition-all hover:shadow-md"
              >
                {/* Question Text */}
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 bg-teal-50 text-[#009688] font-black rounded-2xl w-8 h-8 flex items-center justify-center text-sm">
                      {idx + 1}
                    </span>
                    <div className="flex-1 pt-1">
                      <h3 className="font-extrabold text-neutral-800 text-sm sm:text-base leading-snug">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  {/* Audio & AI Action Toolbar */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 pl-11">
                    <TtsButton text={q.question} />

                    {/* Ask AI for Help button */}
                    <button
                      onClick={() => handleAskAi(q, 'hint')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                        hasAiHelp && aiHelp.mode === 'hint'
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 shadow-xs"
                      }`}
                    >
                      <Sparkles size={14} className="text-amber-500 animate-pulse" />
                      <span>💡 AI ক্লু (Ask Hint)</span>
                    </button>

                    <button
                      onClick={() => handleAskAi(q, 'explain')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                        hasAiHelp && aiHelp.mode === 'explain'
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 shadow-xs"
                      }`}
                    >
                      <BookOpen size={14} className="text-purple-500" />
                      <span>🎯 AI সমাধান (Full Help)</span>
                    </button>
                  </div>
                </div>

                {/* Question Options */}
                <div className="space-y-2 pl-11">
                  {[1, 2, 3, 4].map((opt) => {
                    const optionText = q[`option${opt}` as keyof Question] as string;
                    const isSelected = selectedAnswer === opt;

                    return (
                      <button
                        key={opt}
                        onClick={() => onSelectAnswer(idx, opt)}
                        className={`w-full p-3 sm:p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-teal-50 border-[#00BFA6] text-teal-900 font-extrabold shadow-sm"
                            : "bg-white hover:bg-neutral-50 border-neutral-100 text-neutral-700 font-medium"
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{optionText}</span>
                        {isSelected ? (
                          <CheckCircle2 size={18} className="text-[#00BFA6] flex-shrink-0" />
                        ) : (
                          <span className="w-5 h-5 rounded-full border border-neutral-200 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* AI Explanation Area (Stays inside active Exam Flow) */}
                {hasAiHelp && (
                  <div className="mt-5 ml-11 border-t border-dashed border-neutral-100 pt-4">
                    <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 relative">
                      {/* Close button */}
                      <button
                        onClick={() => closeAiPanel(q.id)}
                        className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600 cursor-pointer bg-transparent border-none p-1 rounded-full hover:bg-purple-100"
                        title="বন্ধ করুন (Close)"
                      >
                        <X size={15} />
                      </button>

                      {/* Header/Tabs */}
                      <div className="flex items-center gap-3 mb-3 pb-2 border-b border-purple-100/60">
                        <div className="bg-purple-100 text-purple-700 p-1.5 rounded-lg">
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-black text-purple-800 uppercase tracking-wider">
                            {aiHelp.mode === 'hint' ? '💡 AI TUTOR HINT (ধারণা)' : '🎯 AI FULL BREAKDOWN (সমাধান)'}
                          </span>
                          <p className="text-[10px] text-purple-400 font-semibold uppercase mt-0.5">Powered by Gemini AI</p>
                        </div>
                      </div>

                      {/* Mode Toggles */}
                      <div className="flex items-center gap-2 mb-4">
                        <button
                          onClick={() => handleAskAi(q, 'hint')}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            aiHelp.mode === 'hint'
                              ? "bg-purple-600 text-white"
                              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          }`}
                        >
                          💡 ক্লু
                        </button>
                        <button
                          onClick={() => handleAskAi(q, 'explain')}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            aiHelp.mode === 'explain'
                              ? "bg-purple-600 text-white"
                              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          }`}
                        >
                          🎯 সমাধান
                        </button>
                      </div>

                      {/* Loading state */}
                      {aiHelp.loading && (
                        <div className="flex flex-col items-center justify-center py-6 text-neutral-500 gap-2">
                          <Loader2 size={24} className="animate-spin text-purple-600" />
                          <span className="text-xs font-bold text-purple-700 animate-pulse">AI বিশ্লেষণ করছে...</span>
                        </div>
                      )}

                      {/* Error State */}
                      {aiHelp.error && (
                        <div className="flex items-center gap-2 py-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 text-xs sm:text-sm">
                          <AlertCircle size={16} />
                          <span className="font-bold">{aiHelp.error}</span>
                        </div>
                      )}

                      {/* Content Section */}
                      {!aiHelp.loading && !aiHelp.error && aiHelp.explanation && (
                        <div className="space-y-4">
                          <div className="prose max-w-none text-xs sm:text-sm">
                            {renderFormattedText(aiHelp.explanation)}
                          </div>

                          {/* Quick utility block */}
                          <div className="flex items-center justify-between border-t border-purple-100/60 pt-3 mt-3">
                            <button
                              onClick={() => speakText(aiHelp.explanation)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors cursor-pointer"
                            >
                              <Volume2 size={13} />
                              <span>শুনুন (Speak Solution)</span>
                            </button>

                            <span className="text-[10px] text-purple-400 font-bold italic">
                              *পরীক্ষার সময়ে সহায়তার জন্য
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Styled Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 py-4 px-4 z-10 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <button 
            onClick={onCancel} 
            className="flex-1 py-3 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs sm:text-sm transition-colors cursor-pointer border-none"
          >
            ❌ Cancel (বাতিল)
          </button>
          
          <button 
            onClick={() => onFinishExam(timeLeft)} 
            className="flex-1 py-3 px-4 rounded-2xl bg-[#00BFA6] hover:bg-[#009688] text-white font-extrabold text-xs sm:text-sm transition-colors cursor-pointer border-none flex items-center justify-center gap-1"
          >
            <span>Finish Exam (শেষ)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
