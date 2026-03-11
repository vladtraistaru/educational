export type Language = 'en' | 'fr';

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
];

export const DEFAULT_LANGUAGE: Language = 'en';
export const LANG_COOKIE = 'lang';
