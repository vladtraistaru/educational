import { getAllModuleMetadata, getAllSubjects, getSubjectCounts } from '@/modules/registry';
import { getLanguage } from '@/lib/language-server';
import Hero from '@/components/Hero';
import ActivityBrowser from '@/components/ActivityBrowser';

export default async function HomePage() {
  const lang = await getLanguage();
  const subjects = getAllSubjects();
  const counts = getSubjectCounts();
  const allModules = getAllModuleMetadata(lang);

  return (
    <>
      <Hero lang={lang} moduleCount={allModules.length} subjectCount={subjects.length} />
      <ActivityBrowser lang={lang} modules={allModules} subjects={subjects} counts={counts} />
    </>
  );
}
