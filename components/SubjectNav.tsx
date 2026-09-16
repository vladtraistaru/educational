import { SUBJECT_LABELS, SUBJECT_META, Subject, UI_LABELS } from '@/lib/types';
import type { Language } from '@/lib/language-config';
import styles from './SubjectNav.module.css';

interface Props {
  lang: Language;
  subjects: string[];
  counts: Record<string, number>;
}

export default function SubjectNav({ lang, subjects, counts }: Props) {
  const ui = UI_LABELS[lang];

  return (
    <nav className={styles.nav} aria-label={ui.browseBySubject}>
      <h2 className={styles.heading}>{ui.browseBySubject}</h2>
      <div className={styles.row}>
        {subjects.map((subject) => {
          const meta = SUBJECT_META[subject as Subject];
          return (
            <a
              key={subject}
              href={`#subject-${subject}`}
              className={styles.tile}
              style={{ ['--tile-hue' as string]: String(meta.hue) }}
            >
              <span className={styles.tileIcon} aria-hidden="true">
                {meta.icon}
              </span>
              <span className={styles.tileLabel}>
                {SUBJECT_LABELS[lang][subject as Subject] ?? subject}
              </span>
              <span className={styles.tileCount}>{counts[subject] ?? 0}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
