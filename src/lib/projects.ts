import { getCollection, type CollectionEntry } from 'astro:content';
export type Project = CollectionEntry<'projects'>;
export async function getProjects() {
  const projects = await getCollection('projects', ({ data }) => !data.hidden);
  const slugs = projects.map(project => project.data.slug);
  if (new Set(slugs).size !== slugs.length) throw new Error('Project slugs must be unique');
  return projects.sort((a, b) => a.data.order - b.data.order || a.data.slug.localeCompare(b.data.slug));
}
export function groupProjects(projects: Project[]) {
  return {
    work: projects.filter(({ data }) => data.section === 'work' && data.featured),
    tools: projects.filter(({ data }) => data.section === 'tools' || !data.featured),
  };
}
