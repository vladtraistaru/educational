export type Subject =
  | 'mathematics'
  | 'science'
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
    optics: 'Optics',
    'electricity-and-magnetism': 'Electricity & Magnetism',
  },
  fr: {
    mathematics: 'Mathématiques',
    science: 'Sciences',
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
  },
};
