import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { localePath, type Locale } from '../../i18n/ui';
import { getExplorerUi } from './copy';
import { cachedDetail, loadDetail } from './detail-content';
import '../../lib/youtube-player';
import '../../styles/youtube-player.css';

export default function ProjectDetailWindow({ slug, locale, footer }: { slug: string; locale: Locale; footer: ReactNode }) {
  const url = localePath('/work/' + slug + '/', locale);
  const [content, setContent] = useState<{ url: string; html: string } | null>(() => {
    const html = cachedDetail(url);
    return html ? { url, html } : null;
  });
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef<{ pane: HTMLElement; top: number } | null>(null);
  const ui = getExplorerUi(locale);
  useEffect(() => {
    let cancelled = false;
    setError(false);
    const load = async () => {
      try {
        const html = await loadDetail(url);
        if (!cancelled) {
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
      } catch { if (!cancelled) setError(true); }
    };
    void load();
    return () => { cancelled = true; };
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
