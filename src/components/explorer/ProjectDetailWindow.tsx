import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { localePath, type Locale } from '../../i18n/ui';
import { getExplorerUi } from './copy';

const cache = new Map<string, string>();
export default function ProjectDetailWindow({ slug, locale, footer }: { slug: string; locale: Locale; footer: ReactNode }) {
  const url = localePath('/work/' + slug + '/', locale);
  const [content, setContent] = useState<{ url: string; html: string } | null>(null);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef<{ pane: HTMLElement; top: number } | null>(null);
  const ui = getExplorerUi(locale);
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    const load = async () => {
      try {
        let html = cache.get(url);
        if (!html) {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) throw new Error('Detail response ' + response.status);
          const document = new DOMParser().parseFromString(await response.text(), 'text/html');
          const article = document.querySelector<HTMLElement>('.detail-page');
          if (!article) throw new Error('Missing project content');
          article.removeAttribute('aria-labelledby');
          // Keep the original media and document. The window supplies its own
          // title and shared actions; the standalone page supplies its own information popover.
          article.querySelectorAll(':scope > .detail-intro, :scope > .back-link, :scope > .eyebrow, :scope > h1, :scope > .detail-summary, :scope > .tech, :scope > .project-actions').forEach(node => node.remove());
          article.querySelectorAll('script, template').forEach(node => node.remove());
          html = article.outerHTML;
          cache.set(url, html);
        }
        if (!controller.signal.aborted) {
          const root = ref.current;
          const pane = root?.closest<HTMLElement>('.window-body');
          if (root && pane) {
            // Read at commit time so scrolling while a translation loads is respected.
            pendingScroll.current = { pane, top: pane.scrollTop };
            // A shorter translation must not clamp the reader's scroll position.
            root.style.minHeight = root.getBoundingClientRect().height + 'px';
          }
          setContent({ url, html });
        }
      } catch { if (!controller.signal.aborted) setError(true); }
    };
    void load();
    return () => controller.abort();
  }, [url]);
  useLayoutEffect(() => {
    const position = pendingScroll.current;
    if (position) position.pane.scrollTo({ top: position.top, behavior: 'instant' });
    pendingScroll.current = null;
  }, [content]);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const fallback = (event: Event) => {
      if (!(event.target instanceof HTMLImageElement || event.target instanceof HTMLVideoElement)) return;
      const media = event.target;
      const message = document.createElement('p'); message.className = 'media-error'; message.textContent = ui.noMedia;
      media.replaceWith(message);
    };
    root.addEventListener('error', fallback, true);
    return () => root.removeEventListener('error', fallback, true);
  }, [content, ui.noMedia]);
  return <div className="detail-window-content" aria-busy={!error && content?.url !== url}>
    {error && <p role="alert">{ui.error}</p>}
    {content ? <div className="detail-document" ref={ref} dangerouslySetInnerHTML={{ __html: content.html }} /> : !error && <p role="status">{ui.loading}</p>}
    {footer}
  </div>;
}
