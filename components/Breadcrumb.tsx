'use client';

import { useEffect } from 'react';
import { useBreadcrumbs } from '@/lib/breadcrumb';

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  const { setCrumbs } = useBreadcrumbs();

  useEffect(() => {
    setCrumbs(crumbs);
    return () => setCrumbs([]);
  }, [crumbs, setCrumbs]);

  return null;
}
