'use client';

import { useState, useCallback } from 'react';
import type { ActivityProps } from '@/lib/types';
import Controls from './Controls';
import NumberLine from './NumberLine';
import BreakdownPanel from './BreakdownPanel';

const MAX_CURSORS = 5;
const MIN_CURSORS = 1;
const DEFAULT_SCALE = 100;
const DEFAULT_POSITIONS = [50];

export default function NumberScaleExplorer(_props: ActivityProps) {
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [cursorPositions, setCursorPositions] =
    useState<number[]>(DEFAULT_POSITIONS);

  const handleCursorMove = useCallback(
    (index: number, percent: number) => {
      setCursorPositions((prev) => {
        const next = [...prev];
        next[index] = percent;
        return next;
      });
    },
    [],
  );

  const addCursor = useCallback(() => {
    setCursorPositions((prev) => {
      if (prev.length >= MAX_CURSORS) return prev;

      const sorted = [...prev].sort((a, b) => a - b);
      let maxGap = sorted[0];
      let insertAt = sorted[0] / 2;

      for (let i = 0; i < sorted.length - 1; i++) {
        const gap = sorted[i + 1] - sorted[i];
        if (gap > maxGap) {
          maxGap = gap;
          insertAt = sorted[i] + gap / 2;
        }
      }

      const lastGap = 100 - sorted[sorted.length - 1];
      if (lastGap > maxGap) {
        insertAt = sorted[sorted.length - 1] + lastGap / 2;
      }

      return [...prev, insertAt];
    });
  }, []);

  const removeCursor = useCallback(() => {
    setCursorPositions((prev) =>
      prev.length <= MIN_CURSORS ? prev : prev.slice(0, -1),
    );
  }, []);

  const reset = useCallback(() => {
    setScale(DEFAULT_SCALE);
    setCursorPositions(DEFAULT_POSITIONS);
  }, []);

  return (
    <>
      <Controls
        scale={scale}
        cursorCount={cursorPositions.length}
        maxCursors={MAX_CURSORS}
        minCursors={MIN_CURSORS}
        onScaleChange={setScale}
        onAddCursor={addCursor}
        onRemoveCursor={removeCursor}
        onReset={reset}
      />

      <NumberLine
        scale={scale}
        cursorPositions={cursorPositions}
        onCursorMove={handleCursorMove}
      />

      <BreakdownPanel cursorPositions={cursorPositions} scale={scale} />
    </>
  );
}
