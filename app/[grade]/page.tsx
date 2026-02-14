import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSubjectsForGrade, getModulesByGradeAndSubject } from '@/modules/registry';
import { GRADE_LABELS, SUBJECT_LABELS, Subject } from '@/lib/types';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './page.module.css';

interface Props {
  params: Promise<{ grade: string }>;
}

export default async function GradePage({ params }: Props) {
  const { grade: gradeParam } = await params;
  const grade = parseInt(gradeParam, 10);

  if (isNaN(grade)) return notFound();

  const subjects = getSubjectsForGrade(grade);
  if (subjects.length === 0) return notFound();

  const gradeLabel = GRADE_LABELS[grade] ?? `Year ${grade}`;

  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: gradeLabel },
        ]}
      />

      <hgroup>
        <h1>{gradeLabel}</h1>
        <p>Choose a subject</p>
      </hgroup>

      <div className={styles.grid}>
        {subjects.map((subject) => {
          const count = getModulesByGradeAndSubject(grade, subject).length;
          return (
            <Link
              key={subject}
              href={`/${grade}/${subject}`}
              className={styles.card}
            >
              <article>
                <strong>{SUBJECT_LABELS[subject as Subject] ?? subject}</strong>
                <p>
                  {count} {count === 1 ? 'activity' : 'activities'}
                </p>
              </article>
            </Link>
          );
        })}
      </div>
    </>
  );
}
