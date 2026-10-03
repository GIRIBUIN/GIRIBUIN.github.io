import type { Project } from './types';

const modules = import.meta.glob<{ default: Project }>('./entries/*.ts', {
  eager: true,
});

export const projects = Object.values(modules)
  .map((module) => module.default)
  .sort((a, b) => a.order - b.order);

export type { Project, ProjectMedia, TechnicalDecision } from './types';
