'use client';

import { getActivityComponent } from '@/modules/components';

interface Props {
  slug: string;
}

export default function ActivityLoader({ slug }: Props) {
  const Component = getActivityComponent(slug);

  if (!Component) {
    return <p>Activity not found.</p>;
  }

  return <Component />;
}
