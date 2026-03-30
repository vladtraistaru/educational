import { RULER_MAX_CM } from './exercises';

const ORIGIN_X = 12;
const CM_UNIT = 14;
const HEIGHT = 52;
const BASELINE_Y = 38;

interface RulerViewProps {
  lengthCm: number;
  maxCm?: number;
  cmLabel: string;
  ariaLabel: string;
}

export default function RulerView({
  lengthCm,
  maxCm = RULER_MAX_CM,
  cmLabel,
  ariaLabel,
}: RulerViewProps) {
  const width = ORIGIN_X + maxCm * CM_UNIT + 16;
  const rulerEnd = ORIGIN_X + maxCm * CM_UNIT;
  const segmentEnd = ORIGIN_X + lengthCm * CM_UNIT;

  const labelPositions = [0, 5, 10, 15].filter((n) => n <= maxCm);

  return (
    <svg
      viewBox={`0 0 ${width} ${HEIGHT}`}
      width="100%"
      height={HEIGHT}
      role="img"
      aria-label={ariaLabel}
    >
      <line
        x1={ORIGIN_X}
        y1={BASELINE_Y}
        x2={rulerEnd}
        y2={BASELINE_Y}
        stroke="var(--pico-muted-color)"
        strokeWidth={2}
      />
      {Array.from({ length: maxCm + 1 }, (_, i) => {
        const x = ORIGIN_X + i * CM_UNIT;
        const tall = i % 5 === 0;
        const h = tall ? 14 : 8;
        return (
          <line
            key={i}
            x1={x}
            y1={BASELINE_Y}
            x2={x}
            y2={BASELINE_Y - h}
            stroke="var(--pico-color)"
            strokeWidth={tall ? 2 : 1}
          />
        );
      })}
      {labelPositions.map((n) => (
        <text
          key={n}
          x={ORIGIN_X + n * CM_UNIT}
          y={14}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill="var(--pico-muted-color)"
        >
          {n}
        </text>
      ))}
      <text
        x={rulerEnd + 4}
        y={BASELINE_Y + 4}
        fontSize={10}
        fontWeight={600}
        fill="var(--pico-muted-color)"
      >
        {cmLabel}
      </text>
      <rect
        x={ORIGIN_X}
        y={BASELINE_Y - 6}
        width={Math.max(0, segmentEnd - ORIGIN_X)}
        height={6}
        fill="#00b894"
        opacity={0.85}
        rx={1}
      />
    </svg>
  );
}
