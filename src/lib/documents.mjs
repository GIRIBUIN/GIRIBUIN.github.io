import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { site } from '../data/site';

// Build-only asset check, shared by the Documents and Profile windows.
export function getDocuments() {
  return [
    { url: site.resumeUrl, key: 'hero.resume', label: 'Resume PDF' },
    { url: site.portfolioPdfUrl, key: 'hero.portfolio', label: 'Portfolio PDF' },
  ].filter(doc => doc.url?.startsWith('/') && !doc.url.includes('..') && existsSync(resolve('public', '.' + doc.url)));
}
