import type { ComponentType } from 'react';
import type { ModuleConfig, ActivityProps } from '@/lib/types';
import type { Language } from '@/lib/language-config';

import * as numberScaleExplorer from './number-scale-explorer';
import * as euclideanPostulates from './euclidean-postulates';
import * as shapeExplorer from './shape-explorer';
import * as shapeExplorer3d from './3d-shape-explorer';
import * as multiplicationPatterns from './multiplication-patterns';
import * as timesTableChallenge from './times-table-challenge';
import * as laserAndMirrors from './laser-and-mirrors';
import * as symmetryPlay from './symmetry-play';
import * as measureTime from './measure-time';
import * as measureLengths from './measure-lengths';
import * as simpleCircuits from './simple-circuits';
import * as conjugaisonPresent from './conjugaison-present';

type MetaTranslations = Record<Language, { title: string; description: string }>;

interface ModuleEntry {
  config: ModuleConfig;
  component: ComponentType<ActivityProps>;
  translations: MetaTranslations;
}

const moduleEntries: ModuleEntry[] = [
  numberScaleExplorer,
  euclideanPostulates,
  shapeExplorer,
  shapeExplorer3d,
  multiplicationPatterns,
  timesTableChallenge,
  symmetryPlay,
  laserAndMirrors,
  measureTime,
  measureLengths,
  simpleCircuits,
  conjugaisonPresent,
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
