import { getCollection, type CollectionEntry } from 'astro:content';
import { localePath, type Locale } from './i18n';
export type Project = CollectionEntry<'projects'>;
export async function getProjects() {
  const projects = await getCollection('projects', ({ data }) => !data.hidden);
  if (new Set(projects.map(project => project.data.slug)).size !== projects.length) throw new Error('Project slugs must be unique');
  return projects.sort((a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity) || a.data.slug.localeCompare(b.data.slug));
}
export function localizeProject(project: Project, locale: Locale): Project {
  const copy = project.data.translations?.[locale];
  if (!copy) return project;
  return { ...project, data: { ...project.data, ...copy,
    visual: project.data.visual ? { ...project.data.visual, ...copy.visual } : undefined,
    demo: { ...project.data.demo, ...copy.demo },
  } };
}
export const projectPath = (slug: string, locale: Locale) => localePath('/projects/' + slug + '/', locale);
export function projectLinks(project: Project, locale: Locale) {
  const { links, demo } = project.data;
  const ko = locale === 'ko';
  const actions = [
    { icon: 'github' as const, label: 'GitHub', url: links.source },
    { icon: 'external' as const, label: ko ? '데모 사이트' : 'Live demo', url: links.liveDemo || links.demo || (demo.type === 'iframe' ? demo.url : null) },
    { icon: 'download' as const, label: ko ? '다운로드 · 릴리스' : 'Download / releases', url: links.release || (demo.type === 'apk' ? demo.url : null) },
    { icon: 'document' as const, label: ko ? '문서' : 'Documentation', url: links.caseStudy },
    { icon: 'youtube' as const, label: ko ? '영상 원본' : 'Watch video', url: links.video },
  ];
  return actions.filter((link): link is (typeof actions)[number] & { url: string } => Boolean(link.url));
}
