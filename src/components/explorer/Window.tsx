import { useEffect, useRef, type ReactNode } from 'react';
import type { Locale } from '../../i18n/ui';

interface Props {
  open: boolean; title: string; route: string; locale: Locale; focusTarget?: string;
  onBack: () => void; onHome: () => void; children: ReactNode;
  preserveDocumentScroll?: boolean;
}
export default function Window({ open, title, route, locale, focusTarget, onBack, onHome, children, preserveDocumentScroll = false }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const documentPosition = useRef({ x: 0, y: 0 });
  const backdropPress = useRef<{ x: number; y: number; dismiss: boolean } | null>(null);
  const actions = useRef({ onBack, onHome });
  actions.current = { onBack, onHome };
  useEffect(() => {
    const dialog = ref.current!;
    const background = document.querySelectorAll<HTMLElement>(preserveDocumentScroll
      ? '.detail-toolbar .detail-hud-links, .detail-toolbar .project-hud-title, .detail-standalone main > .detail-page'
      : '.title-screen-copy, .title-menu');
    if (open && !dialog.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      documentPosition.current = { x: scrollX, y: scrollY };
      dialog.show();
      window.scrollTo({ left: preserveDocumentScroll ? documentPosition.current.x : 0, top: preserveDocumentScroll ? documentPosition.current.y : 0, behavior: 'instant' });
      document.documentElement.classList.add('explorer-open');
      background.forEach(el => el.inert = true);
      document.dispatchEvent(new Event('portfolio:dialog-open'));
    } else if (!open && dialog.open) {
      dialog.close();
      document.documentElement.classList.remove('explorer-open');
      background.forEach(el => el.inert = false);
      const target = opener.current?.isConnected && opener.current.matches('a[href],button,[tabindex]') ? opener.current : document.querySelector<HTMLElement>(preserveDocumentScroll ? '[data-project-explorer-trigger]' : '.menu-choice');
      target?.focus({ preventScroll: true });
      if (preserveDocumentScroll) window.scrollTo({ left: documentPosition.current.x, top: documentPosition.current.y, behavior: 'instant' });
      if (ref.current) ref.current.scrollTop = 0;
    }
  }, [open, preserveDocumentScroll]);
  useEffect(() => {
    if (!open) return;
    ref.current?.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(dialog => dialog.close());
    const frame = requestAnimationFrame(() => {
      const target = (focusTarget && ref.current?.querySelector<HTMLElement>(focusTarget)) || ref.current?.querySelector<HTMLElement>('[data-preview-heading]') || heading.current;
      target?.focus({ preventScroll: true });
      if (ref.current) ref.current.scrollTop = 0;
      const pane = target?.closest('.explorer-pane');
      const body = pane && getComputedStyle(pane).overflowY === 'auto' ? pane : ref.current?.querySelector('.window-body');
      if (body && focusTarget && target) {
        const item = target.getBoundingClientRect(), viewport = body.getBoundingClientRect();
        if (item.top < viewport.top || item.bottom > viewport.bottom) body.scrollTop += item.top - viewport.top - 12;
      } else body?.scrollTo({ top: 0 });
    });
    return () => cancelAnimationFrame(frame);
  }, [route, open, focusTarget]);
  useEffect(() => {
    if (!open) return;
    const keydown = (event: KeyboardEvent) => {
      // A nested native explanation dialog owns its own keyboard handling.
      if ([...document.querySelectorAll('dialog[open]')].some(dialog => dialog !== ref.current)) return;
      // Settings owns Escape/Tab while its modeless popover is open.
      if (document.querySelector('[data-settings-panel]:popover-open')) return;
      if (event.key === 'Escape') { event.preventDefault(); actions.current.onBack(); return; }
      if (event.key !== 'Tab') return;
      const controls = [
        ...document.querySelectorAll<HTMLElement>('.header a[href], .header button:not([disabled]), .settings-hud button:not([disabled])'),
        ...ref.current!.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]'),
      ].filter(el => el.getClientRects().length && !el.closest('[hidden]'));
      const first = controls[0], last = controls.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const home = (event: Event) => {
      const click = event as MouseEvent;
      if (click.button || click.metaKey || click.ctrlKey || click.shiftKey || click.altKey) return;
      event.preventDefault(); actions.current.onHome();
    };
    const brand = document.querySelector('.header .header-brand');
    document.addEventListener('keydown', keydown);
    brand?.addEventListener('click', home);
    return () => { document.removeEventListener('keydown', keydown); brand?.removeEventListener('click', home); };
  }, [open]);
  const view = route.endsWith('/details') ? 'detail' : route.includes('/') ? 'preview' : 'list';
  const previousLabel = locale === 'ko'
    ? view === 'detail' ? '프로젝트 미리보기로 돌아가기' : '프로젝트 목록으로 돌아가기'
    : view === 'detail' ? 'Back to project preview' : 'Back to project collection';
  return <>
    {open && <div className="window-backdrop" aria-hidden="true"
      onPointerDown={event => { backdropPress.current = { x: event.clientX, y: event.clientY, dismiss: event.button === 0 && !document.querySelector('[data-settings-panel]:popover-open') }; }}
      onPointerCancel={() => { backdropPress.current = null; }}
      onClick={event => {
        const press = backdropPress.current; backdropPress.current = null;
        // Close only a click that started on the backdrop. A Settings dismissal
        // or a drag ending outside the window must not close the parent too.
        if (press?.dismiss && event.target === event.currentTarget && Math.hypot(event.clientX - press.x, event.clientY - press.y) < 8) onHome();
      }} />}
    <dialog id="project-explorer-window" ref={ref} className="explorer-window" data-screen={route.split('/')[0].slice(1)} data-view={view} aria-labelledby="explorer-title">
    <header className="window-bar" key={route}>
      {view !== 'list' && <button type="button" className="game-control window-previous" onClick={onBack} aria-label={previousLabel}>←</button>}
      <h2 id="explorer-title" ref={heading} tabIndex={-1}>{title}</h2>
      <button type="button" className="game-control window-close" onClick={onHome} aria-label={locale === 'ko' ? '창 닫기' : 'Close window'}>×</button>
    </header>
    <div className="window-body">{children}</div>
    </dialog>
  </>;
}
