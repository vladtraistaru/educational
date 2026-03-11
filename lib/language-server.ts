import { cookies } from 'next/headers';
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  LANG_COOKIE,
  type Language,
} from './language-config';

const VALID = new Set<string>(LANGUAGES.map((l) => l.value));

export async function getLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LANG_COOKIE)?.value;
  return raw && VALID.has(raw) ? (raw as Language) : DEFAULT_LANGUAGE;
}
