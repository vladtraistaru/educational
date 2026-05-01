import type { Language } from '@/lib/language-config';

export interface ImparfaitTranslations {
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
  prompt: string;
  presentLabel: string;
  imparfaitLabel: string;
  etreNote: string;
  recapTitle: string;
  recapHint: string;
  restart: string;
  back: string;
}

const translations: Record<Language, ImparfaitTranslations> = {
  fr: {
    title: 'Conjugaison — Imparfait',
    description: "Construire l'imparfait à partir du présent.",
    intro: 'Choisis un groupe de verbes pour commencer.',
    pools: {
      group1: '1er groupe',
      group2: '2e groupe',
      irregular: 'Irréguliers',
      mix: 'Mélange',
    },
    verbProgress: (c, t) => `Verbe ${c} / ${t}`,
    prompt: "Construis l'imparfait :",
    presentLabel: 'Présent',
    imparfaitLabel: 'Imparfait',
    etreNote: 'être est spécial : on utilise le radical ét-',
    recapTitle: 'Bravo !',
    recapHint: 'Touche un verbe orange pour voir sa conjugaison.',
    restart: 'Recommencer',
    back: 'Retour',
  },
  en: {
    title: 'Conjugation — Imperfect',
    description: 'Build the imperfect tense from the present.',
    intro: 'Pick a group of verbs to start.',
    pools: {
      group1: '1st group',
      group2: '2nd group',
      irregular: 'Irregular',
      mix: 'Mix',
    },
    verbProgress: (c, t) => `Verb ${c} / ${t}`,
    prompt: 'Build the imperfect:',
    presentLabel: 'Present',
    imparfaitLabel: 'Imperfect',
    etreNote: 'être is special: we use the stem ét-',
    recapTitle: 'Well done!',
    recapHint: 'Tap an orange verb to see its full conjugation.',
    restart: 'Play again',
    back: 'Back',
  },
};

export default translations;
