'use client';

import { useLanguage, LANGUAGES } from '@/lib/language';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as typeof language)}
      aria-label="Language"
      style={{ width: 'auto', marginBottom: 0 }}
    >
      {LANGUAGES.map((l) => (
        <option key={l.value} value={l.value}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
