'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '@/lib/language';
import translations from './translations';
import styles from './Activity.module.css';

const LINE_COLOR = '#00b894';
const INITIAL_LEFT = 220;
const INITIAL_RIGHT = 420;

export default function ExtendLine() {
  const { language } = useLanguage();
  const t = translations[language];
  const [left, setLeft] = useState(INITIAL_LEFT);
  const [right, setRight] = useState(INITIAL_RIGHT);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<'left' | 'right' | null>(null);

  const toSvgX = useCallback((clientX: number): number => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 640;
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const x = Math.max(20, Math.min(620, toSvgX(clientX)));

      if (dragging.current === 'left') {
        setLeft(Math.min(x, right - 30));
      } else {
        setRight(Math.max(x, left + 30));
      }
    };

    const handleEnd = () => {
      dragging.current = null;
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
  }, [toSvgX, left, right]);

  const startDrag = (side: 'left' | 'right') => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    dragging.current = side;
  };

  const y = 200;
  const arrowSize = 14;
  const extended = left < INITIAL_LEFT || right > INITIAL_RIGHT;

  return (
    <div className={styles.svgContainer}>
      <svg ref={svgRef} viewBox="0 0 640 400">
        {/* Main line */}
        <line
          x1={left}
          y1={y}
          x2={right}
          y2={y}
          stroke={LINE_COLOR}
          strokeWidth={6}
          strokeLinecap="round"
        />

        {/* Left arrow (appears when extended) */}
        {left < INITIAL_LEFT - 10 && (
          <polygon
            points={`${left - arrowSize},${y} ${left + 4},${y - arrowSize} ${left + 4},${y + arrowSize}`}
            fill={LINE_COLOR}
          />
        )}

        {/* Right arrow (appears when extended) */}
        {right > INITIAL_RIGHT + 10 && (
          <polygon
            points={`${right + arrowSize},${y} ${right - 4},${y - arrowSize} ${right - 4},${y + arrowSize}`}
            fill={LINE_COLOR}
          />
        )}

        {/* Left handle */}
        <circle
          cx={left}
          cy={y}
          r={18}
          fill="#fff"
          stroke={LINE_COLOR}
          strokeWidth={4}
          className={styles.handle}
          onMouseDown={startDrag('left')}
          onTouchStart={startDrag('left')}
        />
        <text x={left} y={y + 1} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill={LINE_COLOR} style={{ pointerEvents: 'none' }}>
          &#x2190;
        </text>

        {/* Right handle */}
        <circle
          cx={right}
          cy={y}
          r={18}
          fill="#fff"
          stroke={LINE_COLOR}
          strokeWidth={4}
          className={styles.handle}
          onMouseDown={startDrag('right')}
          onTouchStart={startDrag('right')}
        />
        <text x={right} y={y + 1} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill={LINE_COLOR} style={{ pointerEvents: 'none' }}>
          &#x2192;
        </text>

        {!extended && (
          <text x={320} y={300} textAnchor="middle" fontSize={16} fill="#b2bec3" fontWeight={600}>
            {t.dragHandles}
          </text>
        )}
        {extended && (
          <text x={320} y={300} textAnchor="middle" fontSize={16} fill={LINE_COLOR} fontWeight={600}>
            {t.lineKeepsGoing}
          </text>
        )}
      </svg>
    </div>
  );
}
