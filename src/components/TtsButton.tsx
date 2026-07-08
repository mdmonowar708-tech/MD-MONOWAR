import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface TtsButtonProps {
  text: string;
}

export default function TtsButton({ text }: TtsButtonProps) {
  const [volume, setVolume] = useState(1);

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.speechSynthesis) {
      alert("আপনার ব্রাউজারে টেক্সট-টু-স্পিচ সাপোর্ট নেই।");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD'; // Set to Bengali
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center gap-2 inline-flex bg-blue-100 p-2 rounded-lg border border-blue-300 shadow-md">
      <button onClick={speak} className="p-3 text-blue-800 hover:text-blue-950 transition-colors flex items-center gap-2">
        <Volume2 size={28} />
        <span className="text-sm font-bold">TTS (শুনুন)</span>
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => { e.stopPropagation(); setVolume(parseFloat(e.target.value)); }}
        className="w-24 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        title="Volume"
      />
    </div>
  );
}
