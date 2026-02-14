import { useState, useEffect, useCallback } from 'react';
import type { Shape } from './shapes';
import styles from './Activity.module.css';

interface ShapeDisplayProps {
  shape: Shape;
}

const HIGHLIGHT_INTERVAL_MS = 650;
const DONE_PAUSE_MS = 2000;

export default function ShapeDisplay({ shape }: ShapeDisplayProps) {
  const [highlightCount, setHighlightCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    setIsCounting(false);
    setHighlightCount(0);
  }, [shape.id]);

  useEffect(() => {
    if (!isCounting) return;

    if (highlightCount >= shape.sides) {
      const timer = setTimeout(() => {
        setIsCounting(false);
        setHighlightCount(0);
      }, DONE_PAUSE_MS);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setHighlightCount((prev) => prev + 1);
    }, HIGHLIGHT_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [isCounting, highlightCount, shape.sides]);

  const startCounting = useCallback(() => {
    setHighlightCount(0);
    setIsCounting(true);
  }, []);

  const hasSides = shape.sides > 0;
  const counting = isCounting && highlightCount < shape.sides;
  const done = isCounting && highlightCount >= shape.sides;
  const fillOpacity = counting ? 0.15 : 1;
  const pointsStr = shape.vertices.map((v) => v.join(',')).join(' ');

  return (
    <div className={styles.displayContainer}>
      <h2 className={styles.shapeName} style={{ color: shape.color }}>
        {shape.name}
      </h2>

      <svg viewBox="0 0 200 200" className={styles.displaySvg}>
        {shape.vertices.length > 0 ? (
          <polygon
            points={pointsStr}
            fill={shape.color}
            fillOpacity={fillOpacity}
            stroke={done ? '#FFD700' : shape.color}
            strokeWidth={done ? 5 : 3}
            strokeLinejoin="round"
            style={{ transition: 'fill-opacity 0.3s, stroke 0.3s' }}
          />
        ) : shape.id === 'circle' ? (
          <circle
            cx="100"
            cy="100"
            r="80"
            fill={shape.color}
            fillOpacity={fillOpacity}
          />
        ) : (
          <ellipse
            cx="100"
            cy="100"
            rx="90"
            ry="60"
            fill={shape.color}
            fillOpacity={fillOpacity}
          />
        )}

        {hasSides &&
          isCounting &&
          shape.vertices.map((vertex, i) => {
            const next = shape.vertices[(i + 1) % shape.vertices.length];
            const highlighted = i < highlightCount;
            return (
              <line
                key={i}
                x1={vertex[0]}
                y1={vertex[1]}
                x2={next[0]}
                y2={next[1]}
                stroke={highlighted ? '#FFD700' : '#ccc'}
                strokeWidth={highlighted ? 7 : 2}
                strokeLinecap="round"
                style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
              />
            );
          })}

        {isCounting && highlightCount > 0 && (
          <>
            <circle cx="100" cy="100" r="28" fill="rgba(0,0,0,0.7)" />
            <text
              x="100"
              y="100"
              textAnchor="middle"
              dominantBaseline="central"
              fill={done ? '#FFD700' : '#fff'}
              fontSize="32"
              fontWeight="800"
            >
              {highlightCount}
            </text>
          </>
        )}
      </svg>

      {hasSides ? (
        <button
          className={styles.countButton}
          onClick={startCounting}
          disabled={isCounting}
        >
          {done ? 'Done!' : counting ? 'Counting...' : 'Count the sides!'}
        </button>
      ) : (
        <p className={styles.curvedNote}>
          This shape has 1 curved edge and 0 straight sides
        </p>
      )}
    </div>
  );
}
