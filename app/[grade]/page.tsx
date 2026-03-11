import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSubjectsForGrade, getModulesByGradeAndSubject } from '@/modules/registry';
import { GRADE_LABELS, SUBJECT_LABELS, UI_LABELS, Subject } from '@/lib/types';
import { getLanguage } from '@/lib/language-server';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './page.module.css';

interface Props {
  params: Promise<{ grade: string }>;
}

export default async function GradePage({ params }: Props) {
  const { grade: gradeParam } = await params;
  const grade = parseInt(gradeParam, 10);
  const lang = await getLanguage();

  if (isNaN(grade)) return notFound();

  const subjects = getSubjectsForGrade(grade);
  if (subjects.length === 0) return notFound();

  const ui = UI_LABELS[lang];
  const gradeLabel = GRADE_LABELS[lang][grade] ?? `Year ${grade}`;

  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: ui.home, href: '/' },
          { label: gradeLabel },
        ]}
      />

      <hgroup>
        <h1>{gradeLabel}</h1>
        <p>{ui.chooseSubject}</p>
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
                <strong>{SUBJECT_LABELS[lang][subject as Subject] ?? subject}</strong>
                <p>
                  {count} {count === 1 ? ui.activity : ui.activities}
                </p>
              </article>
            </Link>
          );
        })}
      </div>
    </>
  );
}
