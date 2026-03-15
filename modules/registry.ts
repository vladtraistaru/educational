import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { ModuleConfig, ActivityProps } from '@/lib/types';
import type { Language } from '@/lib/language-config';
import { config as numberScaleExplorer } from './number-scale-explorer/config';
import { config as euclideanPostulates } from './euclidean-postulates/config';
import { config as shapeExplorer } from './shape-explorer/config';
import { config as shapeExplorer3d } from './3d-shape-explorer/config';
import { config as multiplicationPatterns } from './multiplication-patterns/config';
import { config as timesTableChallenge } from './times-table-challenge/config';
import { config as opticsStudy1 } from './optics-study-1/config';
import numberScaleExplorerT from './number-scale-explorer/translations';
import euclideanPostulatesT from './euclidean-postulates/translations';
import shapeExplorerT from './shape-explorer/translations';
import shapeExplorer3dT from './3d-shape-explorer/translations';
import multiplicationPatternsT from './multiplication-patterns/translations';
import timesTableChallengeT from './times-table-challenge/translations';
import opticsStudy1T from './optics-study-1/translations';

type MetaTranslations = Record<Language, { title: string; description: string }>;

interface ModuleEntry {
  config: ModuleConfig;
  component: ComponentType<ActivityProps>;
  translations: MetaTranslations;
}

const moduleEntries: ModuleEntry[] = [
  {
    config: numberScaleExplorer,
    component: dynamic(() => import('./number-scale-explorer/Activity')),
    translations: numberScaleExplorerT,
  },
  {
    config: euclideanPostulates,
    component: dynamic(() => import('./euclidean-postulates/Activity')),
    translations: euclideanPostulatesT,
  },
  {
    config: shapeExplorer,
    component: dynamic(() => import('./shape-explorer/Activity')),
    translations: shapeExplorerT,
  },
  {
    config: shapeExplorer3d,
    component: dynamic(() => import('./3d-shape-explorer/Activity')),
    translations: shapeExplorer3dT,
  },
  {
    config: multiplicationPatterns,
    component: dynamic(() => import('./multiplication-patterns/Activity')),
    translations: multiplicationPatternsT,
  },
  {
    config: timesTableChallenge,
    component: dynamic(() => import('./times-table-challenge/Activity')),
    translations: timesTableChallengeT,
  },
  {
    config: opticsStudy1,
    component: dynamic(() => import('./optics-study-1/Activity')),
    translations: opticsStudy1T,
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

export function getModuleMetadata(
  slug: string,
  lang: Language,
): { title: string; description: string } | undefined {
  const entry = moduleEntries.find((e) => e.config.slug === slug);
  if (!entry) return undefined;
  return {
    title: entry.translations[lang]?.title ?? entry.config.title,
    description: entry.translations[lang]?.description ?? entry.config.description,
  };
}
