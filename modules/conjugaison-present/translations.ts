import type { Language } from '@/lib/language-config';

export interface PresentTranslations {
  title: string;
  description: string;
  intro: string;
  pools: {
    group1: string;
    group2: string;
    irregular: string;
    mix: string;
  };
  verbProgress: (current: number, total: number) => string;
  recapTitle: string;
  recapHint: string;
  restart: string;
  back: string;
  fullConjugation: string;
}

const translations: Record<Language, PresentTranslations> = {
  fr: {
    title: 'Conjugaison — Présent',
    description: 'Compléter les tables de conjugaison au présent.',
    intro: 'Choisis un groupe de verbes pour commencer.',
    pools: {
      group1: '1er groupe',
      group2: '2e groupe',
      irregular: 'Irréguliers',
      mix: 'Mélange',
    },
    verbProgress: (c, t) => `Verbe ${c} / ${t}`,
    recapTitle: 'Bravo !',
    recapHint: 'Touche un verbe orange pour voir sa conjugaison.',
    restart: 'Recommencer',
    back: 'Retour',
    fullConjugation: 'Conjugaison complète',
  },
  en: {
    title: 'Conjugation — Present',
    description: 'Fill in the present-tense conjugation tables.',
    intro: 'Pick a group of verbs to start.',
    pools: {
      group1: '1st group',
      group2: '2nd group',
      irregular: 'Irregular',
      mix: 'Mix',
    },
    verbProgress: (c, t) => `Verb ${c} / ${t}`,
    recapTitle: 'Well done!',
    recapHint: 'Tap an orange verb to see its full conjugation.',
    restart: 'Play again',
    back: 'Back',
    fullConjugation: 'Full conjugation',
  },
};

export default translations;
