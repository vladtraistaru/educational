import { notFound } from 'next/navigation';
import { getModuleBySlug, getModuleMetadata } from '@/modules/registry';
import { UI_LABELS, SUBJECT_LABELS } from '@/lib/types';
import { getLanguage } from '@/lib/language-server';
import Breadcrumb from '@/components/Breadcrumb';
import ActivityLoader from './ActivityLoader';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ActivityPage({ params }: Props) {
  const { slug } = await params;
  const lang = await getLanguage();
  const mod = getModuleBySlug(slug);

  if (!mod) return notFound();

  const meta = getModuleMetadata(slug, lang);
  const title = meta?.title ?? mod.title;

  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: UI_LABELS[lang].home, href: '/' },
          { label: SUBJECT_LABELS[lang][mod.subject] },
          { label: title },
        ]}
      />

      <ActivityLoader slug={slug} />
    </>
  );
}
