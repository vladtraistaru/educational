import type { Language } from '@/lib/language';

export interface Theme {
  id: string;
  emoji: string;
  nouns: Record<Language, { one: string; many: string }>;
}

export const themes: Theme[] = [
  { id: 'cookies', emoji: '🍪', nouns: { en: { one: 'cookie', many: 'cookies' }, fr: { one: 'biscuit', many: 'biscuits' } } },
  { id: 'apples', emoji: '🍎', nouns: { en: { one: 'apple', many: 'apples' }, fr: { one: 'pomme', many: 'pommes' } } },
  { id: 'candies', emoji: '🍬', nouns: { en: { one: 'candy', many: 'candies' }, fr: { one: 'bonbon', many: 'bonbons' } } },
  { id: 'balls', emoji: '⚽', nouns: { en: { one: 'ball', many: 'balls' }, fr: { one: 'ballon', many: 'ballons' } } },
  { id: 'flowers', emoji: '🌸', nouns: { en: { one: 'flower', many: 'flowers' }, fr: { one: 'fleur', many: 'fleurs' } } },
];

export function noun(theme: Theme, language: Language, count: number): string {
  const n = theme.nouns[language];
  return count === 1 ? n.one : n.many;
}
