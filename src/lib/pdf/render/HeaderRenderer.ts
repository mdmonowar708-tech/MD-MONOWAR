import { PdfConfig } from '../types';
import { toBengaliNumber } from '../utils';

export class HeaderRenderer {
  public render(title: string, pageNumber: number, config: PdfConfig): HTMLElement {
    const header = document.createElement('div');
    header.className = 'doc-title-element';
    
    // Professional competitive exam guide styles matching index.html
    header.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
      border-bottom: 1.5px solid #1E293B;
      padding-bottom: 4px;
      margin-bottom: 6px;
      box-sizing: border-box;
      width: 100%;
      height: ${config.dimensions.headerHeight}px;
      font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
      user-select: none;
      z-index: 10;
    `;

    // 1. Top row: Logo/Brand & Metadata
    const topRow = document.createElement('div');
    topRow.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    `;

    // Logo & Brand
    const logoBox = document.createElement('div');
    logoBox.style.cssText = `
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    `;

    const logoSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
      </svg>
    `;

    logoBox.innerHTML = `
      <div style="background: #F1F5F9; border: 1.5px solid #1E293B; border-radius: 6px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        ${logoSvg}
      </div>
      <div style="display: flex; flex-direction: column; line-height: 1.1;">
        <span style="font-weight: 900; font-size: 13px; color: #1E293B; letter-spacing: -0.2px; font-family: 'Inter', sans-serif;">MCQ HERO</span>
        <span style="font-size: 6px; color: #64748B; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Inter', sans-serif;">PREPARATION HUB</span>
      </div>
    `;
    topRow.appendChild(logoBox);

    // Resolve Metadata (Total Questions & Date)
    let totalQuestionsCount = 0;
    if (typeof window !== 'undefined' && (window as any).rawQuestionsList) {
      totalQuestionsCount = (window as any).rawQuestionsList.length;
    } else if (typeof document !== 'undefined') {
      const qCards = document.querySelectorAll('.question-card');
      totalQuestionsCount = qCards.length;
    }

    const qCountBn = toBengaliNumber(totalQuestionsCount || 0);
    const dateBn = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });

    const metaBox = document.createElement('div');
    metaBox.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 10px;
      color: #475569;
      font-weight: 600;
      line-height: 1.3;
    `;
    metaBox.innerHTML = `
      <div><strong>মোট প্রশ্ন:</strong> ${qCountBn}টি</div>
      <div><strong>তারিখ:</strong> ${dateBn}</div>
    `;
    topRow.appendChild(metaBox);
    header.appendChild(topRow);

    // 2. Bottom row: Subject & Topic tags
    let categoryName = config.categoryName || title || '';
    let subcategoryName = (config as any).subcategoryName || '';

    // Auto-resolve subject/topic from dropdowns if empty
    if (typeof document !== 'undefined') {
      if (!categoryName) {
        const catSelect = document.getElementById('category-selector') as HTMLSelectElement | null;
        if (catSelect && catSelect.selectedIndex >= 0) {
          categoryName = catSelect.options[catSelect.selectedIndex].text;
        }
      }
      if (!subcategoryName) {
        const subcatSelect = document.getElementById('subcategory-selector') as HTMLSelectElement | null;
        if (subcatSelect && subcatSelect.selectedIndex >= 0) {
          subcategoryName = subcatSelect.options[subcatSelect.selectedIndex].text;
        }
      }
    }

    const bottomRow = document.createElement('div');
    bottomRow.style.cssText = `
      display: flex;
      gap: 8px;
      font-size: 10px;
      width: 100%;
      margin-top: 2px;
    `;
    bottomRow.innerHTML = `
      <div style="background: #F1F5F9; color: #1E293B; padding: 2px 8px; border-radius: 4px; border: 1px solid #CBD5E1; font-weight: 700;">
        <strong>বিষয়:</strong> <span class="header-subject">${categoryName || 'সাধারণ'}</span>
      </div>
      <div style="background: #F1F5F9; color: #1E293B; padding: 2px 8px; border-radius: 4px; border: 1px solid #CBD5E1; font-weight: 700;">
        <strong>টপিক:</strong> <span class="header-topic">${subcategoryName || 'সাধারণ'}</span>
      </div>
    `;
    header.appendChild(bottomRow);

    return header;
  }
}
