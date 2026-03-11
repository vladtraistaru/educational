export type Subject =
  | 'mathematics'
  | 'science'
  | 'literacy'
  | 'geography'
  | 'history'
  | 'art';

export interface ModuleConfig {
  slug: string;
  title: string;
  description: string;
  subject: Subject;
  difficulty: number; // 1 (easiest) to 10 (hardest)
  icon?: string;
  estimatedMinutes?: number;
}

export interface ActivityProps {}

import type { Language } from './language-config';

export const SUBJECT_LABELS: Record<Language, Record<Subject, string>> = {
  en: {
    mathematics: 'Mathematics',
    science: 'Science',
    literacy: 'Literacy',
    geography: 'Geography',
    history: 'History',
    art: 'Art',
  },
  fr: {
    mathematics: 'Mathématiques',
    science: 'Sciences',
    literacy: 'Lecture',
    geography: 'Géographie',
    history: 'Histoire',
    art: 'Art',
  },
};

export const UI_LABELS: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    platformTitle: 'Educational Platform',
    exploreBySubject: 'Explore activities by subject',
    difficulty: 'Difficulty',
  },
  fr: {
    home: 'Accueil',
    platformTitle: 'Plateforme Éducative',
    exploreBySubject: 'Explorer les activités par matière',
    difficulty: 'Difficulté',
  },
};
