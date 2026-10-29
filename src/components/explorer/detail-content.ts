// One request per selected document, shared by intent prefetch and the Details window.
const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();
export const cachedDetail = (url: string) => cache.get(url);

export function loadDetail(url: string, background = false): Promise<string> {
  const html = cache.get(url);
  if (html) return Promise.resolve(html);
  const existing = pending.get(url);
  if (existing) return existing;
  const request = fetch(url, { priority: background ? 'low' : 'auto' }).then(async response => {
    if (!response.ok) throw new Error('Detail response ' + response.status);
    const document = new DOMParser().parseFromString(await response.text(), 'text/html');
    const article = document.querySelector<HTMLElement>('.detail-page');
    if (!article) throw new Error('Missing project content');
    article.removeAttribute('aria-labelledby');
    article.querySelectorAll(':scope > .detail-intro, :scope > .back-link, :scope > .eyebrow, :scope > h1, :scope > .detail-summary, :scope > .tech, :scope > .project-actions, script, template').forEach(node => node.remove());
    const html = article.outerHTML;
    cache.set(url, html);
    return html;
  }).finally(() => pending.delete(url));
  pending.set(url, request);
  return request;
}

export function allowPrefetch() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !document.hidden && !connection?.saveData && !connection?.effectiveType?.includes('2g');
}

// Native document prefetch can also be reused by a regular browser navigation.
export function prefetchDocument(url: string) {
  if (!allowPrefetch() || [...document.querySelectorAll<HTMLLinkElement>('link[rel="prefetch"]')].some(link => link.getAttribute('href') === url)) return;
  const link = document.createElement('link');
  link.rel = 'prefetch'; link.as = 'document'; link.href = url;
  document.head.append(link);
}
