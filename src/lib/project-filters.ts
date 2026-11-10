export const projectFilters = ['all', 'featured', 'active', 'planning', 'completed'] as const;
export type ProjectFilter = typeof projectFilters[number];
type Filterable = { featured: boolean; status: string | null };
export const matchesFilter = (project: Filterable, filter: ProjectFilter) => filter === 'all' || (filter === 'featured' ? project.featured : project.status === filter);
export const availableFilters = (projects: Filterable[]) => projectFilters.filter(filter => filter === 'all' || projects.some(project => matchesFilter(project, filter)));

export function applyProjectFilter(doc: Document, url: URL) {
  const container = doc.querySelector<HTMLElement>('.project-filters');
  if (!container) { delete doc.documentElement.dataset.projectFilter; return; }
  const buttons = [...container.querySelectorAll<HTMLButtonElement>('button[data-filter]')];
  const requested = url.searchParams.get('filter');
  const active = buttons.some(button => button.dataset.filter === requested) ? requested as ProjectFilter : 'all';
  doc.documentElement.dataset.projectFilter = active;
  let count = 0;
  doc.querySelectorAll<HTMLElement>('#project-list [data-project]').forEach(row => {
    row.hidden = !matchesFilter({ featured: row.dataset.featured === 'true', status: row.dataset.status || null }, active);
    if (!row.hidden) count++;
  });
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === active)));
  const countLabel = container.querySelector<HTMLElement>('[role="status"]');
  if (countLabel) countLabel.textContent = count + ' ' + container.dataset.countLabel;
}

export function initializeProjectFilters(signal: AbortSignal) {
  const container = document.querySelector<HTMLElement>('.project-filters');
  if (!container) return;
  const sync = () => applyProjectFilter(document, new URL(location.href));
  sync();
  container.querySelectorAll<HTMLButtonElement>('button[data-filter]').forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      const url = new URL(location.href), filter = button.dataset.filter!;
      if (filter === 'all') url.searchParams.delete('filter'); else url.searchParams.set('filter', filter);
      history.replaceState(history.state, '', url);
      sync();
      document.querySelectorAll<HTMLAnchorElement>('.language-nav a').forEach(link => link.search = url.search);
    }, { signal });
  });
  container.dataset.filtersReady = 'true';
  addEventListener('popstate', sync, { signal });

  const trigger = container.querySelector<HTMLButtonElement>('.filter-help-toggle')!;
  const panel = container.querySelector<HTMLElement>('.filter-help')!;
  panel.dataset.helpReady = 'true';
  const place = () => {
    const viewport = visualViewport;
    const left = viewport?.offsetLeft || 0, top = viewport?.offsetTop || 0;
    const width = viewport?.width || innerWidth, height = viewport?.height || innerHeight;
    const anchor = trigger.getBoundingClientRect(), panelWidth = Math.min(340, width - 32);
    panel.style.width = panelWidth + 'px';
    panel.style.maxHeight = height - 32 + 'px';
    panel.style.left = Math.max(left + 16, Math.min(anchor.right - panelWidth, left + width - panelWidth - 16)) + 'px';
    panel.style.top = Math.max(top + 16, Math.min(anchor.bottom + 8, top + height - (panel.offsetHeight || 440) - 16)) + 'px';
    if (panel.matches(':popover-open')) panel.dataset.positioned = 'true';
  };
  panel.addEventListener('beforetoggle', event => {
    const open = (event as ToggleEvent).newState === 'open';
    trigger.setAttribute('aria-expanded', String(open));
    if (open) place(); else delete panel.dataset.positioned;
  }, { signal });
  panel.addEventListener('toggle', () => {
    if (panel.matches(':popover-open')) { place(); panel.focus({ preventScroll: true }); }
  }, { signal });
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); panel.hidePopover(); trigger.focus({ preventScroll: true }); }
  }, { signal });
  const reposition = () => { if (panel.matches(':popover-open')) place(); };
  addEventListener('resize', reposition, { signal });
  addEventListener('scroll', reposition, { passive: true, signal });
  visualViewport?.addEventListener('resize', reposition, { signal });
  visualViewport?.addEventListener('scroll', reposition, { signal });
  signal.addEventListener('abort', () => { if (panel.matches(':popover-open')) panel.hidePopover(); }, { once: true });
}
