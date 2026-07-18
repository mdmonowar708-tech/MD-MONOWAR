import { PageDimensions } from './types';
import { MM_TO_PX, PT_TO_PX } from './constants';

export function mmToPx(mm: number): number {
  return mm * MM_TO_PX;
}

export function pxToMm(px: number): number {
  return px / MM_TO_PX;
}

export function pxToPt(px: number): number {
  return px / PT_TO_PX;
}

export function ptToPx(pt: number): number {
  return pt * PT_TO_PX;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function round(value: number, precision: number = 2): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

export function calculateColumnWidth(
  dimensions: PageDimensions,
  columnsCount: number,
  gap: number
): number {
  const totalMargin = dimensions.marginLeft + dimensions.marginRight;
  const totalWidth = dimensions.width - totalMargin;
  const totalGapsWidth = (columnsCount - 1) * gap;
  return (totalWidth - totalGapsWidth) / columnsCount;
}

export function calculatePrintableHeight(dimensions: PageDimensions): number {
  const totalVerticalMargins = dimensions.marginTop + dimensions.marginBottom;
  const totalStructuralHeights = dimensions.headerHeight + dimensions.footerHeight;
  return dimensions.height - totalVerticalMargins - totalStructuralHeights - 20;
}

export function isOverflow(height: number, maxHeight: number): boolean {
  return height > maxHeight;
}

export function measureText(
  text: string,
  fontSize: number,
  fontFamily: string = 'sans-serif'
): { width: number; height: number } {
  if (typeof document === 'undefined') {
    return { width: text.length * fontSize * 0.6, height: fontSize * 1.25 };
  }
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return { width: text.length * fontSize * 0.6, height: fontSize * 1.25 };
  }
  context.font = `${fontSize}px ${fontFamily}`;
  const metrics = context.measureText(text);
  // Estimate height using standard font line-height ratio
  const height = fontSize * 1.25;
  return { width: metrics.width, height };
}

export function splitArray<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  for (const item of arr) {
    if (predicate(item)) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  }
  return [pass, fail];
}

export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number
): (...args: Args) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Args) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function throttle<Args extends unknown[]>(
  func: (...args: Args) => void,
  limit: number
): (...args: Args) => void {
  let inThrottle = false;
  return (...args: Args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export function toBengaliNumber(num: number | string): string {
  const bString = num.toString();
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  let result = '';
  for (let i = 0; i < bString.length; i++) {
    const char = bString[i];
    const parsed = parseInt(char, 10);
    if (!isNaN(parsed) && bengaliDigits[parsed] !== undefined) {
      result += bengaliDigits[parsed];
    } else {
      result += char;
    }
  }
  return result;
}

export function estimateBaseHeight(textLength: number, fontSize: number = 10): number {
  const charactersPerLine = 40;
  const linesCount = Math.max(1, Math.ceil(textLength / charactersPerLine));
  const lineHeight = fontSize * 1.4;
  return linesCount * lineHeight;
}

export function getVisualLength(text: string): number {
  if (!text) return 0;
  
  // Remove markdown styling markers (e.g., **, *, `, etc.)
  let s = text.replace(/[\*\_\`\~]/g, "");
  
  // Remove standard HTML tags
  s = s.replace(/<\/?[^>]+(>|$)/g, "");
  
  // Clean LaTeX operatornames, mathrms, texts, mathbfe, etc., keeping just their content
  s = s.replace(/\\(operatorname|mathrm|text|math[a-z]+|sym[a-z]+|vec|hat|tilde)\s*\{([^}]+)\}/g, "$2");
  
  // Clean standard LaTeX trig/math commands to their literal words
  s = s.replace(/\\(tan|sin|cos|sec|cosec|csc|cot|ln|log|lg|exp|lim|max|min)\b/g, "$1");
  
  // Simplify common Greek symbols/variables to single letters for representative length
  s = s.replace(/\\(theta|alpha|beta|gamma|delta|pi|phi|omega|lambda|sigma|mu|nu|theta|Theta|Alpha|Beta|Gamma|Delta|Pi|Phi|Omega|Lambda|Sigma|Mu|Nu)\b/g, "x");
  
  // Strip any other generic LaTeX commands (starting with backslash)
  s = s.replace(/\\[a-zA-Z]+/g, "");
  
  // Strip braces, math symbols ($), subscripts (_), superscripts (^)
  s = s.replace(/[\{\}\$\_\^]/g, "");
  
  // Replace multiple white spaces with a single space and trim
  return s.trim().replace(/\s+/g, " ").length;
}

