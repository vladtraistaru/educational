'use client';

import { getActivityComponent, getModuleMetadata } from '@/modules/registry';
import { useLanguage } from '@/lib/language';
import ActivityShell from '@/components/ActivityShell';

interface Props {
  slug: string;
}

export default function ActivityLoader({ slug }: Props) {
  const Component = getActivityComponent(slug);
  const { language } = useLanguage();
  const meta = getModuleMetadata(slug, language);

  if (!Component) {
    return <p>Activity not found.</p>;
  }

  return (
    <ActivityShell description={meta?.description}>
      <Component />
    </ActivityShell>
  );
}
