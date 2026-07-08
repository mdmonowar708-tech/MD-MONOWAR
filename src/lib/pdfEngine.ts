import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import html2pdf from 'html2pdf.js';

// Initialize fonts
(pdfMake as any).vfs = pdfFonts.pdfMake?.vfs || pdfFonts.vfs || (pdfFonts as any).vfs;

// --- Types ---

export interface DocumentBlock {
  type: string;
  data: any;
}

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

// --- Internal Modules ---

class FontManager {
  static fonts: any = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    }
  };

  static registerFont(name: string, files: any) {
    this.fonts[name] = files;
  }
}

export class MeasurementEngine {
  static estimateHeight(block: any): number {
    // Heuristic: Based on estimated characters * line height
    return 20 + (block.text?.length || 0) * 0.5;
  }
}

export class PaginationEngine {
  static paginate(blocks: any[], pageHeight: number): any[] {
    let currentHeight = 0;
    return blocks.map(block => {
      const h = MeasurementEngine.estimateHeight(block);
      if (currentHeight + h > pageHeight) {
        currentHeight = h;
        return { ...block, pageBreak: 'before' };
      }
      currentHeight += h;
      return block;
    });
  }
}

export class ValidationEngine {
  static validate(docDefinition: any) {
    if (!docDefinition.content) throw new Error("No content");
    return true; 
  }
}

export class PdfEngine {
  private static plugins: Map<string, DocumentPlugin> = new Map();
  static isDebugMode: boolean = false;

  static setDebugMode(enabled: boolean) {
    this.isDebugMode = enabled;
  }

  static registerPlugin(plugin: DocumentPlugin) {
    this.plugins.set(plugin.name, plugin);
  }

  static registerFont(name: string, files: any) {
    FontManager.registerFont(name, files);
    (pdfMake as any).fonts = { ...FontManager.fonts, BengaliFont: FontManager.fonts.Roboto };
  }

  static async generateFromElement(element: HTMLElement, opt: any) {
    return html2pdf().from(element).set(opt).save();
  }

  static async generate(title: string, content: any, pluginName?: string) {
    let docDefinition: any;

    if (pluginName && this.plugins.has(pluginName)) {
      const plugin = this.plugins.get(pluginName)!;
      docDefinition = {
        pageOrientation: plugin.getPageOrientation?.() || 'portrait',
        pageSize: plugin.getPageSize?.() || 'LETTER',
        header: plugin.getHeader?.(content),
        footer: plugin.getFooter?.(content),
        watermark: plugin.getWatermark?.(content),
        background: (currentPage: number, pageSize: any) => ({
          canvas: [
            {
              type: 'rect',
              x: 10,
              y: 10,
              w: pageSize.width - 20,
              h: pageSize.height - 20,
              lineColor: 'blue',
              lineWidth: 2
            }
          ]
        }),
        content: [
          { text: title, style: 'header' },
          ...plugin.render(content)
        ],
        styles: {
          header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
          ...plugin.getStyles()
        }
      };
    } else {
      // Backward compatibility logic with enhanced options
      const blocks = Array.isArray(content) ? content : (typeof content === 'string' ? content.split('\n').map((line, i) => ({
        number: i + 1,
        text: line,
        options: [],
        type: 'note'
      })) : []);
      
      const columns = (content as any).columns || 1;
      const colGap = (content as any).columnGap || 10;

      const renderBlock = (b: any) => {
          const stack = [{ text: `${b.number || ''}. ${b.text}`, style: 'questionText' }];
          if (b.options && b.options.length > 0) {
              const bengaliLetters = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
              b.options.forEach((opt: any, index: number) => {
                  stack.push({ text: `${bengaliLetters[index] || ''}. ${opt.text || ''}`, style: 'optionText' });
              });
          }
          return { stack, margin: [0, 0, 0, 5] };
      };

      if (columns > 1) {
          const cols = [];
          for (let c = 0; c < columns; c++) {
            cols.push({
              stack: blocks.filter((_: any, i: number) => i % columns === c).map((b: any) => renderBlock(b)),
              width: '*'
            });
          }
          docDefinition = {
              content: [
                { text: title, style: 'header' },
                { columns: cols, columnGap: colGap }
              ],
              styles: {
                header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                questionText: { fontSize: 12, margin: [0, 5, 0, 5], font: 'BengaliFont' },
                optionText: { fontSize: 10, margin: [10, 0, 0, 0], font: 'BengaliFont' }
              }
            };
      } else {
          docDefinition = {
            content: [
              { text: title, style: 'header' },
              ...blocks.map((b: any) => renderBlock(b))
            ],
            styles: {
              header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
              questionText: { fontSize: 12, margin: [0, 5, 0, 5], font: 'BengaliFont' },
              optionText: { fontSize: 10, margin: [10, 0, 0, 0], font: 'BengaliFont' }
            }
          };
      }
    }

    // 3. Validation
    ValidationEngine.validate(docDefinition);

    // 4. Render
    pdfMake.createPdf(docDefinition, undefined, FontManager.fonts).download(`${title}.pdf`);
  }
}
