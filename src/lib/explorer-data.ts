import { getProjectCardMeta, localizeProject, type Project } from './projects';
import type { ExplorerProject } from '../components/explorer/types';

export function projectToExplorer(entry: Project): ExplorerProject {
  const { slug, thumbnail, demo, visual, tech, links } = entry.data;
  const isVideo = demo.type === 'video' || (demo.type === 'terminal' && demo.format === 'video');
  const isImage = demo.type === 'image' || (demo.type === 'terminal' && demo.format === 'image');
  return {
    slug,
    image: thumbnail || demo.poster || (!isVideo && isImage ? demo.url : null) || (!isVideo ? visual?.url : null) || null,
    video: isVideo ? demo.url : null,
    tech,
    links: { demo: links.liveDemo || links.demo || (demo.type === 'iframe' ? demo.url : null), source: links.source, release: links.release || (demo.type === 'apk' ? demo.url : null), video: links.video, caseStudy: links.caseStudy },
    copy: Object.fromEntries((['en', 'ko'] as const).map(locale => {
      const project = localizeProject(entry, locale);
      return [locale, { title: project.data.title, description: project.data.oneLine || project.data.summary,
        scope: project.data.summary, meta: getProjectCardMeta(project), result: project.data.result || null }];
    })) as ExplorerProject['copy'],
  };
}

