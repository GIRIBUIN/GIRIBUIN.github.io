import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import type { Locale } from '../../i18n/ui';

const storageKey = 'portfolio.project-split';
const clamp = (value: number, min = 32, max = 68) => Math.min(max, Math.max(min, value));

export default function ProjectSplit({ locale, left, right }: { locale: Locale; left: ReactNode; right: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pointer = useRef<number | null>(null);
  const [preferredRatio, setRatio] = useState(52);
  const [storageReady, setStorageReady] = useState(false);
  const [bounds, setBounds] = useState({ min: 32, max: 68 });
  const [dragging, setDragging] = useState(false);
  const ratio = clamp(preferredRatio, bounds.min, bounds.max);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null && saved.trim() && Number.isFinite(Number(saved))) setRatio(clamp(Number(saved)));
    } catch { /* Storage is optional, including in private/blocked contexts. */ }
    setStorageReady(true);
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width - 1;
      if (width <= 0) return;
      // Keep the description readable on narrower desktop windows. The saved
      // preference remains intact when the viewport temporarily constrains it.
      setBounds({ min: Math.ceil(Math.max(32, Math.min(260 / width * 100, 42))), max: Math.floor(Math.min(68, Math.max(100 - 320 / width * 100, 50))) });
    });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!storageReady || dragging) return;
    try { localStorage.setItem(storageKey, String(preferredRatio)); } catch { /* Resizing still works without storage. */ }
  }, [preferredRatio, storageReady, dragging]);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    setRatio(Math.round(clamp((event.clientX - rect.left) / (rect.width - 1) * 100, bounds.min, bounds.max) * 10) / 10);
  };
  const finish = (event: PointerEvent<HTMLDivElement>) => {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null; setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 5 : 1;
    const next = { ArrowLeft: ratio - step, ArrowRight: ratio + step, Home: bounds.min, End: bounds.max }[event.key];
    if (next === undefined) return;
    event.preventDefault(); setRatio(clamp(next, bounds.min, bounds.max));
  };
  return <div className="project-browser" ref={ref} style={{ '--project-left': `${ratio}fr`, '--project-right': `${100 - ratio}fr` } as CSSProperties} data-resizing={dragging || undefined}>
    {left}
    <div className="project-divider" role="separator" tabIndex={0} aria-orientation="vertical"
      aria-label={locale === 'ko' ? '프로젝트 탐색 영역 너비 조절' : 'Resize project panes'}
      aria-controls="project-explorer-left project-explorer-detail" aria-valuemin={bounds.min} aria-valuemax={bounds.max} aria-valuenow={ratio}
      aria-valuetext={locale === 'ko' ? `왼쪽 ${ratio}%, 오른쪽 ${Math.round((100 - ratio) * 10) / 10}%` : `Left ${ratio}%, right ${Math.round((100 - ratio) * 10) / 10}%`}
      onKeyDown={keyboard}
      onPointerDown={event => { if (event.button !== 0 || pointer.current !== null) return; event.preventDefault(); event.currentTarget.focus(); pointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); move(event); }}
      onPointerMove={event => { if (pointer.current === event.pointerId) move(event); }} onPointerUp={finish} onPointerCancel={finish}
      onLostPointerCapture={() => { pointer.current = null; setDragging(false); }} />
    {right}
  </div>;
}
