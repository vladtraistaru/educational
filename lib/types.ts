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
  grades: number[]; // 1 = Year 1, 2 = Year 2, etc. 0 = Reception
  icon?: string;
  estimatedMinutes?: number;
}

export interface ActivityProps {}

import type { Language } from './language';

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

export const GRADE_LABELS: Record<Language, Record<number, string>> = {
  en: {
    0: 'Reception',
    1: 'Year 1',
    2: 'Year 2',
    3: 'Year 3',
    4: 'Year 4',
    5: 'Year 5',
    6: 'Year 6',
  },
  fr: {
    0: 'Maternelle',
    1: 'CP',
    2: 'CE1',
    3: 'CE2',
    4: 'CM1',
    5: 'CM2',
    6: '6ème',
  },
};

export const UI_LABELS: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    platformTitle: 'Educational Platform',
    exploreBySubject: 'Explore activities by subject',
    chooseSubject: 'Choose a subject',
    activity: 'activity',
    activities: 'activities',
  },
  fr: {
    home: 'Accueil',
    platformTitle: 'Plateforme Éducative',
    exploreBySubject: 'Explorer les activités par matière',
    chooseSubject: 'Choisir une matière',
    activity: 'activité',
    activities: 'activités',
  },
};
