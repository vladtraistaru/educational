import Link from 'next/link';
import { GRADE_LABELS } from '@/lib/types';
import styles from './GradeCard.module.css';

interface Props {
  grade: number;
  moduleCount: number;
}

export default function GradeCard({ grade, moduleCount }: Props) {
  const label = GRADE_LABELS[grade] ?? `Year ${grade}`;

  return (
    <Link href={`/${grade}`} className={styles.card}>
      <article>
        <strong>{label}</strong>
        <p>
          {moduleCount} {moduleCount === 1 ? 'activity' : 'activities'}
        </p>
      </article>
    </Link>
  );
}
