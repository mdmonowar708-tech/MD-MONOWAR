import React from 'react';
import { LiveExam, Question } from '../types';
import TtsButton from './TtsButton';

interface McqPageProps {
  exam: LiveExam;
  questions: Question[];
  savedAnswers: Record<number, { questionId: string; answer: number }>;
  onSelectAnswer: (index: number, answer: number) => void;
  onFinishExam: (timeLeft: number) => void;
  onCancel: () => void;
}

export default function McqPage({ exam, questions, savedAnswers, onSelectAnswer, onFinishExam, onCancel }: McqPageProps) {
  console.log("🔥 McqPage questions:", questions);
  // Simple implementation to restore the app
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{exam.title}</h2>
      {questions.map((q, idx) => (
        <div key={q.id} className="my-4 p-4 border rounded">
          <div className="font-medium">{idx + 1}. {q.question} <div className="inline-block mt-2"><TtsButton text={q.question} /></div></div>
          {[1, 2, 3, 4].map(opt => (
            <div key={opt} className="p-2 my-1 border w-full text-left flex flex-wrap justify-between items-center gap-2">
              <div className="flex-grow cursor-pointer" onClick={() => onSelectAnswer(idx, opt)}>
                  {q[`option${opt}` as keyof Question]}
              </div>
              <div className="ml-2">
                <TtsButton text={q[`option${opt}` as keyof Question]} />
              </div>
            </div>
          ))}
        </div>
      ))}
      <button onClick={() => onFinishExam(0)} className="bg-green-500 text-white p-2 rounded">Finish</button>
      <button onClick={onCancel} className="bg-red-500 text-white p-2 rounded ml-2">Cancel</button>
    </div>
  );
}
