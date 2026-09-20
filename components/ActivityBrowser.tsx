'use client';

import { useMemo, useState } from 'react';
import type { ResolvedModule } from '@/modules/registry';
import { SUBJECT_LABELS, SUBJECT_META, Subject, UI_LABELS } from '@/lib/types';
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

export default function ActivityBrowser({ lang, modules, subjects, counts }: Props) {
  const ui = UI_LABELS[lang];
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [railOpen, setRailOpen] = useState(false);

  const normalizedQuery = normalize(query.trim());
  const labelOf = (subject: string) => SUBJECT_LABELS[lang][subject as Subject] ?? subject;

  const groups = useMemo(() => {
    return subjects
      .filter((subject) => !subjectFilter || subject === subjectFilter)
      .map((subject) => ({
        subject,
        modules: modules.filter(
          (mod) =>
            mod.subject === subject &&
            (!normalizedQuery ||
              normalize(`${mod.title} ${mod.description}`).includes(normalizedQuery)),
        ),
      }))
      .filter((group) => group.modules.length > 0);
  }, [modules, subjects, subjectFilter, normalizedQuery]);

  const select = (subject: string | null) => {
    setSubjectFilter(subject);
    setRailOpen(false);
  };

  const clearFilters = () => {
    setQuery('');
    setSubjectFilter(null);
  };

  const railItem = (subject: string | null) => {
    const meta = subject ? SUBJECT_META[subject as Subject] : null;
    const active = subjectFilter === subject;
    return (
      <button
        key={subject ?? 'all'}
        type="button"
        className={active ? styles.railItemActive : styles.railItem}
        style={{ ['--tile-hue' as string]: String(meta?.hue ?? 255) }}
        aria-current={active}
        onClick={() => select(subject)}
      >
        <span className={styles.railIcon} aria-hidden="true">
          {meta?.icon ?? '📚'}
        </span>
        {subject ? labelOf(subject) : ui.allActivities}
        <span className={styles.railCount}>{subject ? (counts[subject] ?? 0) : modules.length}</span>
      </button>
    );
  };

  return (
    <div className={styles.browser}>
      <div className={styles.railWrap}>
        <button
          type="button"
          className={styles.railToggle}
          aria-expanded={railOpen}
          onClick={() => setRailOpen(!railOpen)}
        >
          {subjectFilter ? labelOf(subjectFilter) : ui.browseBySubject}
          <span aria-hidden="true">▾</span>
        </button>
        <nav
          className={railOpen ? styles.railOpen : styles.rail}
          aria-label={ui.browseBySubject}
        >
          <h2 className={styles.railHeading}>{ui.browseBySubject}</h2>
          {railItem(null)}
          {subjects.map((subject) => railItem(subject))}
        </nav>
      </div>

      <div className={styles.content}>
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

        {groups.length === 0 ? (
          <div className={styles.empty}>
            <p>{ui.noResults}</p>
            <button type="button" className={styles.clearButton} onClick={clearFilters}>
              {ui.clearFilters}
            </button>
          </div>
        ) : (
          groups.map(({ subject, modules: list }) => (
            <section key={subject} className={styles.section}>
              <h2 className={styles.sectionHeading}>
                <span
                  className={styles.dot}
                  style={{ ['--tile-hue' as string]: String(SUBJECT_META[subject as Subject].hue) }}
                />
                {labelOf(subject)}
                <span className={styles.sectionCount}>{list.length}</span>
              </h2>
              <div className={styles.grid}>
                {list.map((mod) => (
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
          ))
        )}
      </div>
    </div>
  );
}
