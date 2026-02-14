'use client';

import { useState, useCallback } from 'react';
import styles from './Activity.module.css';

const COLORS = ['#e17055', '#00b894', '#6c5ce7', '#0984e3'];
const ARM_LEN = 60;
const ARC_R = 20;

interface AngleConfig {
  x: number;
  y: number;
  rotation: number;
  color: string;
}

const SCATTERED: AngleConfig[] = [
  { x: 140, y: 120, rotation: 0, color: COLORS[0] },
  { x: 480, y: 100, rotation: 90, color: COLORS[1] },
  { x: 160, y: 310, rotation: 270, color: COLORS[2] },
  { x: 500, y: 300, rotation: 180, color: COLORS[3] },
];

const CENTER = { x: 320, y: 200 };

function AnglePath({ x, y, rotation, color, opacity }: AngleConfig & { opacity: number }) {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      className={styles.angleGroup}
      opacity={opacity}
    >
      {/* Horizontal arm */}
      <line
        x1={0} y1={0} x2={ARM_LEN} y2={0}
        stroke={color} strokeWidth={5} className={styles.angleArm}
      />
      {/* Vertical arm */}
      <line
        x1={0} y1={0} x2={0} y2={-ARM_LEN}
        stroke={color} strokeWidth={5} className={styles.angleArm}
      />
      {/* Right angle square */}
      <polyline
        points={`${ARC_R},0 ${ARC_R},${-ARC_R} 0,${-ARC_R}`}
        fill="none" stroke={color} strokeWidth={3}
      />
    </g>
  );
}

export default function RightAngles() {
  const [compared, setCompared] = useState(false);

  const toggle = useCallback(() => setCompared((v) => !v), []);

  return (
    <div className={styles.svgContainer}>
      <svg viewBox="0 0 640 400">
        {SCATTERED.map((angle, i) => {
          const target = compared ? { x: CENTER.x, y: CENTER.y, rotation: 0 } : angle;
          return (
            <AnglePath
              key={i}
              x={target.x}
              y={target.y}
              rotation={target.rotation}
              color={angle.color}
              opacity={compared ? 0.8 : 1}
            />
          );
        })}

        {compared && (
          <text x={320} y={50} textAnchor="middle" fontSize={18} fontWeight={700} fill="#2d3436">
            They all match perfectly!
          </text>
        )}

        {/* Compare / Scatter button */}
        <g onClick={toggle} style={{ cursor: 'pointer' }}>
          <rect x={255} y={355} width={130} height={38} rx={12} fill={compared ? '#dfe6e9' : '#0984e3'} />
          <text x={320} y={380} textAnchor="middle" fontSize={15} fontWeight={700} fill={compared ? '#636e72' : '#fff'}>
            {compared ? 'Scatter' : 'Compare!'}
          </text>
        </g>
      </svg>
    </div>
  );
}
