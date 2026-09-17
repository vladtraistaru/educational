import { getAllModuleMetadata, getAllSubjects, getSubjectCounts } from '@/modules/registry';
import { UI_LABELS } from '@/lib/types';
import { getLanguage } from '@/lib/language-server';
import { getHistory } from '@/lib/history-server';
import ModuleCard from '@/components/ModuleCard';
import Hero from '@/components/Hero';
import ActivityBrowser from '@/components/ActivityBrowser';
import styles from './page.module.css';

export default async function HomePage() {
  const lang = await getLanguage();
  const ui = UI_LABELS[lang];
  const subjects = getAllSubjects();
  const counts = getSubjectCounts();
  const allModules = getAllModuleMetadata(lang);

  const history = await getHistory();
  const recentlyPlayed = history
    .map((entry) => {
      const mod = allModules.find((m) => m.slug === entry.slug);
      return mod ? { mod, visits: entry.visits } : null;
    })
    .filter((x): x is { mod: (typeof allModules)[number]; visits: number } => x !== null)
    .slice(0, 4);

  return (
    <>
      <Hero lang={lang} moduleCount={allModules.length} subjectCount={subjects.length} />

      {recentlyPlayed.length > 0 && (
        <section className={styles.rail}>
          <h2 className={styles.railHeading}>{ui.continueExploring}</h2>
          <div className={styles.railGrid}>
            {recentlyPlayed.map(({ mod, visits }) => (
              <ModuleCard
                key={mod.slug}
                module={mod}
                lang={lang}
                title={mod.title}
                description={mod.description}
                historyNote={
                  visits <= 1
                    ? ui.playedOnce
                    : ui.playedTimes.replace('{count}', String(visits))
                }
              />
            ))}
          </div>
        </section>
      )}

      <ActivityBrowser lang={lang} modules={allModules} subjects={subjects} counts={counts} />
    </>
  );
}
