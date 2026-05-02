import {
  conjugate,
  getAuxiliary,
  getParticipe,
  VERBS,
  type Auxiliary,
  type Pronoun,
  type Verb,
} from '@/lib/linguistics/french/conjugation';
import { shuffle } from '@/lib/science/math/random';

const SLOT_PRONOUNS: Pronoun[] = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];

function pronounSlot(p: Pronoun): number {
  if (p === 'je') return 0;
  if (p === 'tu') return 1;
  if (p === 'il' || p === 'elle' || p === 'on') return 2;
  if (p === 'nous') return 3;
  if (p === 'vous') return 4;
  return 5;
}

function bareForm(verb: Verb, pronoun: Pronoun, tense: 'present'): string {
  const out = conjugate(verb, tense, pronoun);
  if (pronoun === 'je') {
    return out.startsWith("j'") ? out.slice(2) : out.slice(3);
  }
  return out.slice(pronoun.length + 1);
}

export function correctAuxChip(verb: Verb, pronoun: Pronoun): string {
  const aux = getAuxiliary(verb);
  const auxVerb = aux === 'avoir' ? VERBS.avoir : VERBS.être;
  return bareForm(auxVerb, pronoun, 'present');
}

export function pickAuxChips(verb: Verb, pronoun: Pronoun): string[] {
  const correct = correctAuxChip(verb, pronoun);
  const slot = pronounSlot(pronoun);
  const otherAux: Auxiliary = getAuxiliary(verb) === 'avoir' ? 'etre' : 'avoir';
  const otherAuxVerb = otherAux === 'avoir' ? VERBS.avoir : VERBS.être;
  const sameAuxVerb = getAuxiliary(verb) === 'avoir' ? VERBS.avoir : VERBS.être;

  const wrongAuxSamePerson = bareForm(otherAuxVerb, pronoun, 'present');
  const otherSlots = SLOT_PRONOUNS.filter((p) => pronounSlot(p) !== slot);
  const sameAuxOtherPerson = bareForm(
    sameAuxVerb,
    otherSlots[Math.floor(Math.random() * otherSlots.length)],
    'present',
  );
  const otherAuxOtherPerson = bareForm(
    otherAuxVerb,
    otherSlots[Math.floor(Math.random() * otherSlots.length)],
    'present',
  );

  const distractors: string[] = [];
  for (const c of [wrongAuxSamePerson, otherAuxOtherPerson, sameAuxOtherPerson]) {
    if (c !== correct && !distractors.includes(c) && distractors.length < 3) {
      distractors.push(c);
    }
  }
  const fallback = SLOT_PRONOUNS.flatMap((p) => [
    bareForm(sameAuxVerb, p, 'present'),
    bareForm(otherAuxVerb, p, 'present'),
  ]);
  for (const c of fallback) {
    if (distractors.length >= 3) break;
    if (c !== correct && !distractors.includes(c)) distractors.push(c);
  }
  return shuffle([correct, ...distractors]);
}

export function correctParticipeChip(verb: Verb): string {
  return getParticipe(verb);
}

export function pickParticipeChips(verb: Verb): string[] {
  const correct = correctParticipeChip(verb);
  const candidates = [
    verb.infinitive,
    bareForm(verb, 'nous', 'present'),
    bareForm(verb, 'je', 'present'),
  ];
  const distractors: string[] = [];
  for (const c of candidates) {
    if (c !== correct && !distractors.includes(c) && distractors.length < 3) {
      distractors.push(c);
    }
  }
  let pool = ['chanté', 'fini', 'eu', 'été', 'fait', 'dit', 'allé', 'aimé', 'parlé', 'mangé', 'choisi'];
  pool = pool.filter((p) => p !== correct);
  while (distractors.length < 3) {
    const p = pool.shift();
    if (!p) break;
    if (!distractors.includes(p)) distractors.push(p);
  }
  return shuffle([correct, ...distractors]);
}
