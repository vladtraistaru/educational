'use client';

import { useMemo, useState } from 'react';
import type { ResolvedModule } from '@/modules/registry';
import {
  DifficultyBand,
  SUBJECT_LABELS,
  SUBJECT_META,
  Subject,
  UI_LABELS,
  getDifficultyBand,
} from '@/lib/types';
import type { Language } from '@/lib/language-config';
import ModuleCard from './ModuleCard';
import styles from './ActivityBrowser.module.css';

interface Props {
  lang: Language;
  modules: ResolvedModule[];
  subjects: string[];
  counts: Record<string, number>;
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

const DIFFICULTY_BANDS: DifficultyBand[] = ['easy', 'medium', 'hard'];

export default function ActivityBrowser({ lang, modules, subjects, counts }: Props) {
  const ui = UI_LABELS[lang];
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [bandFilter, setBandFilter] = useState<DifficultyBand | null>(null);

  const normalizedQuery = normalize(query.trim());
  const isFiltering = normalizedQuery !== '' || subjectFilter !== null || bandFilter !== null;

  const filtered = useMemo(() => {
    return modules.filter((mod) => {
      if (subjectFilter && mod.subject !== subjectFilter) return false;
      if (bandFilter && getDifficultyBand(mod.difficulty) !== bandFilter) return false;
      if (normalizedQuery) {
        const haystack = normalize(`${mod.title} ${mod.description}`);
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [modules, subjectFilter, bandFilter, normalizedQuery]);

  const grouped = useMemo(() => {
    const bySubject = new Map<string, ResolvedModule[]>();
    for (const subject of subjects) bySubject.set(subject, []);
    for (const mod of modules) {
      bySubject.get(mod.subject)?.push(mod);
    }
    return bySubject;
  }, [modules, subjects]);

  const clearFilters = () => {
    setQuery('');
    setSubjectFilter(null);
    setBandFilter(null);
  };

  return (
    <div className={styles.browser}>
      <div className={styles.controls}>
        <label className="visually-hidden" htmlFor="activity-search">
          {ui.searchPlaceholder}
        </label>
        <input
          id="activity-search"
          type="search"
          className={styles.search}
          placeholder={ui.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className={styles.subjectRow} role="group" aria-label={ui.browseBySubject}>
          <button
            type="button"
            className={subjectFilter === null ? styles.subjectTileActive : styles.subjectTile}
            onClick={() => setSubjectFilter(null)}
          >
            {ui.allSubjects}
          </button>
          {subjects.map((subject) => {
            const meta = SUBJECT_META[subject as Subject];
            return (
              <button
                key={subject}
                type="button"
                className={subjectFilter === subject ? styles.subjectTileActive : styles.subjectTile}
                style={{ ['--tile-hue' as string]: String(meta.hue) }}
                onClick={() => setSubjectFilter(subject === subjectFilter ? null : subject)}
              >
                <span className={styles.subjectIcon} aria-hidden="true">
                  {meta.icon}
                </span>
                {SUBJECT_LABELS[lang][subject as Subject] ?? subject}
                <span className={styles.subjectCount}>{counts[subject] ?? 0}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.chipRow} role="group" aria-label={ui.difficulty}>
          <button
            type="button"
            className={bandFilter === null ? styles.chipActive : styles.chip}
            onClick={() => setBandFilter(null)}
          >
            {ui.allSubjects}
          </button>
          {DIFFICULTY_BANDS.map((band) => (
            <button
              key={band}
              type="button"
              className={bandFilter === band ? styles.chipActive : styles.chip}
              onClick={() => setBandFilter(band === bandFilter ? null : band)}
            >
              {ui[band]}
            </button>
          ))}
        </div>
      </div>

      {isFiltering ? (
        filtered.length > 0 ? (
          <section>
            <h2 className={styles.sectionHeading}>
              {ui.allActivities} ({filtered.length})
            </h2>
            <div className={styles.grid}>
              {filtered.map((mod) => (
                <ModuleCard
                  key={mod.slug}
                  module={mod}
                  lang={lang}
                  title={mod.title}
                  description={mod.description}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className={styles.empty}>
            <p>{ui.noResults}</p>
            <button type="button" className={styles.clearButton} onClick={clearFilters}>
              {ui.clearFilters}
            </button>
          </div>
        )
      ) : (
        subjects.map((subject) => {
          const subjectModules = grouped.get(subject) ?? [];
          if (subjectModules.length === 0) return null;
          return (
            <section key={subject} id={`subject-${subject}`} className={styles.section}>
              <h2 className={styles.sectionHeading}>
                {SUBJECT_LABELS[lang][subject as Subject] ?? subject}
              </h2>
              <div className={styles.grid}>
                {subjectModules.map((mod) => (
                  <ModuleCard
                    key={mod.slug}
                    module={mod}
                    lang={lang}
                    title={mod.title}
                    description={mod.description}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
