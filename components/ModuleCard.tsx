import Link from 'next/link';
import { ModuleConfig, GRADE_LABELS } from '@/lib/types';
import type { Language } from '@/lib/language';
import styles from './ModuleCard.module.css';

interface Props {
  module: ModuleConfig;
  lang?: Language;
  showGrades?: boolean;
}

export default function ModuleCard({ module, lang = 'en', showGrades }: Props) {
  return (
    <Link href={`/activity/${module.slug}`} className={styles.card}>
      <article>
        <strong>{module.title}</strong>
        <p>{module.description}</p>
        {showGrades && (
          <div className={styles.grades}>
            {module.grades.map((g) => (
              <span key={g} className={styles.gradeBadge}>
                {GRADE_LABELS[lang][g] ?? `Year ${g}`}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
