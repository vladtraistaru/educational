import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { ModuleConfig, ActivityProps } from '@/lib/types';
import { config as numberScaleExplorer } from './number-scale-explorer/config';
import { config as euclideanPostulates } from './euclidean-postulates/config';
import { config as shapeExplorer } from './shape-explorer/config';
import { config as shapeExplorer3d } from './3d-shape-explorer/config';

interface ModuleEntry {
  config: ModuleConfig;
  component: ComponentType<ActivityProps>;
}

const moduleEntries: ModuleEntry[] = [
  {
    config: numberScaleExplorer,
    component: dynamic(() => import('./number-scale-explorer/Activity')),
  },
  {
    config: euclideanPostulates,
    component: dynamic(() => import('./euclidean-postulates/Activity')),
  },
  {
    config: shapeExplorer,
    component: dynamic(() => import('./shape-explorer/Activity')),
  },
  {
    config: shapeExplorer3d,
    component: dynamic(() => import('./3d-shape-explorer/Activity')),
  },
];

const modules = moduleEntries
  .map((e) => e.config)
  .sort((a, b) => a.difficulty - b.difficulty);

export function getAllModules(): ModuleConfig[] {
  return modules;
}

export function getModulesBySubject(subject: string): ModuleConfig[] {
  return modules.filter((m) => m.subject === subject);
}

export function getAllSubjects(): string[] {
  return [...new Set(modules.map((m) => m.subject))];
}

export function getModuleBySlug(slug: string): ModuleConfig | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getActivityComponent(
  slug: string,
): ComponentType<ActivityProps> | null {
  return moduleEntries.find((e) => e.config.slug === slug)?.component ?? null;
}
