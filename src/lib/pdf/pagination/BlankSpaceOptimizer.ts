import { QuestionBlock, PdfEngineConfig } from '../types';

export class BlankSpaceOptimizer {
  /**
   * Optimizes space on a single page by checking if the next block can be squeezed in
   * using a minor scale compression (down to 0.88 of original size).
   */
  public optimizePageSpacing(
    blocks: QuestionBlock[],
    nextBlock: QuestionBlock | undefined,
    maxColumnHeight: number,
    config: PdfEngineConfig
  ): {
    fittedBlocks: QuestionBlock[];
    scaleFactor: number;
    consumedNext: boolean;
  } {
    const capacity = maxColumnHeight * 2;
    const currentHeight = blocks.reduce((sum, b) => sum + b.measurements.totalHeight, 0);

    // If there is no next block, or the current page is already extremely full, don't compress
    if (!nextBlock) {
      return { fittedBlocks: blocks, scaleFactor: 1.0, consumedNext: false };
    }

    const nextHeight = nextBlock.measurements.totalHeight;
    const prospectiveHeight = currentHeight + nextHeight;

    // Calculate required scale factor to fit all blocks including the next block
    const requiredScale = capacity / prospectiveHeight;

    // We allow a compression scale down to 0.88 to ensure text remains highly readable
    if (requiredScale >= 0.88 && requiredScale < 1.0) {
      // Create a copy of the blocks with scaled-down measurements
      const scaledBlocks = [...blocks, nextBlock].map(b => {
        const measurements = { ...b.measurements };
        measurements.totalHeight *= requiredScale;
        measurements.questionHeight *= requiredScale;
        measurements.optionsHeight *= requiredScale;
        measurements.answerHeight *= requiredScale;
        measurements.explanationHeight *= requiredScale;
        return {
          ...b,
          measurements,
        };
      });

      return {
        fittedBlocks: scaledBlocks,
        scaleFactor: requiredScale,
        consumedNext: true,
      };
    }

    // If compression is not possible/beneficial, return current blocks without changes
    return { fittedBlocks: blocks, scaleFactor: 1.0, consumedNext: false };
  }

  /**
   * If a page has low utilization (e.g. less than 85%), this method calculates
   * an expansion scale factor to increase spacing and fill the column elegantly.
   */
  public expandPageSpacing(
    blocks: QuestionBlock[],
    maxColumnHeight: number
  ): {
    scaledBlocks: QuestionBlock[];
    scaleFactor: number;
  } {
    const capacity = maxColumnHeight * 2;
    const totalHeight = blocks.reduce((sum, b) => sum + b.measurements.totalHeight, 0);
    const utilization = totalHeight / capacity;

    // If utilization is low, we can expand spacing up to 1.15 to avoid massive empty areas
    if (utilization > 0.5 && utilization < 0.85) {
      const expansionScale = Math.min(1.15, 0.92 / utilization);
      
      const scaledBlocks = blocks.map(b => {
        const measurements = { ...b.measurements };
        measurements.totalHeight *= expansionScale;
        measurements.questionHeight *= expansionScale;
        measurements.optionsHeight *= expansionScale;
        measurements.answerHeight *= expansionScale;
        measurements.explanationHeight *= expansionScale;
        return {
          ...b,
          measurements,
        };
      });

      return {
        scaledBlocks,
        scaleFactor: expansionScale,
      };
    }

    return { scaledBlocks: blocks, scaleFactor: 1.0 };
  }
}
