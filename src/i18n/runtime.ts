import { getUi, type Locale } from './ui';
import { site } from '../data/site';
import { buildPrinciples } from '../data/buildPrinciples';
export type ProjectCopy = Record<string, { oneLine: string; summary: string; meta: string; trace?: { input?: string; decision?: string; output?: string } }>;
export function getLanguageCopy(locale: Locale, projects: ProjectCopy = {}) {
  return {
    ...getUi(locale), projects,
    profile: { name: site.name[locale], intro: site.intro[locale], bio: site.bio[locale], focus: site.focus[locale],
      approach: site.approach[locale], aim: site.aim[locale], educationStatus: site.educationStatus[locale], educationProgram: site.educationProgram[locale],
      heroAlt: site.heroAlt[locale], profileAlt: site.profileAlt[locale] },
    principles: Object.fromEntries(buildPrinciples.map(p => [p.id, {
      title: p.title, shortDescription: p.shortDescription[locale], why: p.why[locale], how: p.how[locale],
      evidence: Object.fromEntries(p.evidence.map(e => [e.id, { description: e.description[locale] }])),
    }])),
  };
}
export function getCopyText(copy: ReturnType<typeof getLanguageCopy>, key: string): string {
  const value = key.split('.').reduce<unknown>((node, part) =>
    node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined, copy);
  return typeof value === 'string' ? value : '';
}
