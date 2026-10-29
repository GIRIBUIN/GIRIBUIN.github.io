import type { ExplorerState } from './types';

export function readState(hash: string, slugs: readonly string[]): ExplorerState {
  const parts = hash.replace(/^#/, '').split('/');
  if (['work', 'tools'].includes(parts[0])) return { screen: 'projects', view: 'list' };
  if (parts[0] === 'projects') {
    if (parts[1] && slugs.includes(parts[1])) return { screen: 'projects', view: parts[2] === 'details' ? 'detail' : 'preview', slug: parts[1] };
    return { screen: 'projects', view: 'list' };
  }
  if (['about', 'background', 'education', 'skills', 'process'].includes(parts[0])) return { screen: 'about' };
  if (parts[0] === 'resume' || parts[0] === 'contact') return { screen: parts[0] };
  return { screen: 'main' };
}

export function stateHash(state: ExplorerState): string {
  if (state.screen === 'main') return '';
  if (state.screen !== 'projects' || state.view === 'list') return '#' + state.screen;
  return '#projects/' + state.slug + (state.view === 'detail' ? '/details' : '');
}

export function parentState(state: ExplorerState): ExplorerState {
  if (state.screen === 'projects' && state.view === 'detail') return { ...state, view: 'preview' };
  if (state.screen === 'projects' && state.view === 'preview') return { screen: 'projects', view: 'list' };
  return { screen: 'main' };
}
