import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const url = z.string().refine(value => /^https?:\/\//.test(value) || /^\/(?!\/)/.test(value), 'Use an http(s) URL or a root-relative path');
const nullableUrl = url.nullish().transform(value => value ?? null);
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    oneLine: z.string().optional(),
    summary: z.string(),
    type: z.string().default('project'),
    featured: z.boolean().default(false),
    section: z.enum(['work', 'tools']).default('work'),
    order: z.number().default(100),
    hidden: z.boolean().default(false),
    tech: z.array(z.string()).default([]),
    problem: z.string().optional(),
    decision: z.string().optional(),
    result: z.string().optional(),
    visual: z.object({
      url, alt: z.string().min(1), caption: z.string().optional(),
    }).optional(),
    links: z.object({
      demo: nullableUrl, source: nullableUrl, release: nullableUrl, video: nullableUrl,
    }).default({ demo: null, source: null, release: null, video: null }),
    demo: z.object({
      type: z.enum(['iframe', 'video', 'terminal', 'apk', 'image', 'none']).default('none'),
      url: nullableUrl,
      poster: nullableUrl,
      format: z.enum(['video', 'image']).default('video'),
      alt: z.string().optional(),
      caption: z.string().optional(),
    }).default({ type: 'none', url: null, poster: null, format: 'video' }),
  }).superRefine((data, ctx) => {
    if ((data.demo.type === 'image' || (data.demo.type === 'terminal' && data.demo.format === 'image')) && data.demo.url && !data.demo.alt) {
      ctx.addIssue({ code: 'custom', path: ['demo', 'alt'], message: 'Image demos require alt text' });
    }
  }),
});
export const collections = { projects };
