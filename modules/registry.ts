import { ModuleConfig } from '@/lib/types';
import { config as numberScaleExplorer } from './number-scale-explorer/config';

export const modules: ModuleConfig[] = [
  numberScaleExplorer,
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
