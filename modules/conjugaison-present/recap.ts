import { conjugate, type Pronoun, type Verb } from '@/lib/linguistics/french/conjugation';
import { SLOT_PRONOUNS } from './forms';
import type { RecapRow } from './EndOfRoundRecap';

function pronounLabel(p: Pronoun): string {
  if (p === 'il') return 'il/elle/on';
  if (p === 'ils') return 'ils/elles';
  return p;
}

export function buildRecapRows(verbs: Verb[], tricky: Set<string>): RecapRow[] {
  return verbs.map((v) => ({
    infinitive: v.infinitive,
    tricky: tricky.has(v.infinitive),
    fullConjugation: SLOT_PRONOUNS.map((p) => ({
      pronoun: pronounLabel(p),
      form: conjugate(v, 'present', p),
    })),
  }));
}
