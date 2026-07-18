import { PdfConfig } from '../types';

export class WatermarkRenderer {
  public render(config: PdfConfig): HTMLElement {
    const watermark = document.createElement('div');
    watermark.className = 'pdf-watermark';
    
    // Strict control over opacity to meet user requirement: 0.04–0.06
    let opacity = 0.05;
    if (config.watermark && typeof config.watermark.opacity === 'number') {
      opacity = Math.min(0.06, Math.max(0.04, config.watermark.opacity));
    }
    
    const text = config.watermark?.text || 'MCQ HERO';
    const rotation = config.watermark?.rotation ?? -30;
    const fontSize = config.watermark?.fontSize ?? 42;

    watermark.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(${rotation}deg);
      font-size: ${fontSize}px;
      color: rgba(30, 41, 59, ${opacity});
      pointer-events: none;
      white-space: nowrap;
      user-select: none;
      font-weight: 900;
      font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
      z-index: 1;
      letter-spacing: 3px;
    `;
    watermark.innerText = text;
    return watermark;
  }
}
