import type { ReactNode } from 'react';
import { localePath, type Locale } from '../../i18n/ui';
import { getExplorerUi } from './copy';
import type { ExplorerProject } from './types';
import { prefetchDocument } from './detail-content';

interface Icons { details?: ReactNode; demo?: ReactNode; github?: ReactNode; download?: ReactNode; video?: ReactNode; }
interface Props { project: ExplorerProject; locale: Locale; icons: Icons; standalone?: boolean; }

export default function ProjectActionFooter({ project, locale, icons, standalone = false }: Props) {
  const ui = getExplorerUi(locale);
  const actions = [
    { id: 'demo', url: project.links.demo, label: ui.demo, icon: icons.demo },
    { id: 'github', url: project.links.source, label: ui.github, icon: icons.github },
    { id: 'download', url: project.links.release, label: ui.download, icon: icons.download },
    { id: 'video', url: project.links.video, label: ui.watch, icon: icons.video },
    { id: 'case-study', url: project.links.caseStudy, label: 'Case study', icon: icons.details },
    ...(standalone ? [{ id: 'standalone', url: localePath('/work/' + project.slug + '/', locale), label: ui.separate, icon: icons.demo }] : []),
  ].filter(action => action.url);
  if (!actions.length) return null;
  return <footer className="project-action-footer">
    {actions.map(action => <a key={action.id} className={'game-control project-action' + (action.id === 'standalone' ? ' standalone-link' : '')}
      data-project-action={action.id} href={action.url!} target={action.id === 'standalone' ? undefined : '_blank'} rel={action.id === 'standalone' ? undefined : 'noreferrer'}
      onPointerEnter={action.id === 'standalone' ? () => prefetchDocument(action.url!) : undefined}
      onFocus={action.id === 'standalone' ? () => prefetchDocument(action.url!) : undefined}
      onClick={action.id === 'standalone' ? event => {
        if (event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
        // Leave a clean document entry for browser Back, including BFCache restores.
        history.replaceState(history.state, '', location.pathname + location.search);
      } : undefined}
      aria-label={project.copy[locale].title + ': ' + action.label} title={action.label}>{action.icon}</a>)}
  </footer>;
}
