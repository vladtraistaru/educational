import Link from 'next/link';
import { ModuleConfig, UI_LABELS } from '@/lib/types';
import type { Language } from '@/lib/language';
import styles from './ModuleCard.module.css';

interface Props {
  module: ModuleConfig;
  lang?: Language;
  title?: string;
  description?: string;
}

export default function ModuleCard({ module, lang = 'en', title, description }: Props) {
  const ui = UI_LABELS[lang];

  return (
    <Link href={`/activity/${module.slug}`} className={styles.card}>
      <article>
        <strong>{title ?? module.title}</strong>
        <p>{description ?? module.description}</p>
        <div className={styles.difficulty}>
          <span className={styles.difficultyLabel}>{ui.difficulty}</span>
          <span className={styles.difficultyDots}>
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={i < module.difficulty ? styles.dotFilled : styles.dotEmpty}
              />
            ))}
          </span>
        </div>
      </article>
    </Link>
  );
}
