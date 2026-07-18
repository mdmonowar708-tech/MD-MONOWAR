export interface DocumentPlugin {
  name: string;
  render(data: any): any[];
  getStyles(): any;
  getHeader?(data: any): any;
  getFooter?(data: any): any;
  getPageSize?(): any;
  getPageOrientation?(): any;
  getWatermark?(data: any): any;
}

export class QuestionBankPlugin implements DocumentPlugin {
  name = 'QuestionBank';
  
  // Assuming a Bengali font is registered in PdfEngine as 'BengaliFont'
  private font = 'BengaliFont';

  render(data: any) {
    const questions = Array.isArray(data) ? data : (data.questions || []);
    const numColumns = data.columns || 2;
    
    const cols = [];
    for (let c = 0; c < numColumns; c++) {
      cols.push({
        stack: questions.filter((_: any, i: number) => i % numColumns === c).map((q: any) => this.renderQuestion(q)),
        width: '*'
      });
    }

    return [{ columns: cols, columnGap: 20 }];
  }

  private renderQuestion(q: any) {
    const stack: any[] = [
        { text: `${q.number}. ${q.text}`, style: 'questionText' }
    ];

    if (q.image) stack.push({ image: q.image, width: 200, margin: [0, 5, 0, 5] });
    // Removed q.table rendering as requested
    if (q.flowchart) stack.push({ image: q.flowchart, width: 300, margin: [0, 5, 0, 5] });
    
    const bengaliLetters = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
    stack.push(...q.options.map((opt: any, index: number) => ({ 
        text: `${bengaliLetters[index] || ''}. ${opt.text || ''}`, 
        style: 'optionText' 
    })));

    const content = {
      stack: stack,
      keepTogether: true, // ATOMIC BLOCK
      margin: [0, 0, 0, 10]
    };

    if (PdfEngine.isDebugMode) {
      const height = MeasurementEngine.estimateHeight(q);
      return {
        table: {
          widths: ['*'],
          body: [[{
            stack: [
              ...content.stack,
              { text: `Height: ${height.toFixed(2)}`, color: 'red', fontSize: 8 }
            ],
            margin: content.margin
          }]]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => 'red',
          vLineColor: () => 'red',
        },
        keepTogether: true,
      };
    }
    return content;
  }
  
  getStyles() {
    return {
      questionText: { fontSize: 12, bold: true, font: this.font },
      optionText: { fontSize: 10, margin: [10, 0, 0, 0], font: this.font }
    };
  }

  getHeader(data: any) {
    return { text: 'MCQ HERO - Question Bank', alignment: 'center', margin: [0, 10] };
  }

  getFooter(data: any) {
    return (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      alignment: 'center'
    });
  }

  getWatermark(data: any) {
    return { text: 'MCQ HERO', opacity: 0.1, bold: true, italics: false };
  }
}
