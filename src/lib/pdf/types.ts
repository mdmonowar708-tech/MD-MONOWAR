export interface PageDimensions {
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  headerHeight: number;
  footerHeight: number;
}

export interface PdfEngineConfig {
  dimensions: PageDimensions;
  columnGap: number;
  columnsCount: number;
  fontSize: number;
  lineHeight: number;
  questionSpacing: number;
  optionSpacing: number;
  watermark: WatermarkOptions;
  showCoverPage: boolean;
  compressThreshold: number; // Percentage threshold below which compression triggers
  blankSpaceThreshold: number; // Maximum allowed blank space before trying optimization
  categoryName?: string;
}

export type PdfConfig = PdfEngineConfig;

export interface WatermarkOptions {
  text: string;
  opacity: number;
  rotation: number;
  fontSize: number;
  enabled: boolean;
}

export interface HeaderData {
  title: string;
  subtitle?: string;
  categoryName?: string;
  bookletId?: string;
}

export interface FooterData {
  leftText: string;
  rightTextTemplate: string; // e.g., "Page {page} of {total}"
}

export interface PdfOptions {
  config: PdfEngineConfig;
  header: HeaderData;
  footer: FooterData;
}

export interface QuestionData {
  id: string;
  number?: number;
  text: string;
  options: { text: string; isCorrect?: boolean }[];
  answer?: string;
  explanation?: string;
  splitPart?: 'question-only' | 'options-only';
}

export interface MeasuredQuestion {
  id: string;
  questionHeight: number;
  optionsHeight: number;
  answerHeight: number;
  explanationHeight: number;
  totalHeight: number;
  width: number;
  estimatedLines: number;
  optionLayout: 'one-column' | 'two-column' | 'four-column';
  hasExplanation: boolean;
  hasImage: boolean;
}

export interface QuestionBlock {
  data: QuestionData;
  measurements: MeasuredQuestion;
}

export interface MeasurementResult {
  id: string;
  width: number;
  height: number;
}

export interface VirtualColumn {
  blocks: QuestionBlock[];
  currentHeight: number;
  maxHeight: number;
}

export interface ColumnState {
  columnIndex: number;
  blocks: QuestionBlock[];
  height: number;
}

export interface VirtualPage {
  pageNumber: number;
  columns: VirtualColumn[];
  leftColumn: ColumnLayout;
  rightColumn: ColumnLayout;
  remainingHeightLeft: number;
  remainingHeightRight: number;
  utilizationPercentage: number;
  hasHeader: boolean;
  hasFooter: boolean;
  scaleFactor?: number;
}

export interface PageLayout {
  pageNumber: number;
  leftColumn: ColumnLayout;
  rightColumn: ColumnLayout;
  hasHeader: boolean;
  hasFooter: boolean;
  scaleFactor?: number;
}

export interface ColumnLayout {
  items: QuestionData[];
  totalHeight: number;
}

export interface ExportResult {
  success: boolean;
  filename: string;
  pageCount: number;
  elapsedTimeMs: number;
}

export interface PdfDocument {
  title: string;
  config: PdfEngineConfig;
  pages: PageLayout[];
}
