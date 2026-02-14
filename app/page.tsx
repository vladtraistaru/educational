import { getAllSubjects, getModulesBySubject } from '@/modules/registry';
import { SUBJECT_LABELS, Subject } from '@/lib/types';
import ModuleCard from '@/components/ModuleCard';
import styles from './page.module.css';

export default function HomePage() {
  const subjects = getAllSubjects();

  return (
    <>
      <hgroup>
        <h1>Educational Platform</h1>
        <p>Explore activities by subject</p>
      </hgroup>

      {subjects.map((subject) => {
        const modules = getModulesBySubject(subject);
        return (
          <section key={subject}>
            <h2>{SUBJECT_LABELS[subject as Subject] ?? subject}</h2>
            <div className={styles.grid}>
              {modules.map((mod) => (
                <ModuleCard key={mod.slug} module={mod} showGrades />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
