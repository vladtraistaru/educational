import {
  getAllModuleMetadata,
  getAllSubjects,
  getRecentModules,
  getSubjectCounts,
} from '@/modules/registry';
import { UI_LABELS } from '@/lib/types';
import { getLanguage } from '@/lib/language-server';
import ModuleCard from '@/components/ModuleCard';
import Hero from '@/components/Hero';
import SubjectNav from '@/components/SubjectNav';
import ActivityBrowser from '@/components/ActivityBrowser';
import styles from './page.module.css';

export default async function HomePage() {
  const lang = await getLanguage();
  const ui = UI_LABELS[lang];
  const subjects = getAllSubjects();
  const counts = getSubjectCounts();
  const allModules = getAllModuleMetadata(lang);
  const recentModules = getRecentModules(4);

  return (
    <>
      <Hero lang={lang} moduleCount={allModules.length} subjectCount={subjects.length} />

      <SubjectNav lang={lang} subjects={subjects} counts={counts} />

      {recentModules.length > 0 && (
        <section className={styles.rail}>
          <h2 className={styles.railHeading}>{ui.newlyAdded}</h2>
          <div className={styles.railGrid}>
            {recentModules.map((mod) => {
              const meta = allModules.find((m) => m.slug === mod.slug);
              return (
                <ModuleCard
                  key={mod.slug}
                  module={mod}
                  lang={lang}
                  title={meta?.title}
                  description={meta?.description}
                />
              );
            })}
          </div>
        </section>
      )}

      <ActivityBrowser lang={lang} modules={allModules} subjects={subjects} />
    </>
  );
}
