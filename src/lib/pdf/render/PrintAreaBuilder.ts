import { PageLayout, PdfConfig } from '../types';
import { HeaderRenderer } from './HeaderRenderer';
import { FooterRenderer } from './FooterRenderer';
import { WatermarkRenderer } from './WatermarkRenderer';
import { QuestionRenderer } from './QuestionRenderer';

export class PrintAreaBuilder {
  private headerRenderer = new HeaderRenderer();
  private footerRenderer = new FooterRenderer();
  private watermarkRenderer = new WatermarkRenderer();
  private questionRenderer = new QuestionRenderer();

  public buildDocument(
    title: string,
    pages: PageLayout[],
    config: PdfConfig
  ): HTMLDivElement {
    const documentWrapper = document.createElement('div');
    documentWrapper.className = 'pdf-document-print-wrapper';
    documentWrapper.style.cssText = `
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      background: transparent;
    `;

    pages.forEach((page, index) => {
      const pageEl = this.buildPage(title, page, pages.length, config);
      documentWrapper.appendChild(pageEl);
    });

    return documentWrapper;
  }

  public buildPage(
    title: string,
    page: PageLayout,
    totalPages: number,
    config: PdfConfig
  ): HTMLDivElement {
    const pageContainer = document.createElement('div');
    pageContainer.className = 'pdf-page-content';
    
    // Explicit sizing for A4 print optimization to prevent clipping and shifting
    const width = config.dimensions?.width ?? 595;
    const height = config.dimensions?.height ?? 842;
    const pTop = config.dimensions?.marginTop ?? 16;
    const pBottom = config.dimensions?.marginBottom ?? 20;
    const pLeft = config.dimensions?.marginLeft ?? 24;
    const pRight = config.dimensions?.marginRight ?? 24;

    pageContainer.style.cssText = `
      background: white;
      padding: ${pTop}px ${pRight}px ${pBottom}px ${pLeft}px;
      border-radius: 0px;
      width: 100%;
      max-width: ${width}px;
      height: ${height}px;
      min-height: ${height}px;
      max-height: ${height}px;
      border: none;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      page-break-after: always;
      break-after: page;
    `;

    // 1. Watermark (behind the text, z-index 1) - statically set to MCQ HERO
    const watermarkConf = {
      ...config,
      watermark: {
        ...config.watermark,
        text: 'MCQ HERO',
        enabled: true
      }
    };
    pageContainer.appendChild(this.watermarkRenderer.render(watermarkConf));

    // 2. Content wrapper containing Header and Body
    const contentWrapper = document.createElement('div');
    contentWrapper.style.cssText = 'position: relative; z-index: 2; display: flex; flex-direction: column; flex: 1; width: 100%;';

    // Header
    if (page.hasHeader) {
      contentWrapper.appendChild(this.headerRenderer.render(title, page.pageNumber, config));
    }

    // Body (Cards Container with strict independent layout boundaries)
    const cardsContainer = document.createElement('div');
    const isSingleColumn = config.columnsCount === 1;

    const headerH = page.hasHeader ? (config.dimensions?.headerHeight ?? 45) : 0;
    const footerH = page.hasFooter ? (config.dimensions?.footerHeight ?? 35) : 0;
    const maxColumnHeight = height - (pTop + pBottom) - headerH - footerH - 20;

    if (isSingleColumn) {
      const scaleFactor = (page as any).scaleFactor ?? 1.0;
      const scaledGap = 6 * scaleFactor;
      const scaledPaddingBottom = 8 * scaleFactor;
      const scaledFontSize = (config.fontSize || 14) * scaleFactor;

      cardsContainer.style.cssText = `display: flex; flex-direction: column; gap: 0; width: 100%; box-sizing: border-box; max-height: ${maxColumnHeight}px; overflow: hidden !important; position: relative;`;
      
      page.leftColumn.items.forEach(q => {
        const card = this.questionRenderer.render(q, config);
        card.style.cssText += `
          margin: 0 !important;
          box-shadow: none !important;
          border-bottom: 1px dashed #CBD5E1 !important;
          padding: 0 0 ${scaledPaddingBottom}px 0 !important;
          background: transparent !important;
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
          font-size: ${scaledFontSize}px !important;
        `;
        cardsContainer.appendChild(card);
      });

      // Append any items in right column if they mistakenly got allocated there in 1-column layout
      if (page.rightColumn && page.rightColumn.items && page.rightColumn.items.length > 0) {
        page.rightColumn.items.forEach(q => {
          const card = this.questionRenderer.render(q, config);
          card.style.cssText += `
            margin: 0 !important;
            box-shadow: none !important;
            border-bottom: 1px dashed #CBD5E1 !important;
            padding: 0 0 ${scaledPaddingBottom}px 0 !important;
            background: transparent !important;
            display: block !important;
            width: 100% !important;
            box-sizing: border-box !important;
            font-size: ${scaledFontSize}px !important;
          `;
          cardsContainer.appendChild(card);
        });
      }

      // Remove border bottom on the last card to maintain guide style
      if (cardsContainer.lastElementChild) {
        const lastCard = cardsContainer.lastElementChild as HTMLElement;
        lastCard.style.setProperty('border-bottom', 'none', 'important');
        lastCard.style.setProperty('padding-bottom', '0', 'important');
        lastCard.style.setProperty('margin-bottom', '0', 'important');
      }

    } else {
      // Two-column layout with strict independent layout boundaries
      const scaleFactor = page.scaleFactor ?? 1.0;
      const gap = config.columnGap ?? 16;
      const scaledGap = 6 * scaleFactor;
      const scaledPaddingBottom = 8 * scaleFactor;
      const scaledFontSize = (config.fontSize || 14) * scaleFactor;

      cardsContainer.style.cssText = `display: flex; justify-content: space-between; width: 100%; box-sizing: border-box; max-height: ${maxColumnHeight}px; overflow: hidden !important; position: relative;`;

      const leftCol = document.createElement('div');
      leftCol.className = 'pdf-column-left';
      leftCol.style.cssText = `display: flex; flex-direction: column; gap: 0; box-sizing: border-box; width: calc(50% - ${gap / 2}px); max-height: ${maxColumnHeight}px; overflow: hidden !important; position: relative;`;

      page.leftColumn.items.forEach(q => {
        const card = this.questionRenderer.render(q, config);
        const isQuestionOnly = q.splitPart === 'question-only';
        card.style.cssText += `
          margin: 0 !important;
          box-shadow: none !important;
          border-bottom: ${isQuestionOnly ? 'none' : '1px dashed #CBD5E1'} !important;
          padding: 0 0 ${isQuestionOnly ? '0' : scaledPaddingBottom + 'px'} 0 !important;
          background: transparent !important;
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
          font-size: ${scaledFontSize}px !important;
        `;
        leftCol.appendChild(card);
      });

      if (leftCol.lastElementChild) {
        const lastLeftCard = leftCol.lastElementChild as HTMLElement;
        lastLeftCard.style.setProperty('border-bottom', 'none', 'important');
        lastLeftCard.style.setProperty('padding-bottom', '0', 'important');
        lastLeftCard.style.setProperty('margin-bottom', '0', 'important');
      }

      const rightCol = document.createElement('div');
      rightCol.className = 'pdf-column-right';
      rightCol.style.cssText = `display: flex; flex-direction: column; gap: 0; box-sizing: border-box; width: calc(50% - ${gap / 2}px); max-height: ${maxColumnHeight}px; overflow: hidden !important; position: relative;`;

      page.rightColumn.items.forEach(q => {
        const card = this.questionRenderer.render(q, config);
        const isQuestionOnly = q.splitPart === 'question-only';
        card.style.cssText += `
          margin: 0 !important;
          box-shadow: none !important;
          border-bottom: ${isQuestionOnly ? 'none' : '1px dashed #CBD5E1'} !important;
          padding: 0 0 ${isQuestionOnly ? '0' : scaledPaddingBottom + 'px'} 0 !important;
          background: transparent !important;
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
          font-size: ${scaledFontSize}px !important;
        `;
        rightCol.appendChild(card);
      });

      if (rightCol.lastElementChild) {
        const lastRightCard = rightCol.lastElementChild as HTMLElement;
        lastRightCard.style.setProperty('border-bottom', 'none', 'important');
        lastRightCard.style.setProperty('padding-bottom', '0', 'important');
        lastRightCard.style.setProperty('margin-bottom', '0', 'important');
      }

      cardsContainer.appendChild(leftCol);
      cardsContainer.appendChild(rightCol);
    }

    contentWrapper.appendChild(cardsContainer);
    pageContainer.appendChild(contentWrapper);

    // 3. Footer (positioned at absolute bottom, page-number-element)
    if (page.hasFooter) {
      pageContainer.appendChild(this.footerRenderer.render(page.pageNumber, totalPages, config));
    }

    // 4. Vertical page indicator on the left side (for UX/UI alignment)
    const verticalPageDiv = document.createElement('div');
    verticalPageDiv.className = 'vertical-page-indicator';
    verticalPageDiv.style.cssText = `
      position: absolute;
      left: 8px;
      bottom: 80px;
      transform: rotate(-90deg);
      transform-origin: left bottom;
      font-size: 9px;
      font-weight: bold;
      color: #64748B;
      font-family: 'Inter', sans-serif;
      z-index: 5;
      user-select: none;
    `;
    verticalPageDiv.innerText = `Page-${page.pageNumber}`;
    pageContainer.appendChild(verticalPageDiv);

    return pageContainer;
  }
}
