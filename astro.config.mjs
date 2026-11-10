import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import rehypeDiagrams from './src/lib/rehype-diagrams.mjs';
import react from '@astrojs/react';

export default defineConfig({
  site: process.env.SITE_URL || 'https://giribuin.github.io',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [react(), {
    name: 'portfolio-localized-pages',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        injectRoute({ pattern: '/ko/about', entrypoint: './src/routes/KoreanAbout.astro', prerender: true });
        injectRoute({ pattern: '/ko/projects/[slug]', entrypoint: './src/routes/KoreanProject.astro', prerender: true });
        injectRoute({ pattern: '/contact', entrypoint: './src/routes/LegacyContact.astro', prerender: true });
        injectRoute({ pattern: '/ko/contact', entrypoint: './src/routes/LegacyContact.astro', prerender: true });
      },
    },
  }],
  markdown: {
    shikiConfig: { theme: 'github-light' },
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid', 'math'] },
    processor: satteri({ hastPlugins: [rehypeDiagrams()] }),
  },
});
