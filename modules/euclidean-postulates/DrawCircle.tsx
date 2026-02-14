'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Activity.module.css';

const CIRCLE_COLOR = '#6c5ce7';
const COLORS = ['#6c5ce7', '#a55eea', '#fd79a8', '#00cec9', '#e17055'];

interface Circle {
  cx: number;
  cy: number;
  r: number;
  color: string;
  key: number;
}

export default function DrawCircle() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [drawing, setDrawing] = useState<{ cx: number; cy: number } | null>(null);
  const [currentRadius, setCurrentRadius] = useState(0);
  const [nextKey, setNextKey] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const toSvg = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 640,
      y: ((clientY - rect.top) / rect.height) * 400,
    };
  }, []);

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const { x, y } = toSvg(clientX, clientY);
      setDrawing({ cx: x, cy: y });
      setCurrentRadius(0);
    },
    [toSvg],
  );

  useEffect(() => {
    if (!drawing) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const { x, y } = toSvg(clientX, clientY);
      const r = Math.hypot(x - drawing.cx, y - drawing.cy);
      setCurrentRadius(r);
    };

    const handleEnd = () => {
      if (currentRadius > 10) {
        const color = COLORS[nextKey % COLORS.length];
        setCircles((prev) => [
          ...prev,
          { cx: drawing.cx, cy: drawing.cy, r: currentRadius, color, key: nextKey },
        ]);
        setNextKey((k) => k + 1);
      }
      setDrawing(null);
      setCurrentRadius(0);
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
  }, [drawing, currentRadius, toSvg, nextKey]);

  const reset = useCallback(() => {
    setCircles([]);
    setDrawing(null);
    setCurrentRadius(0);
    setNextKey(0);
  }, []);

  return (
    <div className={styles.svgContainer}>
      <svg
        ref={svgRef}
        viewBox="0 0 640 400"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        {/* Stamped circles */}
        {circles.map((c) => {
          const circumference = 2 * Math.PI * c.r;
          return (
            <circle
              key={c.key}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              fill="none"
              stroke={c.color}
              strokeWidth={4}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              className={styles.circleAnim}
            />
          );
        })}

        {/* Circle being drawn */}
        {drawing && currentRadius > 5 && (
          <>
            <circle
              cx={drawing.cx}
              cy={drawing.cy}
              r={currentRadius}
              fill="none"
              stroke={CIRCLE_COLOR}
              strokeWidth={3}
              strokeDasharray="8 4"
              opacity={0.7}
            />
            {/* Radius line */}
            <line
              x1={drawing.cx}
              y1={drawing.cy}
              x2={drawing.cx + currentRadius}
              y2={drawing.cy}
              stroke={CIRCLE_COLOR}
              strokeWidth={2}
              strokeDasharray="4 4"
              opacity={0.5}
            />
          </>
        )}

        {/* Center dot of current drawing */}
        {drawing && (
          <circle cx={drawing.cx} cy={drawing.cy} r={6} fill={CIRCLE_COLOR} />
        )}

        {/* Center dots of stamped circles */}
        {circles.map((c) => (
          <circle key={`dot-${c.key}`} cx={c.cx} cy={c.cy} r={5} fill={c.color} />
        ))}

        {/* Clear button */}
        {circles.length > 0 && (
          <g
            onClick={(e) => {
              e.stopPropagation();
              reset();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ cursor: 'pointer' }}
          >
            <rect x={540} y={10} width={90} height={36} rx={10} fill="#dfe6e9" />
            <text x={585} y={34} textAnchor="middle" fontSize={14} fontWeight={700} fill="#636e72">
              Clear
            </text>
          </g>
        )}

        {/* Hint */}
        {circles.length === 0 && !drawing && (
          <text x={320} y={370} textAnchor="middle" fontSize={16} fill="#b2bec3" fontWeight={600}>
            Click and drag to draw a circle
          </text>
        )}
      </svg>
    </div>
  );
}
