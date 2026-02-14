import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

const componentMap: Record<string, ComponentType> = {
  'number-scale-explorer': dynamic(
    () => import('./number-scale-explorer/Activity'),
  ),
  'shape-sorter': dynamic(() => import('./shape-sorter/Activity')),
  'animal-habitats': dynamic(() => import('./animal-habitats/Activity')),
  'word-builder': dynamic(() => import('./word-builder/Activity')),
  'times-table-challenge': dynamic(
    () => import('./times-table-challenge/Activity'),
  ),
};

export function getActivityComponent(slug: string): ComponentType | null {
  return componentMap[slug] ?? null;
}
