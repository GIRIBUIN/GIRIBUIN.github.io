import type { Locale } from '../../i18n/ui';

// Build-time projection of Content Collections, never a second content source.
export interface ExplorerProject {
  slug: string;
  image: string | null;
  video: string | null;
  tech: string[];
  links: { demo: string | null; source: string | null; release: string | null; video: string | null; caseStudy: string | null };
  copy: Record<Locale, { title: string; description: string; scope: string; meta: string; result: string | null }>;
}

export type ExplorerState =
  | { screen: 'main' }
  | { screen: 'about' | 'resume' | 'contact' }
  | { screen: 'projects'; view: 'list' }
  | { screen: 'projects'; view: 'preview' | 'detail'; slug: string };
