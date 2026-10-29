import { useEffect, useRef, useState } from 'react';

interface Props { image: string | null; video: string | null; active: boolean; enabled: boolean; label: string; empty: string; }
export default function PreviewMedia({ image, video, active, enabled, label, empty }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const region = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    const media = ref.current;
    if (!media || !enabled || !video || failed) return;
    let visible = false;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const reset = () => { media.pause(); setReady(false); try { if (media.readyState) media.currentTime = .001; } catch {} };
    const load = () => { if (!media.getAttribute('src')) { media.src = video; media.load(); } };
    const sync = () => {
      if (!visible || !active || motion.matches || !pointer.matches || document.hidden) { reset(); return; }
      load();
      void media.play().catch(() => setReady(false));
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible && (!image || imageFailed)) load();
      sync();
    });
    observer.observe(region.current!);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    pointer.addEventListener('change', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync); pointer.removeEventListener('change', sync); reset(); };
  }, [active, enabled, video, image, imageFailed, failed]);
  const capture = () => {
    const media = ref.current, target = canvas.current;
    if (!media || !target || !media.paused || media.seeking || media.readyState < 2) return;
    target.width = media.videoWidth; target.height = media.videoHeight;
    try { target.getContext('2d')?.drawImage(media, 0, 0); } catch {}
  };
  return <div className="explorer-media" ref={region} data-playing={ready || undefined}>
    {image && !imageFailed ? <img src={image} alt={label} width={1280} height={720} loading="lazy" onError={() => setImageFailed(true)} />
      : <><span className="media-empty">{empty}</span>{video && !failed && <canvas ref={canvas} aria-hidden="true" />}</>}
    {video && !failed && <video ref={ref} preload="none" muted loop playsInline disablePictureInPicture tabIndex={-1} aria-hidden="true"
      onLoadedData={capture} onSeeked={capture} onPlaying={() => setReady(true)} onPause={() => setReady(false)} onError={() => { setReady(false); setFailed(true); }} />}
  </div>;
}
