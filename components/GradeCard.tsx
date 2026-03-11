import Link from 'next/link';
import { GRADE_LABELS, UI_LABELS } from '@/lib/types';
import type { Language } from '@/lib/language';
import styles from './GradeCard.module.css';

interface Props {
  grade: number;
  moduleCount: number;
  lang?: Language;
}

export default function GradeCard({ grade, moduleCount, lang = 'en' }: Props) {
  const label = GRADE_LABELS[lang][grade] ?? `Year ${grade}`;
  const ui = UI_LABELS[lang];

  return (
    <Link href={`/${grade}`} className={styles.card}>
      <article>
        <strong>{label}</strong>
        <p>
          {moduleCount} {moduleCount === 1 ? ui.activity : ui.activities}
        </p>
      </article>
    </Link>
  );
}
