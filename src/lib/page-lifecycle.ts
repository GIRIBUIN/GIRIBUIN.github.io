// Bundled scripts run once; page DOM and its listeners must follow each swap.
export function onPageLoad(setup: (signal: AbortSignal) => void | (() => void)) {
  let dispose: (() => void) | undefined;
  document.addEventListener('astro:page-load', () => {
    dispose?.();
    const controller = new AbortController();
    const cleanup = setup(controller.signal);
    dispose = () => { cleanup?.(); controller.abort(); };
  });
  document.addEventListener('astro:before-swap', () => { dispose?.(); dispose = undefined; });
}
