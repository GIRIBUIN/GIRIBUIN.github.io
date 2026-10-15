import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import rehypeDiagrams from './src/lib/rehype-diagrams.mjs';

export default defineConfig({
  site: process.env.SITE_URL || 'https://giribuin.github.io',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: { theme: 'github-light' },
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid', 'math'] },
    processor: satteri({ hastPlugins: [rehypeDiagrams()] }),
  },
});
