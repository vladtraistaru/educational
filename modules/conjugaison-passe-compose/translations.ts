import type { Language } from '@/lib/language-config';
import type { FrameTemplate } from './frames';

export interface PasseComposeTranslations {
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
  frames: FrameTemplate[];
  objects: Record<string, string>;
  hintAux: string;
  hintParticipe: string;
  allerIntroTitle: string;
  allerIntroBody: string;
  allerContinue: string;
  recapTitle: string;
  recapHint: string;
  restart: string;
  back: string;
}

const FR_FRAMES: FrameTemplate[] = [
  { prefix: 'Hier,', suffix: '' },
  { prefix: 'La semaine dernière,', suffix: '' },
  { prefix: "Quand j'ai fini,", suffix: '' },
  { prefix: 'Ce matin,', suffix: '' },
  { prefix: 'Pendant les vacances,', suffix: '' },
];

const EN_FRAMES: FrameTemplate[] = [
  { prefix: 'Hier,', suffix: '' },
  { prefix: 'La semaine dernière,', suffix: '' },
  { prefix: "Quand j'ai fini,", suffix: '' },
  { prefix: 'Ce matin,', suffix: '' },
  { prefix: 'Pendant les vacances,', suffix: '' },
];

const OBJECTS: Record<string, string> = {
  chanter: 'une chanson',
  manger: 'une pomme',
  parler: 'avec mon ami',
  aimer: 'ce livre',
  finir: 'mes devoirs',
  choisir: 'un cadeau',
  aller: "à l'école",
  faire: 'un dessin',
  dire: 'bonjour',
  être: 'content',
  avoir: 'un cadeau',
};

const translations: Record<Language, PasseComposeTranslations> = {
  fr: {
    title: 'Conjugaison — Passé composé',
    description: 'Construire le passé composé : auxiliaire + participe.',
    intro: 'Choisis un groupe de verbes pour commencer.',
    pools: {
      group1: '1er groupe',
      group2: '2e groupe',
      irregular: 'Irréguliers',
      mix: 'Mélange',
    },
    verbProgress: (c, t) => `Verbe ${c} / ${t}`,
    prompt: 'Construis le passé composé :',
    frames: FR_FRAMES,
    objects: OBJECTS,
    hintAux: 'avoir ou être ?',
    hintParticipe: '-é, -i, ou irrégulier ?',
    allerIntroTitle: 'Nouveau !',
    allerIntroBody:
      'Attention ! Quelques verbes utilisent être au lieu de avoir au passé composé. Le verbe aller en fait partie.',
    allerContinue: 'Continuer',
    recapTitle: 'Bravo !',
    recapHint: 'Touche un verbe orange pour voir sa conjugaison.',
    restart: 'Recommencer',
    back: 'Retour',
  },
  en: {
    title: 'Conjugation — Compound past',
    description: 'Build the passé composé: auxiliary + past participle.',
    intro: 'Pick a group of verbs to start.',
    pools: {
      group1: '1st group',
      group2: '2nd group',
      irregular: 'Irregular',
      mix: 'Mix',
    },
    verbProgress: (c, t) => `Verb ${c} / ${t}`,
    prompt: 'Build the passé composé:',
    frames: EN_FRAMES,
    objects: OBJECTS,
    hintAux: 'avoir or être?',
    hintParticipe: '-é, -i, or irregular?',
    allerIntroTitle: 'New!',
    allerIntroBody:
      'Heads up — some verbs use être instead of avoir in the passé composé. Aller is one of them.',
    allerContinue: 'Continue',
    recapTitle: 'Well done!',
    recapHint: 'Tap an orange verb to see its full conjugation.',
    restart: 'Play again',
    back: 'Back',
  },
};

export default translations;
