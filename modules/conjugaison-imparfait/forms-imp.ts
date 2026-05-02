import { conjugate, type Pronoun, type Verb } from '@/lib/linguistics/french/conjugation';
import { shuffle } from '@/lib/science/math/random';

export const SLOT_PRONOUNS: Pronoun[] = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];

const ENDINGS: [string, string, string, string, string, string] = [
  'ais', 'ais', 'ait', 'ions', 'iez', 'aient',
];

const DISTINCT_ENDINGS = ['ais', 'ait', 'ions', 'iez', 'aient'];

export function imparfaitEnding(slot: number): string {
  return ENDINGS[slot];
}

export function imparfaitStem(verb: Verb): string {
  if (verb.infinitive === 'être') return 'ét';
  const nous = conjugate(verb, 'present', 'nous');
  const bare = nous.slice(5);
  return bare.replace(/ons$/, '');
}

export function nousPresentStem(verb: Verb): string {
  if (verb.infinitive === 'être') return 'somm';
  const nous = conjugate(verb, 'present', 'nous');
  const bare = nous.slice(5);
  return bare.replace(/ons$/, '');
}

export function nousPresentSuffix(verb: Verb): string {
  return verb.infinitive === 'être' ? 'es' : 'ons';
}

export function bareImparfait(verb: Verb, pronoun: Pronoun): string {
  const out = conjugate(verb, 'imparfait', pronoun);
  if (pronoun === 'je') {
    return out.startsWith("j'") ? out.slice(2) : out.slice(3);
  }
  return out.slice(pronoun.length + 1);
}

export function pickEndingChips(slot: number): string[] {
  const correct = ENDINGS[slot];
  const others = DISTINCT_ENDINGS.filter((e) => e !== correct);
  const distractors = shuffle(others).slice(0, 3);
  return shuffle([correct, ...distractors]);
}
