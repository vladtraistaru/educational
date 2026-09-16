import type { ComponentType } from 'react';
import type { ModuleConfig, ActivityProps } from '@/lib/types';
import type { Language } from '@/lib/language-config';

import * as numberScaleExplorer from './number-scale-explorer';
import * as euclideanPostulates from './euclidean-postulates';
import * as shapeExplorer from './shape-explorer';
import * as shapeExplorer3d from './3d-shape-explorer';
import * as multiplicationPatterns from './multiplication-patterns';
import * as timesTableChallenge from './times-table-challenge';
import * as multiplicationCreatures from './multiplication-creatures';
import * as balanceLab from './balance-lab';
import * as laserAndMirrors from './laser-and-mirrors';
import * as lensesAndMirrors from './lenses-and-mirrors';
import * as symmetryPlay from './symmetry-play';
import * as divisionSharing from './division-sharing';
import * as gridCoordinates from './grid-coordinates';
import * as measureTime from './measure-time';
import * as measureLengths from './measure-lengths';
import * as simpleCircuits from './simple-circuits';
import * as conjugaisonPresent from './conjugaison-present';
import * as conjugaisonImparfait from './conjugaison-imparfait';
import * as conjugaisonPasseCompose from './conjugaison-passe-compose';
import * as moleculeLab from './molecule-lab';

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
  multiplicationCreatures,
  symmetryPlay,
  divisionSharing,
  gridCoordinates,
  balanceLab,
  laserAndMirrors,
  lensesAndMirrors,
  measureTime,
  measureLengths,
  simpleCircuits,
  conjugaisonPresent,
  conjugaisonImparfait,
  conjugaisonPasseCompose,
  moleculeLab,
];

const modules = moduleEntries
  .map((e) => e.config)
  .sort((a, b) => a.difficulty - b.difficulty);

// Fixed display order for subject sections — independent of module registration
// order or difficulty, so adding modules never reshuffles the page layout.
const SUBJECT_ORDER = [
  'mathematics',
  'science',
  'chemistry',
  'optics',
  'electricity-and-magnetism',
  'literacy',
  'geography',
  'history',
  'art',
] as const;

export function getAllModules(): ModuleConfig[] {
  return modules;
}

export function getModulesBySubject(subject: string): ModuleConfig[] {
  return modules.filter((m) => m.subject === subject);
}

export function getAllSubjects(): string[] {
  const present = new Set(modules.map((m) => m.subject));
  return SUBJECT_ORDER.filter((s) => present.has(s));
}

export function getSubjectCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const m of modules) {
    counts[m.subject] = (counts[m.subject] ?? 0) + 1;
  }
  return counts;
}

export function getRecentModules(limit = 4): ModuleConfig[] {
  return [...modules]
    .sort((a, b) => (b.addedOn ?? '').localeCompare(a.addedOn ?? ''))
    .slice(0, limit);
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

export interface ResolvedModule extends ModuleConfig {
  title: string;
  description: string;
}

export function getAllModuleMetadata(lang: Language): ResolvedModule[] {
  return modules.map((mod) => {
    const meta = getModuleMetadata(mod.slug, lang);
    return {
      ...mod,
      title: meta?.title ?? mod.title,
      description: meta?.description ?? mod.description,
    };
  });
}
