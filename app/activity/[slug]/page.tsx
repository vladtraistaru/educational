import { notFound } from 'next/navigation';
import { getModuleBySlug } from '@/modules/registry';
import { GRADE_LABELS } from '@/lib/types';
import Breadcrumb from '@/components/Breadcrumb';
import ActivityLoader from './ActivityLoader';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ActivityPage({ params }: Props) {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);

  if (!mod) return notFound();

  const firstGrade = mod.grades[0];
  const gradeLabel = GRADE_LABELS[firstGrade] ?? `Year ${firstGrade}`;

  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: gradeLabel, href: `/${firstGrade}` },
          { label: mod.title },
        ]}
      />

      <h1>{mod.title}</h1>

      <ActivityLoader slug={slug} />
    </>
  );
}
