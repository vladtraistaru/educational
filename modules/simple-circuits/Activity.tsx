'use client';

import type { ActivityProps } from '@/lib/types';
import shared from '@/modules/activity.module.css';

export default function SimpleCircuits(_props: ActivityProps) {
  return (
    <div className={shared.activityArea}>
      <p>Coming soon.</p>
    </div>
  );
}
