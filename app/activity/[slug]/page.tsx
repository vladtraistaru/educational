import { notFound } from 'next/navigation';
import { getModuleBySlug } from '@/modules/registry';
import { UI_LABELS } from '@/lib/types';
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

  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: UI_LABELS[lang].home, href: '/' },
          { label: mod.title },
        ]}
      />

      <h1>{mod.title}</h1>

      <ActivityLoader slug={slug} />
    </>
  );
}
