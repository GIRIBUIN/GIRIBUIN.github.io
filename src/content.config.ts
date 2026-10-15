import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const url = z.string().refine(value => /^https?:\/\//.test(value) || /^\/(?!\/)/.test(value), 'Use an http(s) URL or a root-relative path');
const nullableUrl = url.nullish().transform(value => value ?? null);
const trace = z.object({
  input: z.string().min(1).max(100).optional(),
  decision: z.string().min(1).max(100).optional(),
  output: z.string().min(1).max(100).optional(),
});
const translatedCopy = z.object({
  title: z.string().min(1).optional(), oneLine: z.string().optional(), summary: z.string().optional(), type: z.string().optional(),
  problem: z.string().optional(), decision: z.string().optional(), result: z.string().optional(),
  visual: z.object({ alt: z.string().optional(), caption: z.string().optional() }).optional(),
  demo: z.object({ alt: z.string().optional(), caption: z.string().optional() }).optional(),
  trace: trace.optional(),
});
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    title: z.string().min(1),
    translations: z.object({ en: translatedCopy.optional(), ko: translatedCopy.optional() }).optional(),
    logo: nullableUrl,
    thumbnail: nullableUrl,
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    oneLine: z.string().optional(),
    summary: z.string(),
    type: z.string().default('project'), // Legacy display label for metadata without ownership/category.
    ownership: z.object({
      type: z.enum(['personal', 'team']),
      teamSize: z.number().int().min(2).nullable().default(null),
    }).nullish(),
    category: z.string().min(1).nullish(),
    cardTech: z.array(z.string().min(1)).min(1).max(5).optional(),
    featured: z.boolean().default(false),
    section: z.enum(['work', 'tools']).default('work'),
    order: z.number().optional(),
    hidden: z.boolean().default(false),
    tech: z.array(z.string()).default([]),
    problem: z.string().optional(),
    decision: z.string().optional(),
    result: z.string().optional(),
    trace: trace.optional(),
    visual: z.object({
      url, alt: z.string().min(1), caption: z.string().optional(),
    }).optional(),
    links: z.object({
      demo: nullableUrl, liveDemo: nullableUrl, source: nullableUrl, caseStudy: nullableUrl, release: nullableUrl, video: nullableUrl,
    }).default({ demo: null, liveDemo: null, source: null, caseStudy: null, release: null, video: null }),
    demo: z.object({
      type: z.enum(['iframe', 'video', 'terminal', 'apk', 'image', 'none']).default('none'),
      url: nullableUrl,
      poster: nullableUrl,
      format: z.enum(['video', 'image']).default('video'),
      alt: z.string().optional(),
      caption: z.string().optional(),
    }).default({ type: 'none', url: null, poster: null, format: 'video' }),
  }).superRefine((data, ctx) => {
    if (data.ownership?.type === 'personal' && data.ownership.teamSize !== null) {
      ctx.addIssue({ code: 'custom', path: ['ownership', 'teamSize'], message: 'Personal projects use a null teamSize' });
    }
    data.cardTech?.forEach((tech, index) => {
      if (!data.tech.includes(tech)) ctx.addIssue({ code: 'custom', path: ['cardTech', index], message: 'Card technologies must also exist in tech' });
    });
    if ((data.demo.type === 'image' || (data.demo.type === 'terminal' && data.demo.format === 'image')) && data.demo.url && !data.demo.alt) {
      ctx.addIssue({ code: 'custom', path: ['demo', 'alt'], message: 'Image demos require alt text' });
    }
  }),
});
const projectNotes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/project-notes', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
});
export const collections = { projects, projectNotes };
