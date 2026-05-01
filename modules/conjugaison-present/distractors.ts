import type { Verb } from '@/lib/linguistics/french/conjugation';
import { shuffle } from '@/lib/science/math/random';
import { SLOT_PRONOUNS, bareForm } from './forms';

export function pickChips(verb: Verb, targetSlot: number): string[] {
  const correct = bareForm(verb, SLOT_PRONOUNS[targetSlot]);
  const others: string[] = [];
  const seen = new Set<string>([correct]);
  for (let s = 0; s < 6; s++) {
    if (s === targetSlot) continue;
    const f = bareForm(verb, SLOT_PRONOUNS[s]);
    if (!seen.has(f)) {
      seen.add(f);
      others.push(f);
    }
  }
  const distractors = shuffle(others).slice(0, 3);
  return shuffle([correct, ...distractors]);
}
