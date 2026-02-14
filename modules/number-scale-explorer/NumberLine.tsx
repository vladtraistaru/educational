import { useRef, useEffect, useCallback } from 'react';
import styles from './Activity.module.css';

const SEGMENT_COLORS = [
  styles.segment1,
  styles.segment2,
  styles.segment3,
  styles.segment4,
  styles.segment5,
  styles.segment6,
];

interface NumberLineProps {
  scale: number;
  cursorPositions: number[];
  onCursorMove: (index: number, percent: number) => void;
}

export default function NumberLine({
  scale,
  cursorPositions,
  onCursorMove,
}: NumberLineProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<number | null>(null);

  const calcPercent = useCallback(
    (clientX: number): number => {
      const rect = lineRef.current?.getBoundingClientRect();
      if (!rect) return 0;

      let percent = ((clientX - rect.left) / rect.width) * 100;
      percent = Math.max(0, Math.min(100, percent));

      const scaleValue = (percent / 100) * scale;
      const snapped = Math.round(scaleValue);
      return (snapped / scale) * 100;
    },
    [scale],
  );

  const clampToNeighbors = useCallback(
    (index: number, percent: number): number => {
      const sorted = cursorPositions
        .map((p, i) => ({ pos: p, index: i }))
        .sort((a, b) => a.pos - b.pos);

      const sortedIdx = sorted.findIndex((s) => s.index === index);
      const minGap = (1 / scale) * 100;

      if (sortedIdx > 0) {
        percent = Math.max(sorted[sortedIdx - 1].pos + minGap, percent);
      }
      if (sortedIdx < sorted.length - 1) {
        percent = Math.min(sorted[sortedIdx + 1].pos - minGap, percent);
      }

      return percent;
    },
    [cursorPositions, scale],
  );

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (draggingRef.current === null) return;
      e.preventDefault();

      const clientX =
        'touches' in e ? e.touches[0].clientX : e.clientX;
      let percent = calcPercent(clientX);
      percent = clampToNeighbors(draggingRef.current, percent);
      onCursorMove(draggingRef.current, percent);
    };

    const handleEnd = () => {
      draggingRef.current = null;
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [calcPercent, clampToNeighbors, onCursorMove]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.preventDefault();
    draggingRef.current = index;
  };

  const sorted = [...cursorPositions].sort((a, b) => a - b);
  const boundaries = [0, ...sorted, 100];

  const ticks = buildTicks(scale);

  return (
    <div className={styles.numberLineContainer}>
      <div className={styles.numberLineWrapper}>
        <span className={styles.scaleLabelStart}>0</span>
        <div className={styles.numberLine} ref={lineRef}>
          <div className={styles.track} />

          {/* Colored segments */}
          <div className={styles.segments}>
            {boundaries.slice(0, -1).map((start, i) => {
              const width = boundaries[i + 1] - start;
              return (
                <div
                  key={i}
                  className={`${styles.segment} ${SEGMENT_COLORS[i] ?? ''}`}
                  style={{ width: `${width}%` }}
                />
              );
            })}
          </div>

          {/* Tick marks */}
          <div className={styles.tickMarks}>
            {ticks.map((tick) => (
              <div
                key={tick.value}
                className={tick.major ? styles.tickMajor : styles.tickMinor}
                style={{ left: `${tick.percent}%` }}
              >
                {tick.showLabel && (
                  <span className={styles.tickLabel}>{tick.value}</span>
                )}
              </div>
            ))}
          </div>

          {/* Draggable cursors */}
          <div className={styles.cursors}>
            {cursorPositions.map((pos, i) => {
              const value = Math.round((pos / 100) * scale);
              const isDragging = draggingRef.current === i;
              return (
                <div
                  key={i}
                  className={`${styles.cursor} ${isDragging ? styles.cursorDragging : ''}`}
                  style={{ left: `${pos}%` }}
                  onMouseDown={(e) => startDrag(e, i)}
                  onTouchStart={(e) => startDrag(e, i)}
                >
                  <span className={styles.cursorValue}>{value}</span>
                </div>
              );
            })}
          </div>
        </div>
        <span className={styles.scaleLabelEnd}>{scale}</span>
      </div>
    </div>
  );
}

interface Tick {
  value: number;
  percent: number;
  major: boolean;
  showLabel: boolean;
}

function buildTicks(scale: number): Tick[] {
  let majorStep: number;
  let minorStep: number;

  if (scale <= 20) {
    majorStep = 5;
    minorStep = 1;
  } else if (scale <= 100) {
    majorStep = 10;
    minorStep = 5;
  } else if (scale <= 500) {
    majorStep = 50;
    minorStep = 10;
  } else {
    majorStep = 100;
    minorStep = 50;
  }

  const ticks: Tick[] = [];
  for (let i = 0; i <= scale; i += minorStep) {
    const major = i % majorStep === 0;
    const showLabel = major && i !== 0 && i !== scale;
    ticks.push({
      value: i,
      percent: (i / scale) * 100,
      major,
      showLabel,
    });
  }
  return ticks;
}
