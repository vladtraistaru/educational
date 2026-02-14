import Link from 'next/link';
import { ModuleConfig, SUBJECT_LABELS } from '@/lib/types';
import styles from './ModuleCard.module.css';

interface Props {
  module: ModuleConfig;
}

export default function ModuleCard({ module }: Props) {
  return (
    <Link href={`/activity/${module.slug}`} className={styles.card}>
      <article>
        <header>
          <strong>{module.title}</strong>
          <small className={styles.subject}>
            {SUBJECT_LABELS[module.subject]}
          </small>
        </header>
        <p>{module.description}</p>
      </article>
    </Link>
  );
}
