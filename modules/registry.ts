import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { ModuleConfig, ActivityProps } from '@/lib/types';
import { config as numberScaleExplorer } from './number-scale-explorer/config';
import { config as euclideanPostulates } from './euclidean-postulates/config';
import { config as shapeExplorer } from './shape-explorer/config';

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
];

const modules = moduleEntries.map((e) => e.config);

export function getModulesByGrade(grade: number): ModuleConfig[] {
  return modules.filter((m) => m.grades.includes(grade));
}

export function getSubjectsForGrade(grade: number): string[] {
  const mods = getModulesByGrade(grade);
  return [...new Set(mods.map((m) => m.subject))];
}

export function getModulesByGradeAndSubject(
  grade: number,
  subject: string,
): ModuleConfig[] {
  return modules.filter(
    (m) => m.grades.includes(grade) && m.subject === subject,
  );
}

export function getModuleBySlug(slug: string): ModuleConfig | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getAllGrades(): number[] {
  const grades = new Set<number>();
  modules.forEach((m) => m.grades.forEach((g) => grades.add(g)));
  return [...grades].sort((a, b) => a - b);
}

export function getActivityComponent(
  slug: string,
): ComponentType<ActivityProps> | null {
  return moduleEntries.find((e) => e.config.slug === slug)?.component ?? null;
}
