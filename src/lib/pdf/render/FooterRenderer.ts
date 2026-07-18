import { PdfConfig } from '../types';
import { toBengaliNumber } from '../utils';

export class FooterRenderer {
  public render(pageNumber: number, totalPages: number, config: PdfConfig): HTMLElement {
    const footer = document.createElement('div');
    footer.className = 'page-number-element';
    
    // Professional styling matching index.html
    footer.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: ${config.dimensions.marginLeft}px;
      right: ${config.dimensions.marginRight}px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1.5px solid #1E293B;
      padding-top: 6px;
      box-sizing: border-box;
      font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
      font-size: 10px;
      font-weight: 600;
      color: #475569;
      height: ${config.dimensions.footerHeight}px;
      user-select: none;
      z-index: 10;
    `;

    const footerLeft = document.createElement('div');
    footerLeft.style.cssText = 'color: #475569; font-weight: 700;';
    footerLeft.innerText = 'MCQ HERO';

    const footerCenter = document.createElement('div');
    footerCenter.className = 'footer-page-num';
    footerCenter.style.cssText = `color: #1E293B; font-weight: 700; font-family: 'Noto Sans Bengali', sans-serif;`;
    
    const pageNumBn = toBengaliNumber(pageNumber);
    const totalPagesBn = toBengaliNumber(totalPages);
    footerCenter.innerText = `পৃষ্ঠা ${pageNumBn} / ${totalPagesBn}`;

    const footerRight = document.createElement('div');
    footerRight.style.cssText = 'color: #475569; font-weight: 700;';
    footerRight.innerText = 'www.mcqhero.com';

    footer.appendChild(footerLeft);
    footer.appendChild(footerCenter);
    footer.appendChild(footerRight);

    return footer;
  }
}
