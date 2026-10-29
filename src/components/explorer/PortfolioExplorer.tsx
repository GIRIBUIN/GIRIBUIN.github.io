import { useEffect, useReducer, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { localePath, type Locale } from '../../i18n/ui';
import type { ExplorerProject, ExplorerState } from './types';
import { parentState, readState, stateHash } from './navigation';
import { getExplorerUi } from './copy';
import Window from './Window';
import PreviewMedia from './PreviewMedia';
import ProjectDetailWindow from './ProjectDetailWindow';
import ProjectSplit from './ProjectSplit';
import ProjectActionFooter from './ProjectActionFooter';
import { allowPrefetch, loadDetail } from './detail-content';
import './explorer.css';
import '../../styles/project-actions.css';

interface Props {
  projects: ExplorerProject[]; locale: Locale; about?: ReactNode; resume?: ReactNode; contact?: ReactNode; children?: ReactNode;
  embedded?: boolean;
  detailsIcon?: ReactNode; demoIcon?: ReactNode; sourceIcon?: ReactNode; downloadIcon?: ReactNode; videoIcon?: ReactNode;
}
const menus = ['projects', 'about', 'resume', 'contact'] as const;
export default function PortfolioExplorer({ projects, locale: initialLocale, about, resume, contact, embedded = false, detailsIcon, demoIcon, sourceIcon, downloadIcon, videoIcon }: Props) {
  const [state, dispatch] = useReducer((_: ExplorerState, next: ExplorerState) => next, { screen: 'main' });
  const [locale, setLocale] = useState(initialLocale);
  const [ready, setReady] = useState(false);
  const lastProject = useRef<string | null>(null);
  const ui = getExplorerUi(locale);
  const hash = stateHash(state);
  const selected = state.screen === 'projects' && state.view !== 'list' ? projects.find(p => p.slug === state.slug) : undefined;
  const detail = state.screen === 'projects' && state.view === 'detail';
  const projectOpen = state.screen === 'projects' && !detail;
  useEffect(() => {
    if (!selected || !projectOpen || !allowPrefetch()) return;
    const timer = setTimeout(() => {
      if (allowPrefetch()) void loadDetail(localePath('/work/' + selected.slug + '/', locale), true).catch(() => {});
    }, 700);
    return () => clearTimeout(timer);
  }, [selected, projectOpen, locale]);
  useEffect(() => {
    const sync = () => {
      const parsed = readState(location.hash, projects.map(p => p.slug));
      const next: ExplorerState = embedded && parsed.screen !== 'projects' ? { screen: 'main' } : parsed;
      if (next.screen === 'projects' && next.view !== 'list') lastProject.current = next.slug;
      dispatch(next);
    };
    sync(); setReady(true);
    addEventListener('hashchange', sync); addEventListener('popstate', sync); addEventListener('pageshow', sync);
    const observer = new MutationObserver(() => setLocale(document.documentElement.lang === 'ko' ? 'ko' : 'en'));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    setLocale(document.documentElement.lang === 'ko' ? 'ko' : 'en');
    return () => { removeEventListener('hashchange', sync); removeEventListener('popstate', sync); removeEventListener('pageshow', sync); observer.disconnect(); };
  }, [projects, embedded]);
  const navigate = (next: ExplorerState) => {
    const nextHash = stateHash(next);
    if (nextHash !== location.hash) history.replaceState(history.state, '', location.pathname + location.search + nextHash);
    // A restored document can have a clean URL while its previous window is still open.
    dispatch(next);
    dispatchEvent(new PopStateEvent('popstate'));
  };
  const back = () => navigate(parentState(state));
  const activate = (event: ReactMouseEvent<HTMLAnchorElement>, next: ExplorerState) => {
    if (event.button || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    event.preventDefault(); navigate(next);
  };
  useEffect(() => {
    if (!embedded) return;
    const trigger = document.querySelector<HTMLAnchorElement>('[data-project-explorer-trigger]');
    const open = (event: MouseEvent) => {
      if (event.button || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      event.preventDefault(); navigate({ screen: 'projects', view: 'list' });
    };
    trigger?.addEventListener('click', open);
    return () => trigger?.removeEventListener('click', open);
  }, [embedded]);
  useEffect(() => {
    if (embedded) document.querySelector('[data-project-explorer-trigger]')?.setAttribute('aria-expanded', String(state.screen !== 'main'));
  }, [embedded, state.screen]);
  const copy = selected?.copy[locale];
  const current = state.screen === 'main' ? 'projects' : state.screen;
  const actionIcons = { details: detailsIcon, demo: demoIcon, github: sourceIcon, download: downloadIcon, video: videoIcon };
  return <div className="portfolio-explorer" data-explorer-ready={ready || undefined}>
    {!embedded && <nav className="title-menu" aria-label={ui.main}>
      {menus.map(menu => <a key={menu} className="game-control menu-choice" href={'#' + menu} data-menu={menu}
        onClick={event => activate(event, menu === 'projects' ? { screen: 'projects', view: 'list' } : { screen: menu })}>
        <span>{menu.toUpperCase()}</span>
      </a>)}
    </nav>}
    <Window open={state.screen !== 'main'} title={detail && copy ? copy.title : ui.heading[current]} preserveDocumentScroll={embedded}
      route={hash} locale={locale} focusTarget={state.screen === 'projects' && state.view === 'list' && lastProject.current ? '[data-collection-project="' + lastProject.current + '"]' : undefined} onBack={back} onHome={() => navigate({ screen: 'main' })}>
      <section className="collection-panel" hidden={!projectOpen} aria-label={ui.collection}>
        {!selected ? <div className="collection-grid">
          {projects.map(project => <a key={project.slug} href={'#projects/' + project.slug} className="collection-entry game-item" data-collection-project={project.slug}
            onClick={event => activate(event, { screen: 'projects', view: 'preview', slug: project.slug })}>
            <PreviewMedia image={project.image} video={null} active={false} enabled={projectOpen} label={project.copy[locale].title + ' — ' + ui.image} empty={ui.noMedia} />
            <h3>{project.copy[locale].title}</h3><p>{project.copy[locale].description}</p>
          </a>)}
        </div> : <ProjectSplit locale={locale} left={
          <div className="explorer-left" id="project-explorer-left">
            {selected && <PreviewMedia key={selected.slug} image={selected.image} video={selected.video} active={projectOpen} enabled={projectOpen} label={selected.copy[locale].title + ' — ' + ui.image} empty={ui.noMedia} />}
            <nav className="explorer-pane project-name-list" aria-label={ui.collection} tabIndex={0}>
              {projects.map(project => <a key={project.slug} href={'#projects/' + project.slug} data-collection-project={project.slug}
                aria-current={selected?.slug === project.slug ? 'true' : undefined}
                onClick={event => activate(event, { screen: 'projects', view: 'preview', slug: project.slug })}>{project.copy[locale].title}</a>)}
            </nav>
          </div>
        } right={selected && copy && !detail && <aside className="explorer-pane project-description" id="project-explorer-detail" aria-label={copy.title} key={selected.slug} tabIndex={0}>
            <header className="preview-heading-bar">
              <h3 data-preview-heading tabIndex={-1}>{copy.title}</h3>
              <a className="game-control project-action preview-details" data-project-action="details" aria-label={copy.title + ': ' + ui.details} title={ui.details} href={localePath('/work/' + selected.slug + '/', locale)} onClick={event => activate(event, { screen: 'projects', view: 'detail', slug: selected.slug })}>{detailsIcon}</a>
            </header>
            <div className="preview-content">
            <p className="preview-description">{copy.description}</p>
            <dl className="preview-facts">
              <div><dt>{ui.scope}</dt><dd>{copy.scope}</dd></div>
              {selected.tech.length > 0 && <div><dt>{ui.stack}</dt><dd>{selected.tech.join(' / ')}</dd></div>}
              {copy.result && <div><dt>{ui.result}</dt><dd>{copy.result}</dd></div>}
            </dl>
            </div>
            <ProjectActionFooter project={selected} locale={locale} icons={actionIcons} />
          </aside>} />}
      </section>
      {detail && selected && <ProjectDetailWindow key={selected.slug} slug={selected.slug} locale={locale}
        footer={<ProjectActionFooter project={selected} locale={locale} icons={actionIcons} standalone />} />}
      <div className="profile-panel panel-slot" hidden={state.screen !== 'about'}>{about}</div>
      <div className="documents-panel panel-slot" hidden={state.screen !== 'resume'}>{resume}</div>
      <div className="contact-panel panel-slot" hidden={state.screen !== 'contact'}>{contact}</div>
    </Window>
  </div>;
}
