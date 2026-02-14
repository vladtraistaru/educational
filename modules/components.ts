import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

const componentMap: Record<string, ComponentType> = {
  'number-scale-explorer': dynamic(
    () => import('./number-scale-explorer/Activity'),
  ),
};

export function getActivityComponent(slug: string): ComponentType | null {
  return componentMap[slug] ?? null;
}
