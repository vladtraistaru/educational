'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/language';
import translations from './translations';
import styles from './Activity.module.css';

const LINE_COLOR = '#0984e3';
const GAP = 80;
const Y_TOP = 160;
const Y_BOTTOM = Y_TOP + GAP;
const MARKER_COLOR = '#fdcb6e';

export default function ParallelLines() {
  const { language } = useLanguage();
  const t = translations[language];
  const [extension, setExtension] = useState(0);
  const animating = useRef(false);
  const frameRef = useRef<number>(0);

  const lineLeft = 180 - extension;
  const lineRight = 460 + extension;
  const maxExtension = 160;

  const animate = useCallback(() => {
    if (animating.current) return;
    animating.current = true;
    setExtension(0);

    let start: number | null = null;
    const duration = 1500;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setExtension(eased * maxExtension);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        animating.current = false;
      }
    };

    frameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const markerCount = Math.floor((lineRight - lineLeft) / 100) + 1;
  const markerSpacing = (lineRight - lineLeft) / markerCount;

  return (
    <div className={styles.svgContainer}>
      <svg viewBox="0 0 640 400">
        {/* Top line */}
        <line
          x1={lineLeft} y1={Y_TOP}
          x2={lineRight} y2={Y_TOP}
          stroke={LINE_COLOR} strokeWidth={6} strokeLinecap="round"
        />

        {/* Bottom line */}
        <line
          x1={lineLeft} y1={Y_BOTTOM}
          x2={lineRight} y2={Y_BOTTOM}
          stroke={LINE_COLOR} strokeWidth={6} strokeLinecap="round"
        />

        {/* Arrows on left end */}
        {extension > 20 && (
          <>
            <polygon
              points={`${lineLeft - 12},${Y_TOP} ${lineLeft + 4},${Y_TOP - 10} ${lineLeft + 4},${Y_TOP + 10}`}
              fill={LINE_COLOR}
            />
            <polygon
              points={`${lineLeft - 12},${Y_BOTTOM} ${lineLeft + 4},${Y_BOTTOM - 10} ${lineLeft + 4},${Y_BOTTOM + 10}`}
              fill={LINE_COLOR}
            />
          </>
        )}

        {/* Arrows on right end */}
        {extension > 20 && (
          <>
            <polygon
              points={`${lineRight + 12},${Y_TOP} ${lineRight - 4},${Y_TOP - 10} ${lineRight - 4},${Y_TOP + 10}`}
              fill={LINE_COLOR}
            />
            <polygon
              points={`${lineRight + 12},${Y_BOTTOM} ${lineRight - 4},${Y_BOTTOM - 10} ${lineRight - 4},${Y_BOTTOM + 10}`}
              fill={LINE_COLOR}
            />
          </>
        )}

        {/* Distance markers */}
        {Array.from({ length: markerCount }, (_, i) => {
          const x = lineLeft + markerSpacing * (i + 0.5);
          return (
            <g key={i}>
              <line
                x1={x} y1={Y_TOP + 8}
                x2={x} y2={Y_BOTTOM - 8}
                stroke={MARKER_COLOR}
                strokeWidth={2}
                className={styles.distanceMarker}
              />
              <circle cx={x} cy={Y_TOP + 8} r={3} fill={MARKER_COLOR} />
              <circle cx={x} cy={Y_BOTTOM - 8} r={3} fill={MARKER_COLOR} />
            </g>
          );
        })}

        <text x={320} y={(Y_TOP + Y_BOTTOM) / 2 + 5} textAnchor="middle" fontSize={18} fontWeight={800} fill={MARKER_COLOR}>
          {t.sameGap}
        </text>

        {/* Train track cross ties */}
        {Array.from({ length: Math.floor((lineRight - lineLeft) / 40) }, (_, i) => {
          const x = lineLeft + 20 + i * 40;
          return (
            <line
              key={`tie-${i}`}
              x1={x} y1={Y_TOP}
              x2={x} y2={Y_BOTTOM}
              stroke={LINE_COLOR}
              strokeWidth={2}
              opacity={0.15}
            />
          );
        })}

        <g onClick={animate} style={{ cursor: 'pointer' }}>
          <rect x={255} y={310} width={130} height={38} rx={12} fill={LINE_COLOR} />
          <text x={320} y={335} textAnchor="middle" fontSize={15} fontWeight={700} fill="#fff">
            {t.extend}
          </text>
        </g>

        {extension > maxExtension * 0.9 && (
          <text x={320} y={370} textAnchor="middle" fontSize={16} fontWeight={700} fill={LINE_COLOR}>
            {t.neverTouch}
          </text>
        )}
      </svg>
    </div>
  );
}
