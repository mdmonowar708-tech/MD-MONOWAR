import { QuestionData, PdfConfig } from '../types';
import { toBengaliNumber, getVisualLength } from '../utils';

export class QuestionRenderer {
  public render(question: QuestionData, config: PdfConfig): HTMLElement {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.setAttribute('data-question-id', question.id);
    
    // Core styling to avoid splitting across columns/pages
    card.style.cssText = `
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

    // Question Title (support HTML/Math/Images/Bangla/English/Unicode)
    const title = document.createElement('div');
    title.className = 'question-title';
    title.style.cssText = `
      font-weight: 700;
      font-size: 0.95em;
      margin-bottom: 6px;
      color: #1E293B;
      display: block;
      line-height: 1.4;
    `;
    
    const numPrefix = question.number !== undefined ? `${toBengaliNumber(question.number)}. ` : '';
    title.innerHTML = `<span class="q-number" style="font-weight: 800; font-family: 'Inter', 'Noto Sans Bengali', sans-serif; margin-right: 2px;">${numPrefix}</span>${question.text}`;
    
    if (question.splitPart !== 'options-only') {
      card.appendChild(title);
    }

    if (question.splitPart === 'question-only') {
      return card;
    }

    // Dynamic Option Layout (Four-column, Two-column, or One-column grid based on max text length and page columns layout)
    const optionsContainer = document.createElement('div');
    
    const maxOptLength = Math.max(...question.options.map(o => getVisualLength(o.text || '')), 0);
    let columnsStyle = 'display: flex; flex-direction: column; gap: 4px;';
    
    if (config.columnsCount === 2) {
      if (maxOptLength <= 24) {
        columnsStyle = `display: grid; grid-template-columns: repeat(2, 1fr); column-gap: 16px; row-gap: 4px;`;
        optionsContainer.className = 'options-grid options-grid-2';
      } else {
        optionsContainer.className = 'options-grid options-grid-1';
      }
    } else {
      if (maxOptLength <= 24) {
        columnsStyle = `display: grid; grid-template-columns: repeat(4, 1fr); column-gap: 12px; row-gap: 4px;`;
        optionsContainer.className = 'options-grid options-grid-4';
      } else if (maxOptLength <= 45) {
        columnsStyle = `display: grid; grid-template-columns: repeat(2, 1fr); column-gap: 16px; row-gap: 4px;`;
        optionsContainer.className = 'options-grid options-grid-2';
      } else {
        optionsContainer.className = 'options-grid options-grid-1';
      }
    }

    optionsContainer.style.cssText = `
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
      optionsContainer.appendChild(optEl);
    });
    card.appendChild(optionsContainer);

    // Correct Answer (styled professionally)
    if (question.answer) {
      const answerContainer = document.createElement('div');
      answerContainer.className = 'question-answer';
      answerContainer.style.cssText = `
        color: #0284c7;
        text-decoration: underline;
        font-weight: bold;
        font-size: 0.82em;
        display: block;
        margin-top: 4px;
        margin-bottom: 2px;
        font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
      `;
      answerContainer.innerHTML = `<span style="font-weight: 800; font-family: 'Inter', sans-serif; margin-right: 2px;">Ans.</span> ${question.answer}`;
      card.appendChild(answerContainer);
    }

    // Explanation Section (collapsible visual style, high readability)
    if (question.explanation && question.explanation.trim() !== '') {
      const explanationContainer = document.createElement('div');
      explanationContainer.className = 'question-explanation-wrapper';
      explanationContainer.style.cssText = `
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
      explanationContainer.innerHTML = `<strong style="font-weight: 700; font-style: normal; color: #334155; font-family: 'Noto Sans Bengali', sans-serif;">ব্যাখ্যা:</strong> ${question.explanation}`;
      card.appendChild(explanationContainer);
    }

    return card;
  }
}
