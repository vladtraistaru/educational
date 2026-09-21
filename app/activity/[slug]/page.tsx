import { notFound } from 'next/navigation';
import { getModuleBySlug } from '@/modules/registry';
import ActivityLoader from './ActivityLoader';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ActivityPage({ params }: Props) {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);

  if (!mod) return notFound();

  return <ActivityLoader slug={slug} />;
}
