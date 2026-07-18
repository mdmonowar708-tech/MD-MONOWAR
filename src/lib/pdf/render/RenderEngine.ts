import { VirtualPage, PdfConfig } from '../types';
import { PrintAreaBuilder } from './PrintAreaBuilder';

export class RenderEngine {
  private printAreaBuilder = new PrintAreaBuilder();

  /**
   * Converts a series of VirtualPage objects into a structured DOM representation.
   * The returned HTMLDivElement matches exactly what is expected by the print/export engines,
   * avoiding any layout shifts, duplicate node generation, or flash of unstyled content.
   */
  public render(title: string, pages: VirtualPage[], config: PdfConfig): HTMLDivElement {
    return this.printAreaBuilder.buildDocument(title, pages, config);
  }

  /**
   * Renders a single page for lazy loading and streaming preview.
   */
  public renderPage(title: string, page: VirtualPage, totalPages: number, config: PdfConfig): HTMLDivElement {
    return this.printAreaBuilder.buildPage(title, page, totalPages, config);
  }
}
