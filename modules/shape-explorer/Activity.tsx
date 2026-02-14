'use client';

import { useState, useCallback } from 'react';
import type { ActivityProps } from '@/lib/types';
import { shapes } from './shapes';
import ShapeSelector from './ShapeSelector';
import ShapeDisplay from './ShapeDisplay';
import ShapeProperties from './ShapeProperties';

export default function ShapeExplorer(_props: ActivityProps) {
  const [selectedId, setSelectedId] = useState(shapes[0].id);

  const selectedShape = shapes.find((s) => s.id === selectedId) ?? shapes[0];

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return (
    <>
      <ShapeSelector
        shapes={shapes}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      <ShapeDisplay shape={selectedShape} />

      <ShapeProperties shape={selectedShape} />
    </>
  );
}
