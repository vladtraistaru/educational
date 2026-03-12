'use client';

import { useMemo } from 'react';
import { getOnesDigitCycle, ONES_DIGIT_COLORS } from './patterns';
import styles from './Activity.module.css';

const SIZE = 200;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 80;
const DOT_R = 14;

function pointAt(digit: number): { x: number; y: number } {
  const angle = (digit / 10) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CX + RADIUS * Math.cos(angle),
    y: CY + RADIUS * Math.sin(angle),
  };
}

interface DigitStarProps {
  number: number;
}

export default function DigitStar({ number }: DigitStarProps) {
  const cycle = useMemo(() => getOnesDigitCycle(number), [number]);

  const lines = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < cycle.length - 1; i++) {
      const from = pointAt(cycle[i]);
      const to = pointAt(cycle[i + 1]);
      result.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y });
    }
    return result;
  }, [cycle]);

  const dots = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ digit: i, ...pointAt(i) })),
    [],
  );

  return (
    <div className={styles.digitStarWrapper}>
      <svg
        className={styles.digitStarSvg}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={ONES_DIGIT_COLORS[cycle[i]]}
            strokeWidth={2}
            strokeOpacity={0.6}
          />
        ))}

        {dots.map((d) => {
          const isInCycle = cycle.includes(d.digit);
          return (
            <g key={d.digit}>
              <circle
                cx={d.x} cy={d.y} r={DOT_R}
                fill={isInCycle ? ONES_DIGIT_COLORS[d.digit] : '#b2bec3'}
                opacity={isInCycle ? 1 : 0.35}
              />
              <text
                x={d.x} y={d.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize={11}
                fontWeight={800}
              >
                {d.digit}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
