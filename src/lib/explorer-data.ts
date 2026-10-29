import { getProjectCardMeta, localizeProject, type Project } from './projects';
import type { ExplorerProject } from '../components/explorer/types';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

// Keep collection paths/original PNGs intact; Astro emits lightweight menu covers at build time.
const covers = import.meta.glob<ImageMetadata>('../../public/images/projects/*/thumbnail.png', { eager: true, import: 'default' });
const optimized = new Map<string, Promise<string>>();
function menuCover(source: string | null) {
  // Public originals are served directly in dev; Windows /@fs image transforms can fail.
  if (import.meta.env.DEV) return Promise.resolve(source);
  const image = source && covers['../../public' + source];
  if (!source || !image) return Promise.resolve(source);
  if (!optimized.has(source)) optimized.set(source, getImage({ src: image, width: 800, format: 'webp', quality: 78 }).then(result => result.src));
  return optimized.get(source)!;
}

export async function projectToExplorer(entry: Project): Promise<ExplorerProject> {
  const { slug, thumbnail, demo, visual, tech, links } = entry.data;
  const isVideo = demo.type === 'video' || (demo.type === 'terminal' && demo.format === 'video');
  const isImage = demo.type === 'image' || (demo.type === 'terminal' && demo.format === 'image');
  return {
    slug,
    image: await menuCover(thumbnail || demo.poster || (!isVideo && isImage ? demo.url : null) || (!isVideo ? visual?.url : null) || null),
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

