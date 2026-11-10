import { applyProjectFilter } from '../lib/project-filters';

// Apply query-dependent visibility before the new body is painted.
document.addEventListener('astro:before-swap', event => {
  applyProjectFilter(event.newDocument, event.to);
});
