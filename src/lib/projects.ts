import { getCollection, type CollectionEntry } from 'astro:content';
import { localePath, type Locale } from '../i18n/ui';
export type Project = CollectionEntry<'projects'>;
export async function getProjects() {
  const projects = await getCollection('projects', ({ data }) => !data.hidden);
  const slugs = projects.map(project => project.data.slug);
  if (new Set(slugs).size !== slugs.length) throw new Error('Project slugs must be unique');
  return projects.sort((a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity) || a.data.slug.localeCompare(b.data.slug));
}
export function groupProjects(projects: Project[]) {
  return {
    work: projects.filter(({ data }) => data.section === 'work' && data.featured),
    tools: projects.filter(({ data }) => data.section === 'tools' || !data.featured),
  };
}

// Shared identity, order, links and media stay on the base entry; only copy varies by locale.
export function localizeProject(project: Project, locale: Locale): Project {
  const copy = project.data.translations?.[locale];
  if (!copy) return project;
  return { ...project, data: { ...project.data, ...copy,
    visual: project.data.visual ? { ...project.data.visual, ...copy.visual } : undefined,
    demo: { ...project.data.demo, ...copy.demo },
    trace: project.data.trace || copy.trace ? { ...project.data.trace, ...copy.trace } : undefined,
  } };
}

/** Compact, locale-independent UI labels; legacy projects can still use type. */
export function getProjectCardMeta(project: Project): string {
  const { ownership, category, type } = project.data;
  const owner = ownership?.type === 'personal' ? 'Personal'
    : ownership?.type === 'team' ? 'Team' + (ownership.teamSize ? ' · ' + ownership.teamSize + ' people' : '') : null;
  const labels = [owner, category].filter(Boolean);
  return labels.length ? labels.join(' · ') : type;
}
export function getProjectCardTech(project: Project): string[] {
  return project.data.cardTech || project.data.tech.slice(0, 4);
}
export function getProjectDeepDiveLink(project: Project, locale: Locale) {
  const localPath = '/work/' + project.data.slug + '/';
  const caseStudy = project.data.links.caseStudy;
  return { href: caseStudy || localePath(localPath, locale), localPath: caseStudy ? null : localPath, external: Boolean(caseStudy) };
}
