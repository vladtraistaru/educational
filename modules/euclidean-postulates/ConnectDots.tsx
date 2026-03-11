'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/lib/language';
import translations from './translations';
import styles from './Activity.module.css';

const DOTS = [
  { x: 100, y: 80 },
  { x: 300, y: 60 },
  { x: 520, y: 100 },
  { x: 160, y: 220 },
  { x: 400, y: 200 },
  { x: 560, y: 260 },
  { x: 80, y: 340 },
  { x: 340, y: 350 },
];

const DOT_RADIUS = 16;
const DOT_COLOR = '#e17055';

interface Line {
  from: number;
  to: number;
  key: number;
}

export default function ConnectDots() {
  const { language } = useLanguage();
  const t = translations[language];
  const [selected, setSelected] = useState<number | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [nextKey, setNextKey] = useState(0);

  const handleDotClick = useCallback(
    (index: number) => {
      if (selected === null) {
        setSelected(index);
        return;
      }

      if (selected === index) {
        setSelected(null);
        return;
      }

      setLines((prev) => [...prev, { from: selected, to: index, key: nextKey }]);
      setNextKey((k) => k + 1);
      setSelected(null);
    },
    [selected, nextKey],
  );

  const reset = useCallback(() => {
    setLines([]);
    setSelected(null);
    setNextKey(0);
  }, []);

  return (
    <div className={styles.svgContainer}>
      <svg viewBox="0 0 640 400">
        {lines.map((line) => {
          const a = DOTS[line.from];
          const b = DOTS[line.to];
          const length = Math.hypot(b.x - a.x, b.y - a.y);
          return (
            <line
              key={line.key}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={DOT_COLOR}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={length}
              strokeDashoffset={length}
              className={styles.lineAnim}
            />
          );
        })}

        {DOTS.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={selected === i ? DOT_RADIUS + 4 : DOT_RADIUS}
            fill={selected === i ? '#d63031' : DOT_COLOR}
            className={`${styles.dot} ${selected === i ? styles.dotSelected : ''}`}
            onClick={() => handleDotClick(i)}
          />
        ))}

        {/* Reset button inside SVG */}
        <g onClick={reset} style={{ cursor: 'pointer' }}>
          <rect x={540} y={10} width={90} height={36} rx={10} fill="#dfe6e9" />
          <text
            x={585}
            y={34}
            textAnchor="middle"
            fontSize={14}
            fontWeight={700}
            fill="#636e72"
          >
            {t.clear}
          </text>
        </g>
      </svg>
    </div>
  );
}
