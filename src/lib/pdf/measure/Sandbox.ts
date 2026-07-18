export class Sandbox {
  private container: HTMLDivElement | null = null;

  public init(width: number): void {
    if (typeof document === 'undefined') return;
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'pdf-measure-sandbox';
      this.container.className = 'pdf-measurement-container';
      this.container.style.cssText = `
        position: fixed;
        visibility: hidden;
        pointer-events: none;
        left: -99999px;
        top: 0;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        background: white;
        z-index: -9999;
      `;
      document.body.appendChild(this.container);
    }
    this.container.style.width = `${width}px`;
  }

  public measureBatch(
    items: {
      id: string;
      element: HTMLElement;
      questionEl: HTMLElement;
      optionsEl: HTMLElement;
      answerEl?: HTMLElement;
      explanationEl?: HTMLElement;
    }[]
  ): Map<string, {
    totalHeight: number;
    questionHeight: number;
    optionsHeight: number;
    answerHeight: number;
    explanationHeight: number;
    width: number;
  }> {
    const results = new Map<string, {
      totalHeight: number;
      questionHeight: number;
      optionsHeight: number;
      answerHeight: number;
      explanationHeight: number;
      width: number;
    }>();

    if (typeof document === 'undefined' || !this.container) {
      // Return safe defaults if DOM is not available or initialized
      items.forEach(item => {
        results.set(item.id, {
          totalHeight: 120,
          questionHeight: 40,
          optionsHeight: 40,
          answerHeight: 20,
          explanationHeight: 20,
          width: 240,
        });
      });
      return results;
    }

    // 1. Write phase: Append all elements to sandbox container in one batch
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
      fragment.appendChild(item.element);
    });
    this.container.appendChild(fragment);

    // 2. Read phase: Retrieve bounding client rects for all elements to avoid layout thrashing
    items.forEach(item => {
      const rect = item.element.getBoundingClientRect();
      const questionRect = item.questionEl.getBoundingClientRect();
      const optionsRect = item.optionsEl.getBoundingClientRect();
      
      let answerHeight = 0;
      if (item.answerEl) {
        answerHeight = item.answerEl.getBoundingClientRect().height;
      }
      
      let explanationHeight = 0;
      if (item.explanationEl) {
        explanationHeight = item.explanationEl.getBoundingClientRect().height;
      }

      results.set(item.id, {
        totalHeight: rect.height,
        questionHeight: questionRect.height,
        optionsHeight: optionsRect.height,
        answerHeight,
        explanationHeight,
        width: rect.width || this.container!.offsetWidth,
      });
    });

    // 3. Cleanup phase: Remove all elements from sandbox in a single batch
    items.forEach(item => {
      if (item.element.parentNode === this.container) {
        this.container?.removeChild(item.element);
      }
    });

    return results;
  }

  public cleanup(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }
}
