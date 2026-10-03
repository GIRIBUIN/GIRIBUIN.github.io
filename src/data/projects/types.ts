export interface ProjectMedia {
  hero?: string;
  heroAlt?: string;
  heroCaption?: string;
  architecture?: string;
  architectureAlt?: string;
  architectureCaption?: string;
  youtubeId?: string;
}

export interface TechnicalDecision {
  title: string;
  description: string;
}

export interface Project {
  order: number;
  slug: string;
  title: string;
  subtitle: string;
  oneLine: string;
  period: string;
  status: string;
  type: string;
  teamSize: number;
  role: string;
  stack: string[];
  repository: string;
  demo?: string;
  overview: string[];
  contributions: string[];
  implementation: string[];
  technicalDecisions: TechnicalDecision[];
  limitations: string[];
  media?: ProjectMedia;
}
