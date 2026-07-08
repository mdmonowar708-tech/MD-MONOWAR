import React from 'react';

interface AiAskProps {
  onNavigate: (id: string) => void;
}

export default function AiAsk({ onNavigate }: AiAskProps) {
  return (
    <button 
      onClick={() => onNavigate('ai-page')}
      className="bg-red-600 text-white p-4 rounded-lg font-bold cursor-pointer"
    >
      AI Assistant
    </button>
  );
}
