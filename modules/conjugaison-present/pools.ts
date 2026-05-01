import { VERBS, type Verb, type Pronoun } from '@/lib/linguistics/french/conjugation';
import { shuffle } from '@/lib/science/math/random';

export type PoolId = 'group1' | 'group2' | 'irregular' | 'mix';

const POOL_INFINITIVES: Record<PoolId, string[]> = {
  group1: ['chanter', 'manger', 'parler', 'aimer'],
  group2: ['finir', 'choisir'],
  irregular: ['être', 'avoir', 'aller', 'faire', 'dire'],
  mix: [
    'chanter', 'manger', 'parler', 'aimer',
    'finir', 'choisir',
    'être', 'avoir', 'aller', 'faire', 'dire',
  ],
};

export const ROUND_LENGTH = 5;

export function poolVerbs(pool: PoolId): Verb[] {
  return POOL_INFINITIVES[pool].map((inf) => VERBS[inf]);
}

export function pickRoundVerbs(pool: PoolId): Verb[] {
  const verbs = poolVerbs(pool);
  if (verbs.length >= ROUND_LENGTH) {
    return shuffle(verbs).slice(0, ROUND_LENGTH);
  }
  const out: Verb[] = [];
  let last: Verb | null = null;
  while (out.length < ROUND_LENGTH) {
    const candidates = verbs.filter((v) => v !== last);
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    out.push(pick);
    last = pick;
  }
  return out;
}

export function pickSurfacePronouns(): Pronoun[] {
  const il: Pronoun = (['il', 'elle', 'on'] as Pronoun[])[Math.floor(Math.random() * 3)];
  const ils: Pronoun = (['ils', 'elles'] as Pronoun[])[Math.floor(Math.random() * 2)];
  return ['je', 'tu', il, 'nous', 'vous', ils];
}
