import { QuestionBlock, PdfEngineConfig } from '../types';

export class PageBalancer {
  /**
   * Balances the heights of the left and right columns on a page.
   * If the height difference is greater than 10mm (~28.35 points),
   * it shifts items between columns while maintaining the reading sequence.
   */
  public balancePage(
    left: QuestionBlock[],
    right: QuestionBlock[],
    maxColumnHeight: number,
    config: PdfEngineConfig
  ): { left: QuestionBlock[]; right: QuestionBlock[] } {
    const leftBlocks = [...left];
    const rightBlocks = [...right];

    // If either column is empty or we have an oversized page, balancing is not applicable
    if (leftBlocks.length === 0 || rightBlocks.length === 0) {
      return { left: leftBlocks, right: rightBlocks };
    }

    // Convert 10mm to points
    const TEN_MM_POINTS = 28.35;

    const getLeftHeight = () => leftBlocks.reduce((sum, b) => sum + b.measurements.totalHeight, 0);
    const getRightHeight = () => rightBlocks.reduce((sum, b) => sum + b.measurements.totalHeight, 0);

    let leftHeight = getLeftHeight();
    let rightHeight = getRightHeight();

    let iterations = 0;
    const maxIterations = 8; // Prevent any potential infinite loop

    while (Math.abs(leftHeight - rightHeight) > TEN_MM_POINTS && iterations < maxIterations) {
      iterations++;

      if (leftHeight > rightHeight) {
        // Shift the last item of the left column to the start of the right column
        if (leftBlocks.length <= 1) break; // Retain at least one item in left column
        
        const lastLeftItem = leftBlocks[leftBlocks.length - 1];
        const itemHeight = lastLeftItem.measurements.totalHeight;

        // Ensure the item fits in the right column
        if (rightHeight + itemHeight <= maxColumnHeight) {
          const prospectiveLeftHeight = leftHeight - itemHeight;
          const prospectiveRightHeight = rightHeight + itemHeight;

          // Only perform the shift if it actually improves balance
          if (Math.abs(prospectiveLeftHeight - prospectiveRightHeight) < Math.abs(leftHeight - rightHeight)) {
            leftBlocks.pop();
            rightBlocks.unshift(lastLeftItem);
            leftHeight = prospectiveLeftHeight;
            rightHeight = prospectiveRightHeight;
            continue;
          }
        }
      } else {
        // Shift the first item of the right column to the end of the left column
        if (rightBlocks.length <= 1) break; // Retain at least one item in right column

        const firstRightItem = rightBlocks[0];
        const itemHeight = firstRightItem.measurements.totalHeight;

        // Ensure the item fits in the left column
        if (leftHeight + itemHeight <= maxColumnHeight) {
          const prospectiveLeftHeight = leftHeight + itemHeight;
          const prospectiveRightHeight = rightHeight - itemHeight;

          // Only perform the shift if it actually improves balance
          if (Math.abs(prospectiveLeftHeight - prospectiveRightHeight) < Math.abs(leftHeight - rightHeight)) {
            rightBlocks.shift();
            leftBlocks.push(firstRightItem);
            leftHeight = prospectiveLeftHeight;
            rightHeight = prospectiveRightHeight;
            continue;
          }
        }
      }
      break;
    }

    return { left: leftBlocks, right: rightBlocks };
  }
}
