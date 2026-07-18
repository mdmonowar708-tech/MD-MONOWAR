import React from 'react';
import AiAsk from './AiAsk';
import { MeasureEngine } from '../lib/pdf/measure/MeasureEngine';
import { PaginationEngine } from '../lib/pdf/pagination/PaginationEngine';
import { PrintAreaBuilder } from '../lib/pdf/render/PrintAreaBuilder';
import { PdfExporter } from '../lib/pdf/export/PdfExporter';

export default function AiPage() {
  const downloadNotesAsPdf = async () => {
    // Example study notes data, normally this would come from a data source
    const notes = [
        { number: 1, text: "Study Note 1: Important topic A" },
        { number: 2, text: "Study Note 2: Important topic B" }
    ];

    console.log("[PDF] Starting PDF generation");
    console.log(`[PDF] Questions loaded: ${notes.length}`);

    // Standard modular engine configuration
    const config = {
      dimensions: {
        width: 595,
        height: 842,
        marginTop: 16,
        marginBottom: 20,
        marginLeft: 24,
        marginRight: 24,
        headerHeight: 110,
        footerHeight: 45
      },
      columnGap: 16,
      columnsCount: 1, // Study notes usually look better in 1 column
      fontSize: 14,
      lineHeight: 1.45,
      questionSpacing: 12,
      optionSpacing: 4,
      watermark: {
        text: 'MCQ HERO',
        opacity: 0.1,
        rotation: -45,
        fontSize: 40,
        enabled: true
      },
      showCoverPage: false,
      compressThreshold: 0.05,
      blankSpaceThreshold: 0.1,
    };

    // Format notes for the PDF engine
    const pdfQuestions = notes.map(note => ({
      id: `note-${note.number}`,
      number: note.number,
      text: note.text,
      options: []
    }));

    const measureEngine = new MeasureEngine();
    const measurements = await measureEngine.measureQuestions(pdfQuestions, config);
    console.log("[PDF] MeasureEngine completed");

    const paginationEngine = new PaginationEngine();
    const virtualPages = paginationEngine.paginate(pdfQuestions, measurements, config);
    console.log("[PDF] PaginationEngine completed");
    console.log(`[PDF] Pages created: ${virtualPages.length}`);

    const printAreaBuilder = new PrintAreaBuilder();
    const documentWrapper = printAreaBuilder.buildDocument("Study Notes", virtualPages, config);
    console.log("[PDF] Render completed");

    const pdfExporter = new PdfExporter();
    await pdfExporter.exportToPdf(documentWrapper, "Study Notes");
    console.log("[PDF] Export completed");
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

