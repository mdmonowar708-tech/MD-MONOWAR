import { QuestionData, MeasuredQuestion, PdfEngineConfig, QuestionBlock } from '../types';
import { Sandbox } from './Sandbox';
import { MeasurementCache } from './MeasurementCache';
import { calculateColumnWidth, ptToPx, measureText, estimateBaseHeight, toBengaliNumber, getVisualLength } from '../utils';

export class MeasureEngine {
  private sandbox: Sandbox;
  private cache: MeasurementCache;

  constructor() {
    this.sandbox = new Sandbox();
    this.cache = new MeasurementCache();
  }

  /**
   * Measures a batch of questions, leveraging the sandbox and avoiding layout thrashing.
   */
  public async measureQuestions(
    questions: QuestionData[],
    config: PdfEngineConfig
  ): Promise<MeasuredQuestion[]> {
    const results: MeasuredQuestion[] = [];
    const columnWidth = calculateColumnWidth(config.dimensions, config.columnsCount, config.columnGap);
    const columnWidthPx = ptToPx(columnWidth);

    // Ensure sandbox is initialized
    this.sandbox.init(columnWidthPx);

    const pendingToMeasure: {
      id: string;
      data: QuestionData;
      element: HTMLElement;
      questionEl: HTMLElement;
      optionsEl: HTMLElement;
      answerEl?: HTMLElement;
      explanationEl?: HTMLElement;
      optionLayout: 'one-column' | 'two-column' | 'four-column';
      estimatedLines: number;
      hasExplanation: boolean;
      hasImage: boolean;
    }[] = [];

    questions.forEach(q => {
      // 1. Check cache first (do NOT reuse two-column cache or any cached value in single-column layout)
      if (config.columnsCount !== 1) {
        const cached = this.cache.get(q.id, config.fontSize, columnWidth);
        if (cached) {
          results.push(cached);
          return;
        }
      }

      // 2. Build DOM element for questions that need measurement
      try {
        const rendered = this.createMeasurementDOM(q, config, columnWidth);
        pendingToMeasure.push({
          id: q.id,
          data: q,
          ...rendered,
        });
      } catch (err) {
        // Fallback if rendering DOM fails
        const fallback = this.createFallbackMeasurement(q, config, columnWidth);
        results.push(fallback);
      }
    });

    if (pendingToMeasure.length > 0) {
      // 3. Batch measure via Sandbox
      const measurements = this.sandbox.measureBatch(pendingToMeasure);

      pendingToMeasure.forEach(item => {
        const measured = measurements.get(item.id);
        
        let result: MeasuredQuestion;

        if (measured && measured.totalHeight > 0) {
          // If measurement is successful, use the measured values (converted back to points)
          const ptFactor = 1 / ptToPx(1); // Converts pixels back to points
          
          result = {
            id: item.id,
            questionHeight: measured.questionHeight * ptFactor,
            optionsHeight: measured.optionsHeight * ptFactor,
            answerHeight: measured.answerHeight * ptFactor,
            explanationHeight: measured.explanationHeight * ptFactor,
            totalHeight: (measured.totalHeight * ptFactor) + config.questionSpacing,
            width: measured.width * ptFactor,
            estimatedLines: item.estimatedLines,
            optionLayout: item.optionLayout,
            hasExplanation: item.hasExplanation,
            hasImage: item.hasImage,
          };
        } else {
          // Use fallback estimation if browser returned 0 heights or layout is hidden
          result = this.createFallbackMeasurement(item.data, config, columnWidth);
        }

        // Cache the result for future reference (only when not in single-column mode)
        if (config.columnsCount !== 1) {
          this.cache.set(item.id, config.fontSize, columnWidth, result);
        }
        results.push(result);
      });
    }

    return results;
  }

  /**
   * Measures a single question block synchronously (or returns cached).
   */
  public measureSingleQuestion(
    question: QuestionData,
    config: PdfEngineConfig
  ): MeasuredQuestion {
    const columnWidth = calculateColumnWidth(config.dimensions, config.columnsCount, config.columnGap);
    if (config.columnsCount !== 1) {
      const cached = this.cache.get(question.id, config.fontSize, columnWidth);
      if (cached) return cached;
    }

    const columnWidthPx = ptToPx(columnWidth);
    this.sandbox.init(columnWidthPx);

    try {
      const rendered = this.createMeasurementDOM(question, config, columnWidth);
      const measurements = this.sandbox.measureBatch([{
        id: question.id,
        element: rendered.element,
        questionEl: rendered.questionEl,
        optionsEl: rendered.optionsEl,
        answerEl: rendered.answerEl,
        explanationEl: rendered.explanationEl,
      }]);

      const measured = measurements.get(question.id);
      let result: MeasuredQuestion;

      if (measured && measured.totalHeight > 0) {
        const ptFactor = 1 / ptToPx(1);
        result = {
          id: question.id,
          questionHeight: measured.questionHeight * ptFactor,
          optionsHeight: measured.optionsHeight * ptFactor,
          answerHeight: measured.answerHeight * ptFactor,
          explanationHeight: measured.explanationHeight * ptFactor,
          totalHeight: (measured.totalHeight * ptFactor) + config.questionSpacing,
          width: measured.width * ptFactor,
          estimatedLines: rendered.estimatedLines,
          optionLayout: rendered.optionLayout,
          hasExplanation: rendered.hasExplanation,
          hasImage: rendered.hasImage,
        };
      } else {
        result = this.createFallbackMeasurement(question, config, columnWidth);
      }

      if (config.columnsCount !== 1) {
        this.cache.set(question.id, config.fontSize, columnWidth, result);
      }
      return result;
    } catch (e) {
      const fallback = this.createFallbackMeasurement(question, config, columnWidth);
      if (config.columnsCount !== 1) {
        this.cache.set(question.id, config.fontSize, columnWidth, fallback);
      }
      return fallback;
    }
  }

  /**
   * Helper to create DOM layout representing the exact styles for measurement.
   */
  private createMeasurementDOM(
    question: QuestionData,
    config: PdfEngineConfig,
    columnWidth: number
  ): {
    element: HTMLElement;
    questionEl: HTMLElement;
    optionsEl: HTMLElement;
    answerEl?: HTMLElement;
    explanationEl?: HTMLElement;
    optionLayout: 'one-column' | 'two-column' | 'four-column';
    estimatedLines: number;
    hasExplanation: boolean;
    hasImage: boolean;
  } {
    const element = document.createElement('div');
    element.className = 'question-card';
    element.setAttribute('data-question-id', question.id);
    
    // Core styling to match QuestionRenderer.ts exactly
    element.style.cssText = `
      background: white;
      border-radius: 0;
      padding: 0;
      margin-bottom: ${config.questionSpacing || 8}px;
      border: none;
      width: 100%;
      box-sizing: border-box;
      display: block;
      break-inside: avoid;
      page-break-inside: avoid;
      font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
      font-size: ${config.fontSize || 14}px;
      line-height: ${config.lineHeight || 1.45};
    `;

    // 1. Detect Images
    const hasImage = question.text.includes('<img') || question.text.includes('![') || question.text.includes('src=');

    // 2. Create Question Title Element
    const questionEl = document.createElement('div');
    questionEl.className = 'question-title';
    questionEl.style.cssText = `
      font-weight: 700;
      font-size: 0.95em;
      margin-bottom: 6px;
      color: #1E293B;
      display: block;
      line-height: 1.4;
    `;
    const numPrefix = question.number !== undefined ? `${toBengaliNumber(question.number)}. ` : '';
    questionEl.innerHTML = `<span class="q-number" style="font-weight: 800; font-family: 'Inter', 'Noto Sans Bengali', sans-serif; margin-right: 2px;">${numPrefix}</span>${question.text}`;
    
    // Ensure all images within title have a fixed container size so they do not collapse before loading
    const images = questionEl.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      img.style.maxHeight = '140px';
      img.style.maxWidth = '100%';
      img.style.display = 'block';
      img.style.marginTop = '8px';
      img.style.marginBottom = '8px';
    }
    element.appendChild(questionEl);

    // 3. Create Options Element (using the exact layout classification matching QuestionRenderer.ts)
    const optionsEl = document.createElement('div');
    
    const maxOptLength = Math.max(...question.options.map(o => getVisualLength(o.text || '')), 0);
    let columnsStyle = 'display: flex; flex-direction: column; gap: 4px;';
    let optionLayout: 'one-column' | 'two-column' | 'four-column' = 'one-column';
    
    if (config.columnsCount === 2) {
      if (maxOptLength <= 24) {
        columnsStyle = `display: grid; grid-template-columns: repeat(2, 1fr); column-gap: 16px; row-gap: 4px;`;
        optionLayout = 'two-column';
        optionsEl.className = 'options-grid options-grid-2';
      } else {
        optionLayout = 'one-column';
        optionsEl.className = 'options-grid options-grid-1';
      }
    } else {
      if (maxOptLength <= 24) {
        columnsStyle = `display: grid; grid-template-columns: repeat(4, 1fr); column-gap: 12px; row-gap: 4px;`;
        optionLayout = 'four-column';
        optionsEl.className = 'options-grid options-grid-4';
      } else if (maxOptLength <= 45) {
        columnsStyle = `display: grid; grid-template-columns: repeat(2, 1fr); column-gap: 16px; row-gap: 4px;`;
        optionLayout = 'two-column';
        optionsEl.className = 'options-grid options-grid-2';
      } else {
        optionLayout = 'one-column';
        optionsEl.className = 'options-grid options-grid-1';
      }
    }

    optionsEl.style.cssText = `
      ${columnsStyle}
      font-weight: 500;
      color: #334155;
      font-size: 0.85em;
      margin-bottom: ${config.optionSpacing || 4}px;
      box-sizing: border-box;
      width: 100%;
    `;

    const optionPrefixes = ['a)', 'b)', 'c)', 'd)'];
    question.options.forEach((opt, idx) => {
      const optEl = document.createElement('div');
      optEl.className = `option-item option-${idx + 1}`;
      optEl.style.cssText = `
        min-width: 0;
        flex-shrink: 0;
        box-sizing: border-box;
        word-wrap: break-word;
        white-space: normal;
      `;
      const prefix = optionPrefixes[idx] || `${idx + 1}.`;
      optEl.innerHTML = `<span style="font-weight: 700; color: #475569; margin-right: 4px; font-family: 'Inter', sans-serif;">${prefix}</span>${opt.text || ''}`;
      optionsEl.appendChild(optEl);
    });
    element.appendChild(optionsEl);

    // 4. Create Answer Element
    let answerEl: HTMLElement | undefined;
    if (question.answer) {
      answerEl = document.createElement('div');
      answerEl.className = 'question-answer';
      answerEl.style.cssText = `
        color: #0284c7;
        text-decoration: underline;
        font-weight: bold;
        font-size: 0.82em;
        display: block;
        margin-top: 4px;
        margin-bottom: 2px;
        font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
      `;
      answerEl.innerHTML = `<span style="font-weight: 800; font-family: 'Inter', sans-serif; margin-right: 2px;">Ans.</span> ${question.answer}`;
      element.appendChild(answerEl);
    }

    // 5. Create Explanation Element
    let explanationEl: HTMLElement | undefined;
    const hasExplanation = !!question.explanation;
    if (question.explanation && question.explanation.trim() !== '') {
      explanationEl = document.createElement('div');
      explanationEl.className = 'question-explanation-wrapper';
      explanationEl.style.cssText = `
        margin-top: 6px;
        font-size: 0.78em;
        color: #475569;
        font-style: italic;
        display: block;
        line-height: 1.45;
        font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
        border-left: 2px solid #E2E8F0;
        padding-left: 8px;
        box-sizing: border-box;
      `;
      explanationEl.innerHTML = `<strong style="font-weight: 700; font-style: normal; color: #334155; font-family: 'Noto Sans Bengali', sans-serif;">ব্যাখ্যা:</strong> ${question.explanation}`;
      element.appendChild(explanationEl);
    }

    // 6. Estimate Lines
    const estimatedLines = Math.ceil(question.text.length / 45) + 
      question.options.reduce((acc, opt) => acc + Math.ceil(opt.text.length / 45), 0) + 
      (question.explanation ? Math.ceil(question.explanation.length / 45) : 0);

    return {
      element,
      questionEl,
      optionsEl,
      answerEl,
      explanationEl,
      optionLayout,
      estimatedLines,
      hasExplanation,
      hasImage,
    };
  }

  /**
   * Robust fallback calculation used in non-browser environments or when dimensions measure 0.
   */
  private createFallbackMeasurement(
    question: QuestionData,
    config: PdfEngineConfig,
    columnWidth: number
  ): MeasuredQuestion {
    const fontSize = config.fontSize;
    const lineHeight = fontSize * config.lineHeight;

    // Base text width checks
    let maxOptionLen = 0;
    question.options.forEach(opt => {
      if (opt.text.length > maxOptionLen) {
        maxOptionLen = opt.text.length;
      }
    });

    let optionLayout: 'one-column' | 'two-column' | 'four-column' = 'one-column';
    if (maxOptionLen < 8) {
      optionLayout = 'four-column';
    } else if (maxOptionLen < 18) {
      optionLayout = 'two-column';
    }

    const questionHeight = estimateBaseHeight(question.text.length, fontSize);
    
    let optionsHeight = 0;
    if (optionLayout === 'four-column') {
      optionsHeight = lineHeight + config.optionSpacing;
    } else if (optionLayout === 'two-column') {
      optionsHeight = (lineHeight * 2) + (config.optionSpacing * 2);
    } else {
      optionsHeight = (lineHeight * question.options.length) + (config.optionSpacing * question.options.length);
    }

    const answerHeight = question.answer ? lineHeight + 4 : 0;
    const explanationHeight = question.explanation ? estimateBaseHeight(question.explanation.length, fontSize - 1) + 4 : 0;
    const hasImage = question.text.includes('<img') || question.text.includes('![') || question.text.includes('src=');
    const imageOffsetHeight = hasImage ? 120 : 0;

    const totalHeight = questionHeight + optionsHeight + answerHeight + explanationHeight + imageOffsetHeight + config.questionSpacing;

    const estimatedLines = Math.ceil(question.text.length / 40) + 
      question.options.reduce((acc, opt) => acc + Math.ceil(opt.text.length / 40), 0) + 
      (question.explanation ? Math.ceil(question.explanation.length / 40) : 0);

    return {
      id: question.id,
      questionHeight,
      optionsHeight,
      answerHeight,
      explanationHeight,
      totalHeight,
      width: columnWidth,
      estimatedLines,
      optionLayout,
      hasExplanation: !!question.explanation,
      hasImage,
    };
  }

  public cleanup(): void {
    this.sandbox.cleanup();
    this.cache.clear();
  }
}
