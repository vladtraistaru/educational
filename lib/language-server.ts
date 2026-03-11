import { cookies } from 'next/headers';
import { DEFAULT_LANGUAGE, LANG_COOKIE, type Language } from './language';

export async function getLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  return (cookieStore.get(LANG_COOKIE)?.value ?? DEFAULT_LANGUAGE) as Language;
}
