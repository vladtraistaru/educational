'use client';

import { useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import { shapes } from './shapes';
import ShapeSelector from './ShapeSelector';
import ShapeViewer from './ShapeViewer';
import ShapeInfo from './ShapeInfo';

export default function ShapeExplorer(_props: ActivityProps) {
  const [selectedId, setSelectedId] = useState('cube');
  const shape = shapes.find((s) => s.id === selectedId) ?? shapes[0];

  return (
    <>
      <ShapeSelector selectedId={selectedId} onSelect={setSelectedId} />
      <ShapeViewer shape={shape} />
      <ShapeInfo shape={shape} />
    </>
  );
}
