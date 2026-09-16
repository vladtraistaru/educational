export type Subject =
  | 'mathematics'
  | 'science'
  | 'chemistry'
  | 'literacy'
  | 'geography'
  | 'history'
  | 'art'
  | 'optics'
  | 'electricity-and-magnetism';

export interface ModuleConfig {
  slug: string;
  title: string;
  description: string;
  subject: Subject;
  difficulty: number; // 1 (easiest) to 10 (hardest)
  icon?: string; // emoji shown on the module card
  estimatedMinutes?: number;
  addedOn?: string; // 'YYYY-MM-DD', used to surface "New" modules
}

export interface ActivityProps {}

import type { Language } from './language-config';

export type DifficultyBand = 'easy' | 'medium' | 'hard';

export function getDifficultyBand(difficulty: number): DifficultyBand {
  if (difficulty <= 3) return 'easy';
  if (difficulty <= 6) return 'medium';
  return 'hard';
}

export const SUBJECT_META: Record<Subject, { icon: string; hue: number }> = {
  mathematics: { icon: '🔢', hue: 255 },
  science: { icon: '🔬', hue: 152 },
  chemistry: { icon: '🧪', hue: 285 },
  literacy: { icon: '📖', hue: 28 },
  geography: { icon: '🌍', hue: 199 },
  history: { icon: '🏛️', hue: 35 },
  art: { icon: '🎨', hue: 330 },
  optics: { icon: '🔭', hue: 187 },
  'electricity-and-magnetism': { icon: '⚡', hue: 48 },
};

export const SUBJECT_LABELS: Record<Language, Record<Subject, string>> = {
  en: {
    mathematics: 'Mathematics',
    science: 'Science',
    chemistry: 'Chemistry',
    literacy: 'Literacy',
    geography: 'Geography',
    history: 'History',
    art: 'Art',
    optics: 'Optics',
    'electricity-and-magnetism': 'Electricity & Magnetism',
  },
  fr: {
    mathematics: 'Mathématiques',
    science: 'Sciences',
    chemistry: 'Chimie',
    literacy: 'Lecture',
    geography: 'Géographie',
    history: 'Histoire',
    art: 'Art',
    optics: 'Optique',
    'electricity-and-magnetism': 'Électricité et magnétisme',
  },
};

export const UI_LABELS: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    platformTitle: 'Educational Platform',
    exploreBySubject: 'Explore activities by subject',
    difficulty: 'Difficulty',
    footerOpenSource: 'This platform is free to use, share, and improve.',
    footerSourceCode: 'Source code on GitHub',
    sendFeedback: 'Send Feedback',
    feedbackTitle: 'Send Feedback',
    feedbackHint: 'Got an idea, a feature request, or found a bug? We\'d love to hear from you.',
    feedbackPlaceholder: 'Your feedback…',
    feedbackAboutYou: 'Tell us a bit about yourself (optional)',
    feedbackWho: 'Who are you?',
    feedbackWhoPlaceholder: 'e.g. parent, teacher, student…',
    feedbackSource: 'How did you find this platform?',
    feedbackSourcePlaceholder: 'e.g. Google, a friend, social media…',
    feedbackSending: 'Sending…',
    feedbackSend: 'Send',
    feedbackThanks: 'Thanks for your feedback!',
    feedbackError: 'Something went wrong. Please try again.',
    heroTitle: 'Educational Platform',
    heroSubtitle: 'Fun, hands-on activities for curious minds',
    activityCount: '{count} activities across {subjects} subjects',
    searchPlaceholder: 'Search activities…',
    allSubjects: 'All',
    newlyAdded: 'Newly added',
    browseBySubject: 'Browse by subject',
    allActivities: 'All activities',
    noResults: 'No activities match your search.',
    clearFilters: 'Clear filters',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    minutes: 'min',
    new: 'New',
  },
  fr: {
    home: 'Accueil',
    platformTitle: 'Plateforme Éducative',
    exploreBySubject: 'Explorer les activités par matière',
    difficulty: 'Difficulté',
    footerOpenSource: 'Cette plateforme est gratuite à utiliser, partager et améliorer.',
    footerSourceCode: 'Code source sur GitHub',
    sendFeedback: 'Envoyer un commentaire',
    feedbackTitle: 'Envoyer un commentaire',
    feedbackHint: 'Une idée, une demande ou un bug ? Nous serions ravis de vous entendre.',
    feedbackPlaceholder: 'Votre commentaire…',
    feedbackAboutYou: 'Parlez-nous de vous (facultatif)',
    feedbackWho: 'Qui êtes-vous ?',
    feedbackWhoPlaceholder: 'ex. parent, enseignant, élève…',
    feedbackSource: 'Comment avez-vous trouvé cette plateforme ?',
    feedbackSourcePlaceholder: 'ex. Google, un ami, les réseaux sociaux…',
    feedbackSending: 'Envoi…',
    feedbackSend: 'Envoyer',
    feedbackThanks: 'Merci pour votre commentaire !',
    feedbackError: 'Une erreur est survenue. Veuillez réessayer.',
    heroTitle: 'Plateforme Éducative',
    heroSubtitle: 'Des activités ludiques pour les esprits curieux',
    activityCount: '{count} activités dans {subjects} matières',
    searchPlaceholder: 'Rechercher une activité…',
    allSubjects: 'Toutes',
    newlyAdded: 'Nouveautés',
    browseBySubject: 'Parcourir par matière',
    allActivities: 'Toutes les activités',
    noResults: 'Aucune activité ne correspond à votre recherche.',
    clearFilters: 'Effacer les filtres',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    minutes: 'min',
    new: 'Nouveau',
  },
};
