import { QuestionData, MeasuredQuestion, VirtualPage, VirtualColumn, ColumnLayout, PdfEngineConfig, QuestionBlock } from '../types';
import { ColumnAllocator } from './ColumnAllocator';
import { BlankSpaceOptimizer } from './BlankSpaceOptimizer';
import { PageBalancer } from './PageBalancer';
import { calculatePrintableHeight } from '../utils';

export class PaginationEngine {
  private allocator: ColumnAllocator;
  private optimizer: BlankSpaceOptimizer;
  private balancer: PageBalancer;

  constructor() {
    this.allocator = new ColumnAllocator();
    this.optimizer = new BlankSpaceOptimizer();
    this.balancer = new PageBalancer();
  }

  /**
   * Paginates measured questions into a series of structured pages.
   */
  public paginate(
    questions: QuestionData[],
    measurements: MeasuredQuestion[],
    config: PdfEngineConfig
  ): VirtualPage[] {
    // A separate, highly precise pagination pass for Single Column Layout
    if (config.columnsCount === 1) {
      const pages: VirtualPage[] = [];
      const measurementMap = new Map<string, MeasuredQuestion>(
        measurements.map(m => [m.id, m])
      );

      // 1. Build cohesive QuestionBlock items with measured heights
      const blocks: QuestionBlock[] = questions.map(q => {
        const m = measurementMap.get(q.id) || this.createFallbackMeasurement(q, config);
        return { data: q, measurements: m };
      });

      let remainingBlocks = [...blocks];
      let pageNum = 1;

      // Helper to calculate the actual rendered height of a list of blocks in pixels/points
      const calculateActualRenderedHeight = (blocksList: QuestionBlock[]): number => {
        if (blocksList.length === 0) return 0;
        const qSpacing = config.questionSpacing || 8;
        let total = 0;
        blocksList.forEach((b, idx) => {
          const innerHeight = b.measurements.totalHeight - qSpacing;
          const renderedCardHeight = innerHeight + 9; // 8px padding-bottom + 1px border-bottom
          total += renderedCardHeight;
          if (idx > 0) {
            total += 6; // 6px flex gap
          }
        });
        return total;
      };

      while (remainingBlocks.length > 0) {
        const hasHeader = pageNum > 1 || !config.showCoverPage;
        const hasFooter = true;
        const headerH = hasHeader ? (config.dimensions?.headerHeight ?? 110) : 0;
        const footerH = hasFooter ? (config.dimensions?.footerHeight ?? 45) : 0;
        const marginH = (config.dimensions?.marginTop ?? 16) + (config.dimensions?.marginBottom ?? 20);
        const usablePageHeight = config.dimensions.height - marginH - headerH - footerH - 20;

        const leftColumnBlocks: QuestionBlock[] = [];

        // 1. Greedy placement + Check if next block can be squeezed
        while (remainingBlocks.length > 0) {
          const nextBlock = remainingBlocks[0];
          const currentHeight = calculateActualRenderedHeight(leftColumnBlocks);
          const remainingPrintableHeight = usablePageHeight - currentHeight;

          // Calculate height the next block would take
          const nextBlockRenderedHeight = leftColumnBlocks.length === 0 
            ? (nextBlock.measurements.totalHeight - (config.questionSpacing || 8)) + 9
            : (nextBlock.measurements.totalHeight - (config.questionSpacing || 8)) + 9 + 6;

          if (leftColumnBlocks.length === 0) {
            leftColumnBlocks.push(remainingBlocks.shift()!);
            continue;
          }

          if (nextBlockRenderedHeight <= remainingPrintableHeight) {
            leftColumnBlocks.push(remainingBlocks.shift()!);
          } else {
            // Squeeze next block on this page using minor scale compression (down to 0.88)
            const prospectiveHeight = currentHeight + nextBlockRenderedHeight;
            const requiredScale = usablePageHeight / prospectiveHeight;

            if (requiredScale >= 0.88 && requiredScale < 1.0) {
              leftColumnBlocks.push(remainingBlocks.shift()!);
            }
            break;
          }
        }

        // 2. Adjust scaleFactor to optimize page utilization to exactly 93% (target 90% to 96%)
        const currentHeight = calculateActualRenderedHeight(leftColumnBlocks);
        const baselineUtilization = currentHeight / usablePageHeight;
        
        let scaleFactor = 1.0;
        if (baselineUtilization > 0) {
          const targetScale = 0.93 / baselineUtilization;
          // Clamp scaleFactor to highly readable limits (0.88 to 1.15)
          scaleFactor = Math.max(0.88, Math.min(1.15, targetScale));
        }

        const finalHeight = currentHeight * scaleFactor;
        const utilizationPercentage = (finalHeight / usablePageHeight) * 100;

        // Propagate scaling to individual measurements
        leftColumnBlocks.forEach(b => {
          b.measurements.totalHeight *= scaleFactor;
          b.measurements.questionHeight *= scaleFactor;
          b.measurements.optionsHeight *= scaleFactor;
          b.measurements.answerHeight *= scaleFactor;
          b.measurements.explanationHeight *= scaleFactor;
        });

        const leftColumnLayout: ColumnLayout = {
          items: leftColumnBlocks.map(b => b.data),
          totalHeight: finalHeight,
        };

        const rightColumnLayout: ColumnLayout = {
          items: [],
          totalHeight: 0,
        };

        const leftCol: VirtualColumn = {
          blocks: leftColumnBlocks,
          currentHeight: finalHeight,
          maxHeight: usablePageHeight,
        };

        const rightCol: VirtualColumn = {
          blocks: [],
          currentHeight: 0,
          maxHeight: usablePageHeight,
        };

        const remainingHeightLeft = usablePageHeight - finalHeight;
        const remainingHeightRight = usablePageHeight;

        const page: VirtualPage = {
          pageNumber: pageNum,
          columns: [leftCol, rightCol],
          leftColumn: leftColumnLayout,
          rightColumn: rightColumnLayout,
          remainingHeightLeft,
          remainingHeightRight,
          utilizationPercentage,
          hasHeader,
          hasFooter: true,
          scaleFactor,
        };

        pages.push(page);
        pageNum++;
      }

      return pages;
    }

    const pages: VirtualPage[] = [];
    const measurementMap = new Map<string, MeasuredQuestion>(
      measurements.map(m => [m.id, m])
    );

    // 1. Build cohesive QuestionBlock items
    const blocks: QuestionBlock[] = questions.map(q => {
      const m = measurementMap.get(q.id) || this.createFallbackMeasurement(q, config);
      return { data: q, measurements: m };
    });

    let remainingBlocks = [...blocks];
    let pageNum = 1;
    const maxColumnHeight = calculatePrintableHeight(config.dimensions);

    // 2. Main pagination loop
    while (remainingBlocks.length > 0) {
      // Allocate greedily for this page first
      const allocation = this.allocator.allocate(remainingBlocks, maxColumnHeight, config);
      
      let left = allocation.leftColumnBlocks;
      let right = allocation.rightColumnBlocks;
      let nextRemaining = allocation.remainingBlocks;
      let scaleFactor = 1.0;

      // 3. Construct virtual page output
      const leftColHeight = left.reduce((sum, b) => sum + b.measurements.totalHeight, 0);
      const rightColHeight = right.reduce((sum, b) => sum + b.measurements.totalHeight, 0);

      const leftColumnLayout: ColumnLayout = {
        items: left.map(b => b.data),
        totalHeight: leftColHeight,
      };

      const rightColumnLayout: ColumnLayout = {
        items: right.map(b => b.data),
        totalHeight: rightColHeight,
      };

      const leftCol: VirtualColumn = {
        blocks: left,
        currentHeight: leftColHeight,
        maxHeight: maxColumnHeight,
      };

      const rightCol: VirtualColumn = {
        blocks: right,
        currentHeight: rightColHeight,
        maxHeight: maxColumnHeight,
      };

      const remainingHeightLeft = maxColumnHeight - leftColHeight;
      const remainingHeightRight = maxColumnHeight - rightColHeight;
      const utilizationPercentage = ((leftColHeight + rightColHeight) / (2 * maxColumnHeight)) * 100;

      const page: VirtualPage = {
        pageNumber: pageNum,
        columns: [leftCol, rightCol],
        leftColumn: leftColumnLayout,
        rightColumn: rightColumnLayout,
        remainingHeightLeft,
        remainingHeightRight,
        utilizationPercentage,
        hasHeader: pageNum > 1 || !config.showCoverPage,
        hasFooter: true,
        scaleFactor,
      };

      pages.push(page);

      // Infinite loop guard: Ensure we always make progress
      if (left.length === 0 && right.length === 0) {
        const item = remainingBlocks.shift();
        if (item) {
          left.push(item);
        }
      } else {
        remainingBlocks = nextRemaining;
      }

      pageNum++;
    }

    return pages;
  }

  /**
   * Safe fallback measurements to prevent layout engine crashes if measurement is missing.
   */
  private createFallbackMeasurement(question: QuestionData, config: PdfEngineConfig): MeasuredQuestion {
    const fontSize = config.fontSize;
    const lineHeight = fontSize * config.lineHeight;

    let maxOptionLen = 0;
    question.options.forEach(opt => {
      if (opt.text.length > maxOptionLen) {
        maxOptionLen = opt.text.length;
      }
    });

    let optionLayout: 'one-column' | 'two-column' | 'four-column' = 'one-column';
    if (config.columnsCount === 2) {
      if (maxOptionLen <= 24) {
        optionLayout = 'two-column';
      }
    } else {
      if (maxOptionLen <= 24) {
        optionLayout = 'four-column';
      } else if (maxOptionLen <= 45) {
        optionLayout = 'two-column';
      }
    }

    const questionHeight = Math.max(24, Math.ceil(question.text.length / 40) * lineHeight);
    
    let optionsHeight = 0;
    if (optionLayout === 'four-column') {
      optionsHeight = lineHeight + config.optionSpacing;
    } else if (optionLayout === 'two-column') {
      optionsHeight = (lineHeight * 2) + (config.optionSpacing * 2);
    } else {
      optionsHeight = (lineHeight * question.options.length) + (config.optionSpacing * question.options.length);
    }

    const answerHeight = question.answer ? lineHeight + 4 : 0;
    const explanationHeight = question.explanation ? Math.ceil(question.explanation.length / 40) * (lineHeight - 2) + 4 : 0;

    const totalHeight = questionHeight + optionsHeight + answerHeight + explanationHeight + config.questionSpacing;

    return {
      id: question.id,
      questionHeight,
      optionsHeight,
      answerHeight,
      explanationHeight,
      totalHeight,
      width: 240,
      estimatedLines: Math.ceil(question.text.length / 40) + question.options.length,
      optionLayout,
      hasExplanation: !!question.explanation,
      hasImage: false,
    };
  }
}
