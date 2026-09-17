'use client';

import { useEffect } from 'react';
import { getActivityComponent, getModuleMetadata } from '@/modules/registry';
import { useLanguage } from '@/lib/language';
import { recordVisit } from '@/lib/history-client';
import ActivityShell from '@/components/ActivityShell';

interface Props {
  slug: string;
}

export default function ActivityLoader({ slug }: Props) {
  const Component = getActivityComponent(slug);
  const { language } = useLanguage();
  const meta = getModuleMetadata(slug, language);

  useEffect(() => {
    recordVisit(slug);
  }, [slug]);

  if (!Component) {
    return <p>Activity not found.</p>;
  }

  return (
    <ActivityShell description={meta?.description}>
      <Component />
    </ActivityShell>
  );
}
