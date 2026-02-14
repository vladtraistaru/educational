'use client';

import { getActivityComponent, getModuleBySlug } from '@/modules/registry';
import ActivityShell from '@/components/ActivityShell';

interface Props {
  slug: string;
}

export default function ActivityLoader({ slug }: Props) {
  const Component = getActivityComponent(slug);
  const mod = getModuleBySlug(slug);

  if (!Component) {
    return <p>Activity not found.</p>;
  }

  return (
    <ActivityShell description={mod?.description}>
      <Component />
    </ActivityShell>
  );
}
