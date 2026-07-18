import { QuestionBlock, ColumnLayout, PdfEngineConfig } from '../types';

export class ColumnAllocator {
  /**
   * Allocates a set of question blocks into left and right columns for a single page.
   * Returns the allocated blocks for each column and the list of remaining unallocated blocks.
   */
  public allocate(
    blocks: QuestionBlock[],
    maxColumnHeight: number,
    config: PdfEngineConfig
  ): {
    leftColumnBlocks: QuestionBlock[];
    rightColumnBlocks: QuestionBlock[];
    remainingBlocks: QuestionBlock[];
    isOversizedPage: boolean;
  } {
    const leftColumnBlocks: QuestionBlock[] = [];
    const rightColumnBlocks: QuestionBlock[] = [];
    let currentLeftHeight = 0;
    let currentRightHeight = 0;
    let isOversizedPage = false;

    if (blocks.length === 0) {
      return { leftColumnBlocks, rightColumnBlocks, remainingBlocks: [], isOversizedPage };
    }

    let activeColumn: 'left' | 'right' = 'left';

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const height = block.measurements.totalHeight;

      // 1. Handle Oversized Questions (Question is taller than a single printable column)
      if (height > maxColumnHeight) {
        if (leftColumnBlocks.length > 0 || rightColumnBlocks.length > 0) {
          return {
            leftColumnBlocks,
            rightColumnBlocks,
            remainingBlocks: blocks.slice(i),
            isOversizedPage: false,
          };
        }

        leftColumnBlocks.push(block);
        isOversizedPage = true;
        return {
          leftColumnBlocks,
          rightColumnBlocks,
          remainingBlocks: blocks.slice(i + 1),
          isOversizedPage,
        };
      }

      if (activeColumn === 'left') {
        if (currentLeftHeight + height <= maxColumnHeight) {
          leftColumnBlocks.push(block);
          currentLeftHeight += height;
        } else {
          // It doesn't fit in the left column. Let's see if we can split it.
          const questionHeight = block.measurements.questionHeight;
          const canSplit = !block.data.splitPart && 
                            (maxColumnHeight - currentLeftHeight) >= questionHeight + 5;
          
          if (canSplit) {
            const leftBlock: QuestionBlock = {
              data: {
                ...block.data,
                splitPart: 'question-only'
              },
              measurements: {
                ...block.measurements,
                totalHeight: questionHeight,
                optionsHeight: 0,
                answerHeight: 0,
                explanationHeight: 0
              }
            };

            const rightBlock: QuestionBlock = {
              data: {
                ...block.data,
                splitPart: 'options-only'
              },
              measurements: {
                ...block.measurements,
                totalHeight: block.measurements.totalHeight - questionHeight,
                questionHeight: 0
              }
            };

            // Only perform the split if the rightBlock fits in the right column
            if (currentRightHeight + rightBlock.measurements.totalHeight <= maxColumnHeight) {
              leftColumnBlocks.push(leftBlock);
              currentLeftHeight += questionHeight;

              rightColumnBlocks.push(rightBlock);
              currentRightHeight += rightBlock.measurements.totalHeight;
              
              // We have switched to the right column and filled its start
              activeColumn = 'right';
              continue;
            }
          }

          // If we couldn't split or rightBlock didn't fit, we must move the ENTIRE block to the right column
          activeColumn = 'right';
          
          // Re-evaluate this block in the right column
          if (currentRightHeight + height <= maxColumnHeight) {
            rightColumnBlocks.push(block);
            currentRightHeight += height;
          } else {
            // It doesn't fit in the right column either!
            // Let's see if we can split it between right column and the next page
            const canSplitRight = !block.data.splitPart && 
                                  (maxColumnHeight - currentRightHeight) >= questionHeight + 5;
            
            if (canSplitRight) {
              const leftBlock: QuestionBlock = {
                data: {
                  ...block.data,
                  splitPart: 'question-only'
                },
                measurements: {
                  ...block.measurements,
                  totalHeight: questionHeight,
                  optionsHeight: 0,
                  answerHeight: 0,
                  explanationHeight: 0
                }
              };

              const rightBlock: QuestionBlock = {
                data: {
                  ...block.data,
                  splitPart: 'options-only'
                },
                measurements: {
                  ...block.measurements,
                  totalHeight: block.measurements.totalHeight - questionHeight,
                  questionHeight: 0
                }
              };

              rightColumnBlocks.push(leftBlock);
              currentRightHeight += questionHeight;

              return {
                leftColumnBlocks,
                rightColumnBlocks,
                remainingBlocks: [rightBlock, ...blocks.slice(i + 1)],
                isOversizedPage: false,
              };
            } else {
              // Cannot split. Terminate current page.
              return {
                leftColumnBlocks,
                rightColumnBlocks,
                remainingBlocks: blocks.slice(i),
                isOversizedPage: false,
              };
            }
          }
        }
      } else {
        // activeColumn === 'right'
        if (currentRightHeight + height <= maxColumnHeight) {
          rightColumnBlocks.push(block);
          currentRightHeight += height;
        } else {
          // Doesn't fit in the right column. Let's see if we can split it.
          const questionHeight = block.measurements.questionHeight;
          const canSplitRight = !block.data.splitPart && 
                                (maxColumnHeight - currentRightHeight) >= questionHeight + 5;
          
          if (canSplitRight) {
            const leftBlock: QuestionBlock = {
              data: {
                ...block.data,
                splitPart: 'question-only'
              },
              measurements: {
                ...block.measurements,
                totalHeight: questionHeight,
                optionsHeight: 0,
                answerHeight: 0,
                explanationHeight: 0
              }
            };

            const rightBlock: QuestionBlock = {
              data: {
                ...block.data,
                splitPart: 'options-only'
              },
              measurements: {
                ...block.measurements,
                totalHeight: block.measurements.totalHeight - questionHeight,
                questionHeight: 0
              }
            };

            rightColumnBlocks.push(leftBlock);
            currentRightHeight += questionHeight;

            return {
              leftColumnBlocks,
              rightColumnBlocks,
              remainingBlocks: [rightBlock, ...blocks.slice(i + 1)],
              isOversizedPage: false,
            };
          } else {
            // Cannot split. Terminate current page.
            return {
              leftColumnBlocks,
              rightColumnBlocks,
              remainingBlocks: blocks.slice(i),
              isOversizedPage: false,
            };
          }
        }
      }
    }

    return {
      leftColumnBlocks,
      rightColumnBlocks,
      remainingBlocks: [],
      isOversizedPage,
    };
  }
}
