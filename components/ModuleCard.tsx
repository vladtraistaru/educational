import Link from 'next/link';
import { ModuleConfig, SUBJECT_META, UI_LABELS } from '@/lib/types';
import type { Language } from '@/lib/language';
import DifficultyBadge from './DifficultyBadge';
import styles from './ModuleCard.module.css';

interface Props {
  module: ModuleConfig;
  lang?: Language;
  title?: string;
  description?: string;
  historyNote?: string;
}

const NEW_WINDOW_DAYS = 60;

function isRecent(addedOn?: string): boolean {
  if (!addedOn) return false;
  const added = new Date(addedOn).getTime();
  if (Number.isNaN(added)) return false;
  const ageMs = Date.now() - added;
  return ageMs >= 0 && ageMs <= NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

export default function ModuleCard({
  module,
  lang = 'en',
  title,
  description,
  historyNote,
}: Props) {
  const ui = UI_LABELS[lang];
  const meta = SUBJECT_META[module.subject];

  return (
    <Link
      href={`/activity/${module.slug}`}
      className={styles.card}
      style={{ ['--card-hue' as string]: String(meta.hue) }}
    >
      <article className={styles.article}>
        <div className={styles.header}>
          <span className={styles.icon} aria-hidden="true">
            {module.icon ?? meta.icon}
          </span>
          {historyNote ? (
            <span className={styles.historyBadge}>{historyNote}</span>
          ) : (
            isRecent(module.addedOn) && <span className={styles.newBadge}>{ui.new}</span>
          )}
        </div>
        <div className={styles.body}>
          <strong className={styles.title}>{title ?? module.title}</strong>
          <p className={styles.description}>{description ?? module.description}</p>
        </div>
        <div className={styles.footer}>
          <DifficultyBadge difficulty={module.difficulty} lang={lang} />
          {module.estimatedMinutes && (
            <span className={styles.minutes}>
              {module.estimatedMinutes} {ui.minutes}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
