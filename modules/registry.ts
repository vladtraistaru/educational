import { ModuleConfig } from '@/lib/types';
import { config as numberScaleExplorer } from './number-scale-explorer/config';
import { config as shapeSorter } from './shape-sorter/config';
import { config as animalHabitats } from './animal-habitats/config';
import { config as wordBuilder } from './word-builder/config';
import { config as timesTableChallenge } from './times-table-challenge/config';

export const modules: ModuleConfig[] = [
  numberScaleExplorer,
  shapeSorter,
  animalHabitats,
  wordBuilder,
  timesTableChallenge,
];

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
