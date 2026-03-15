import { getAllSubjects, getModulesBySubject, getModuleMetadata } from '@/modules/registry';
import { SUBJECT_LABELS, Subject } from '@/lib/types';
import { getLanguage } from '@/lib/language-server';
import ModuleCard from '@/components/ModuleCard';
import styles from './page.module.css';

export default async function HomePage() {
  const lang = await getLanguage();
  const subjects = getAllSubjects();

  return (
    <>
      {subjects.map((subject) => {
        const modules = getModulesBySubject(subject);
        return (
          <section key={subject}>
            <h2>{SUBJECT_LABELS[lang][subject as Subject] ?? subject}</h2>
            <div className={styles.grid}>
              {modules.map((mod) => {
                const meta = getModuleMetadata(mod.slug, lang);
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
        );
      })}
    </>
  );
}
