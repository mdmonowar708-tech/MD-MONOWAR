import { PdfEngineConfig, PageDimensions } from './types';

// A4 Dimensions at 72 points/inch (Standard PDF Point system)
export const A4_WIDTH_POINTS = 595.28;
export const A4_HEIGHT_POINTS = 841.89;

// A4 Dimensions in Pixels (at 96 DPI for web rendering and accurate pixel height calculations)
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

// MM to Points conversion factor
export const MM_TO_PT = 2.83464567;
// MM to Pixels conversion factor (at 96 DPI, 1 inch = 25.4 mm, 96 / 25.4 = 3.7795)
export const MM_TO_PX = 3.77952756;
// Points to Pixels conversion factor (1:1 mapping for pixel-perfect PDF rendering)
export const PT_TO_PX = 1.0;

// Margins (in points)
export const DEFAULT_MARGIN_TOP = 40;
export const DEFAULT_MARGIN_BOTTOM = 40;
export const DEFAULT_MARGIN_LEFT = 30;
export const DEFAULT_MARGIN_RIGHT = 30;

// Component Heights (in points)
export const DEFAULT_HEADER_HEIGHT = 45;
export const DEFAULT_FOOTER_HEIGHT = 35;

// Layout Configurations
export const DEFAULT_COLUMN_GAP = 18;
export const DEFAULT_COLUMNS_COUNT = 2;

// Font Settings (in points)
export const DEFAULT_FONT_SIZE_BODY = 10;
export const DEFAULT_FONT_SIZE_TITLE = 11;
export const DEFAULT_FONT_SIZE_HEADER = 9;
export const DEFAULT_FONT_SIZE_FOOTER = 8.5;
export const DEFAULT_LINE_HEIGHT_RATIO = 1.4;

// Spacing (in points)
export const DEFAULT_QUESTION_SPACING = 12;
export const DEFAULT_OPTION_SPACING = 6;

// Limits & Thresholds
export const MAX_PRINTABLE_HEIGHT = A4_HEIGHT_POINTS - (DEFAULT_MARGIN_TOP + DEFAULT_MARGIN_BOTTOM + DEFAULT_HEADER_HEIGHT + DEFAULT_FOOTER_HEIGHT);
export const COMPRESSION_THRESHOLD = 0.85; // Trigger fine-tuning scaling below 85% utilization
export const BLANK_SPACE_THRESHOLD = 50; // Points of blank space allowed before starting balancing or compression
export const MIN_SCALING_LIMIT = 0.8; // Maximum reduction scale to avoid unreadable text (80%)
export const MAX_SCALING_LIMIT = 1.2; // Maximum expansion scale for generous pages (120%)

export const DEFAULT_PAGE_DIMENSIONS: PageDimensions = {
  width: A4_WIDTH_POINTS,
  height: A4_HEIGHT_POINTS,
  marginTop: DEFAULT_MARGIN_TOP,
  marginBottom: DEFAULT_MARGIN_BOTTOM,
  marginLeft: DEFAULT_MARGIN_LEFT,
  marginRight: DEFAULT_MARGIN_RIGHT,
  headerHeight: DEFAULT_HEADER_HEIGHT,
  footerHeight: DEFAULT_FOOTER_HEIGHT,
};

export const DEFAULT_PDF_CONFIG: PdfEngineConfig = {
  dimensions: DEFAULT_PAGE_DIMENSIONS,
  columnGap: DEFAULT_COLUMN_GAP,
  columnsCount: DEFAULT_COLUMNS_COUNT,
  fontSize: DEFAULT_FONT_SIZE_BODY,
  lineHeight: DEFAULT_LINE_HEIGHT_RATIO,
  questionSpacing: DEFAULT_QUESTION_SPACING,
  optionSpacing: DEFAULT_OPTION_SPACING,
  watermark: {
    text: 'MCQ HERO',
    opacity: 0.04,
    rotation: -45,
    fontSize: 48,
    enabled: true,
  },
  showCoverPage: true,
  compressThreshold: COMPRESSION_THRESHOLD,
  blankSpaceThreshold: BLANK_SPACE_THRESHOLD,
};
