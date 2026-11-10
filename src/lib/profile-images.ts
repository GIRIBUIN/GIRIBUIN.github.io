import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
const images = import.meta.glob<ImageMetadata>('../../public/images/profile/*.{jpg,png}', { eager: true, import: 'default' });
export async function profileAsset(source: string, width: number) {
  const image = images['../../public' + source];
  if (!image || import.meta.env.DEV) return source;
  return (await getImage({ src: image, width, format: 'webp', quality: 80 })).src;
}
