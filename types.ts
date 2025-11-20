export enum VisualType {
  BAR_CHART = 'BAR_CHART',
  PIE_CHART = 'PIE_CHART',
  LINE_CHART = 'LINE_CHART',
  STAT_CARD = 'STAT_CARD',
  PROCESS_FLOW = 'PROCESS_FLOW',
  KEY_POINTS = 'KEY_POINTS'
}

export interface DataPoint {
  label: string;
  value: number | string;
  description?: string;
}

export interface VisualizationCard {
  id: string;
  title: string;
  description: string;
  type: VisualType;
  data: DataPoint[];
  scriptSegment: string;
  visualSymbol?: string; // AI selected icon: 'trend_up', 'users', 'money', etc.
  colorTheme?: string;   // AI selected theme: 'indigo', 'emerald', 'amber', 'rose'
}

export interface AnalysisResult {
  title: string;
  summary: string;
  cards: VisualizationCard[];
}

export interface LoadingState {
  isLoading: boolean;
  step: 'idle' | 'analyzing' | 'generating' | 'complete' | 'error';
  message?: string;
}