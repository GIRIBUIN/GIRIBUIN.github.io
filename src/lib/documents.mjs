import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { site } from '../data/site';

// Expose only documents that actually exist in the public assets.
export function getDocuments() {
  return [
    { url: site.resumeUrl, label: 'Resume PDF' },
    { url: site.portfolioPdfUrl, label: 'Portfolio PDF' },
  ].filter(doc => doc.url?.startsWith('/') && !doc.url.includes('..') && existsSync(resolve('public', '.' + doc.url)));
}
