import React from 'react';
import AiAsk from './AiAsk';
import { PdfEngine } from '../lib/pdfEngine';

export default function AiPage() {
  const downloadNotesAsPdf = () => {
    // Example study notes data, normally this would come from a data source
    const notes = [
        { number: 1, text: "Study Note 1: Important topic A" },
        { number: 2, text: "Study Note 2: Important topic B" }
    ];
    PdfEngine.generate("Study Notes", notes);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
      <button 
        onClick={downloadNotesAsPdf}
        className="bg-green-600 text-white p-4 rounded-lg font-bold cursor-pointer mb-4"
      >
        Download Notes as PDF
      </button>
      <AiAsk />
    </div>
  );
}
