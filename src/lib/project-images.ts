import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

// Build-time optimization only. Original assets and media URLs remain intact.
const images = import.meta.glob<ImageMetadata>('../../public/images/projects/*/thumbnail.png', { eager: true, import: 'default' });
const optimized = new Map<string, Promise<string>>();
export async function projectImage(source: string | null) {
  if (!source || import.meta.env.DEV) return source;
  const image = images['../../public' + source];
  if (!image) return source;
  if (!optimized.has(source)) optimized.set(source, getImage({ src: image, width: 800, format: 'webp', quality: 78 }).then(result => result.src));
  return optimized.get(source)!;
}
