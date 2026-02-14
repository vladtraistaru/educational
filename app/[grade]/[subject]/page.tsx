import { notFound } from 'next/navigation';
import { getModulesByGradeAndSubject } from '@/modules/registry';
import { GRADE_LABELS, SUBJECT_LABELS, Subject } from '@/lib/types';
import Breadcrumb from '@/components/Breadcrumb';
import ModuleCard from '@/components/ModuleCard';
import styles from './page.module.css';

interface Props {
  params: Promise<{ grade: string; subject: string }>;
}

export default async function SubjectPage({ params }: Props) {
  const { grade: gradeParam, subject: subjectParam } = await params;
  const grade = parseInt(gradeParam, 10);

  if (isNaN(grade)) return notFound();

  const modules = getModulesByGradeAndSubject(grade, subjectParam);
  if (modules.length === 0) return notFound();

  const gradeLabel = GRADE_LABELS[grade] ?? `Year ${grade}`;
  const subjectLabel =
    SUBJECT_LABELS[subjectParam as Subject] ?? subjectParam;

  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: gradeLabel, href: `/${grade}` },
          { label: subjectLabel },
        ]}
      />

      <hgroup>
        <h1>{subjectLabel}</h1>
        <p>
          {gradeLabel} — {modules.length}{' '}
          {modules.length === 1 ? 'activity' : 'activities'}
        </p>
      </hgroup>

      <div className={styles.grid}>
        {modules.map((mod) => (
          <ModuleCard key={mod.slug} module={mod} />
        ))}
      </div>
    </>
  );
}
