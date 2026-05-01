import { conjugate, type Pronoun, type Verb } from '@/lib/linguistics/french/conjugation';

export const SLOT_PRONOUNS: Pronoun[] = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];

export function bareForm(verb: Verb, pronoun: Pronoun): string {
  const out = conjugate(verb, 'present', pronoun);
  if (pronoun === 'je') {
    return out.startsWith("j'") ? out.slice(2) : out.slice(3);
  }
  return out.slice(pronoun.length + 1);
}

const GROUP1_ENDINGS = ['e', 'es', 'e', 'ons', 'ez', 'ent'];
const GROUP2_ENDINGS = ['is', 'is', 'it', 'issons', 'issez', 'issent'];

export function splitForm(
  verb: Verb,
  slot: number,
  form: string,
): { stem: string; ending: string } {
  if (verb.group === 1) {
    const e = GROUP1_ENDINGS[slot];
    return { stem: form.slice(0, -e.length), ending: e };
  }
  if (verb.group === 2) {
    const e = GROUP2_ENDINGS[slot];
    return { stem: form.slice(0, -e.length), ending: e };
  }
  return { stem: '', ending: form };
}
