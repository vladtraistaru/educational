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
}

export const SUBJECT_LABELS: Record<Subject, string> = {
  mathematics: 'Mathematics',
  science: 'Science',
  literacy: 'Literacy',
  geography: 'Geography',
  history: 'History',
  art: 'Art',
};

export const GRADE_LABELS: Record<number, string> = {
  0: 'Reception',
  1: 'Year 1',
  2: 'Year 2',
  3: 'Year 3',
  4: 'Year 4',
  5: 'Year 5',
  6: 'Year 6',
};
