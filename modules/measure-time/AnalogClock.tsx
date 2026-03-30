'use client';

import { useCallback, useRef, useState } from 'react';
import type { ClockTime, MinuteStep } from './timeItems';
import {
  anglesFromTime,
  minutesFromAngleDeg,
  timeFromHourHandAngle,
} from './timeItems';
import styles from './Activity.module.css';

function circularDiffDeg(a: number, b: number): number {
  let d = Math.abs(a - b) % 360;
  if (d > 180) d = 360 - d;
  return d;
}

function clientAngleDeg(clientX: number, clientY: number, el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const dx = clientX - cx;
  const dy = clientY - cy;
  let deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

export interface AnalogClockProps {
  time: ClockTime;
  size?: number;
  interactive?: boolean;
  minuteStep: MinuteStep;
  onChange?: (t: ClockTime) => void;
  className?: string;
}

export default function AnalogClock({
  time,
  size = 220,
  interactive = false,
  minuteStep,
  onChange,
  className,
}: AnalogClockProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<'hour' | 'minute' | null>(null);
  const { hourDeg, minuteDeg } = anglesFromTime(time);

  const applyMinuteAngle = useCallback(
    (deg: number) => {
      if (!onChange) return;
      const m = minutesFromAngleDeg(deg, minuteStep);
      onChange({ hours: time.hours, minutes: m });
    },
    [minuteStep, onChange, time.hours],
  );

  const applyHourAngle = useCallback(
    (deg: number) => {
      if (!onChange) return;
      onChange(timeFromHourHandAngle(deg, time));
    },
    [onChange, time],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive || !wrapRef.current || !onChange) return;
    e.preventDefault();
    const deg = clientAngleDeg(e.clientX, e.clientY, wrapRef.current);
    const pickMinute = circularDiffDeg(deg, minuteDeg);
    const pickHour = circularDiffDeg(deg, hourDeg);
    const mode = pickMinute <= pickHour ? 'minute' : 'hour';
    setDrag(mode);
    e.currentTarget.setPointerCapture(e.pointerId);
    if (mode === 'minute') applyMinuteAngle(deg);
    else applyHourAngle(deg);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag || !wrapRef.current) return;
    const deg = clientAngleDeg(e.clientX, e.clientY, wrapRef.current);
    if (drag === 'minute') applyMinuteAngle(deg);
    else applyHourAngle(deg);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setDrag(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const r = size / 2 - 8;
  const tickLen = { major: 14, minor: 7 };

  return (
    <div
      ref={wrapRef}
      className={`${styles.clockWrap} ${className ?? ''}`}
      style={{ width: size, height: size }}
      onPointerDown={interactive ? onPointerDown : undefined}
      onPointerMove={interactive ? onPointerMove : undefined}
      onPointerUp={interactive ? onPointerUp : undefined}
      onPointerCancel={interactive ? onPointerUp : undefined}
      data-interactive={interactive ? 'true' : undefined}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={styles.clockSvg}
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={styles.clockFace}
        />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i * 6 * Math.PI) / 180;
          const x1 = size / 2 + Math.sin(a) * (r - tickLen.major);
          const y1 = size / 2 - Math.cos(a) * (r - tickLen.major);
          const len = i % 5 === 0 ? tickLen.major : tickLen.minor;
          const x0 = size / 2 + Math.sin(a) * (r - len);
          const y0 = size / 2 - Math.cos(a) * (r - len);
          return (
            <line
              key={i}
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              className={i % 5 === 0 ? styles.tickMajor : styles.tickMinor}
            />
          );
        })}
        <text
          x={size / 2}
          y={size / 2 - r + 28}
          textAnchor="middle"
          className={styles.clockNumber}
        >
          12
        </text>
        <text
          x={size / 2 + r - 22}
          y={size / 2 + 6}
          textAnchor="middle"
          className={styles.clockNumber}
        >
          3
        </text>
        <text
          x={size / 2}
          y={size / 2 + r - 14}
          textAnchor="middle"
          className={styles.clockNumber}
        >
          6
        </text>
        <text
          x={size / 2 - r + 28}
          y={size / 2 + 6}
          textAnchor="middle"
          className={styles.clockNumber}
        >
          9
        </text>
        <g transform={`translate(${size / 2},${size / 2})`}>
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={-(r - 36)}
            className={styles.handHour}
            transform={`rotate(${hourDeg})`}
          />
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={-(r - 12)}
            className={styles.handMinute}
            transform={`rotate(${minuteDeg})`}
          />
          <circle cx={0} cy={0} r={6} className={styles.handCap} />
        </g>
      </svg>
    </div>
  );
}
