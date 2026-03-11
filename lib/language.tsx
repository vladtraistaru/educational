'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

export type Language = 'en' | 'fr';

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
];

export const DEFAULT_LANGUAGE: Language = 'en';
export const LANG_COOKIE = 'lang';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
});

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: Language;
  children: ReactNode;
}) {
  const [language, setLang] = useState<Language>(initialLanguage);
  const router = useRouter();

  const setLanguage = useCallback(
    (lang: Language) => {
      setLang(lang);
      document.cookie = `${LANG_COOKIE}=${lang};path=/;max-age=31536000`;
      router.refresh();
    },
    [router],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
