export type Pronoun =
  | 'je'
  | 'tu'
  | 'il'
  | 'elle'
  | 'on'
  | 'nous'
  | 'vous'
  | 'ils'
  | 'elles';

export type Tense = 'present' | 'imparfait' | 'passe-compose';

export type VerbGroup = 1 | 2 | 3;

export type Auxiliary = 'avoir' | 'etre';

type Slot = 0 | 1 | 2 | 3 | 4 | 5;

type SixForms = [string, string, string, string, string, string];

export interface Verb {
  infinitive: string;
  group: VerbGroup;
  meaning: { en: string; fr: string };
  presentIrregular?: SixForms;
  participePasse?: string;
  auxiliary?: Auxiliary;
}

const PRONOUN_SLOT: Record<Pronoun, Slot> = {
  je: 0, tu: 1, il: 2, elle: 2, on: 2, nous: 3, vous: 4, ils: 5, elles: 5,
};

const PRESENT_GROUP1_ENDINGS: SixForms = ['e', 'es', 'e', 'ons', 'ez', 'ent'];
const PRESENT_GROUP2_ENDINGS: SixForms = ['is', 'is', 'it', 'issons', 'issez', 'issent'];
const IMPARFAIT_ENDINGS: SixForms = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'];

function elide(pronoun: Pronoun, form: string): string {
  if (pronoun !== 'je') return `${pronoun} ${form}`;
  return /^[aeiouhâêîôûéè]/i.test(form) ? `j'${form}` : `je ${form}`;
}

function presentForms(verb: Verb): SixForms {
  if (verb.presentIrregular) return verb.presentIrregular;
  if (verb.group === 1) {
    const stem = verb.infinitive.slice(0, -2);
    return PRESENT_GROUP1_ENDINGS.map((e) => stem + e) as SixForms;
  }
  if (verb.group === 2) {
    const stem = verb.infinitive.slice(0, -2);
    return PRESENT_GROUP2_ENDINGS.map((e) => stem + e) as SixForms;
  }
  throw new Error(`Group 3 verb '${verb.infinitive}' requires presentIrregular`);
}

function imparfaitStem(verb: Verb): string {
  if (verb.infinitive === 'être') return 'ét';
  const nous = presentForms(verb)[3];
  return nous.replace(/ons$/, '');
}

function participePasse(verb: Verb): string {
  if (verb.participePasse) return verb.participePasse;
  if (verb.group === 1) return verb.infinitive.slice(0, -2) + 'é';
  if (verb.group === 2) return verb.infinitive.slice(0, -2) + 'i';
  throw new Error(`Group 3 verb '${verb.infinitive}' requires participePasse`);
}

function auxiliaryFor(verb: Verb): Auxiliary {
  return verb.auxiliary ?? 'avoir';
}

const AVOIR: SixForms = ['ai', 'as', 'a', 'avons', 'avez', 'ont'];
const ETRE: SixForms = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'];

function auxPresentForm(aux: Auxiliary, slot: Slot): string {
  return aux === 'avoir' ? AVOIR[slot] : ETRE[slot];
}

export function conjugate(verb: Verb, tense: Tense, pronoun: Pronoun): string {
  const slot = PRONOUN_SLOT[pronoun];

  if (tense === 'present') {
    return elide(pronoun, presentForms(verb)[slot]);
  }

  if (tense === 'imparfait') {
    return elide(pronoun, imparfaitStem(verb) + IMPARFAIT_ENDINGS[slot]);
  }

  const aux = auxiliaryFor(verb);
  const auxForm = auxPresentForm(aux, slot);
  return `${elide(pronoun, auxForm)} ${participePasse(verb)}`;
}

export const VERBS: Record<string, Verb> = {
  chanter: { infinitive: 'chanter', group: 1, meaning: { en: 'to sing', fr: 'chanter' } },
  manger: { infinitive: 'manger', group: 1, meaning: { en: 'to eat', fr: 'manger' } },
  parler: { infinitive: 'parler', group: 1, meaning: { en: 'to speak', fr: 'parler' } },
  aimer: { infinitive: 'aimer', group: 1, meaning: { en: 'to love', fr: 'aimer' } },

  finir: { infinitive: 'finir', group: 2, meaning: { en: 'to finish', fr: 'finir' } },
  choisir: { infinitive: 'choisir', group: 2, meaning: { en: 'to choose', fr: 'choisir' } },

  être: {
    infinitive: 'être',
    group: 3,
    meaning: { en: 'to be', fr: 'être' },
    presentIrregular: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
    participePasse: 'été',
  },
  avoir: {
    infinitive: 'avoir',
    group: 3,
    meaning: { en: 'to have', fr: 'avoir' },
    presentIrregular: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
    participePasse: 'eu',
  },
  aller: {
    infinitive: 'aller',
    group: 3,
    meaning: { en: 'to go', fr: 'aller' },
    presentIrregular: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
    participePasse: 'allé',
    auxiliary: 'etre',
  },
  faire: {
    infinitive: 'faire',
    group: 3,
    meaning: { en: 'to do/make', fr: 'faire' },
    presentIrregular: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
    participePasse: 'fait',
  },
  dire: {
    infinitive: 'dire',
    group: 3,
    meaning: { en: 'to say', fr: 'dire' },
    presentIrregular: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
    participePasse: 'dit',
  },
};
