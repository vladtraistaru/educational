import type { Side } from '@/lib/science/mechanics';
import type { Crate, PlacedWeight } from './levels';
import { MAX_DISTANCE } from './levels';
import styles from './Activity.module.css';

const PIVOT_X = 400;
const PIVOT_Y = 165;
const NOTCH = 32;
const BEAM_HALF = MAX_DISTANCE * NOTCH + 16;
const BEAM_TOP = PIVOT_Y - 8;
const BLOCK_W = 28;
const BLOCK_H = 26;
const GROUND_Y = 300;

const notchX = (side: Side, distance: number) =>
  side === 'left' ? PIVOT_X - distance * NOTCH : PIVOT_X + distance * NOTCH;

const massColor = (mass: number) => `hsl(${265 - (mass - 1) * 12}, 68%, 56%)`;

const DISTANCES = Array.from({ length: MAX_DISTANCE }, (_, i) => i + 1);
const SIDES: Side[] = ['left', 'right'];

interface BeamStageProps {
  crates: Crate[];
  placed: PlacedWeight[];
  angle: number;
  interactive: boolean;
  onNotchClick: (side: Side, distance: number) => void;
  onPlacedClick: (id: string) => void;
}

export default function BeamStage({
  crates,
  placed,
  angle,
  interactive,
  onNotchClick,
  onPlacedClick,
}: BeamStageProps) {
  const occupied = new Set(
    [...crates, ...placed].map((w) => `${w.side}:${w.distance}`),
  );

  return (
    <svg
      className={styles.stage}
      viewBox="0 0 800 370"
      role="img"
      aria-label="Balance beam"
    >
      <line
        x1={40}
        y1={GROUND_Y}
        x2={760}
        y2={GROUND_Y}
        className={styles.ground}
      />

      <g
        className={styles.beamGroup}
        style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${PIVOT_X}px ${PIVOT_Y}px` }}
      >
        <rect
          x={PIVOT_X - BEAM_HALF}
          y={BEAM_TOP}
          width={BEAM_HALF * 2}
          height={16}
          rx={6}
          className={styles.beam}
        />

        {SIDES.map((side) =>
          DISTANCES.map((distance) => {
            const x = notchX(side, distance);
            return (
              <g key={`${side}-${distance}`}>
                <line
                  x1={x}
                  y1={BEAM_TOP}
                  x2={x}
                  y2={BEAM_TOP + 16}
                  className={styles.notchTick}
                />
                <text x={x} y={PIVOT_Y + 30} className={styles.notchLabel}>
                  {distance}
                </text>
                {interactive && !occupied.has(`${side}:${distance}`) && (
                  <rect
                    x={x - NOTCH / 2}
                    y={BEAM_TOP - BLOCK_H - 6}
                    width={NOTCH}
                    height={BLOCK_H + 28}
                    className={styles.notchTarget}
                    onClick={() => onNotchClick(side, distance)}
                  />
                )}
              </g>
            );
          }),
        )}

        {crates.map((crate) => {
          const x = notchX(crate.side, crate.distance);
          return (
            <g key={`crate-${crate.side}-${crate.distance}`}>
              <rect
                x={x - BLOCK_W / 2}
                y={BEAM_TOP - BLOCK_H}
                width={BLOCK_W}
                height={BLOCK_H}
                rx={4}
                className={styles.crate}
              />
              <text x={x} y={BEAM_TOP - BLOCK_H / 2 + 5} className={styles.weightLabel}>
                {crate.mass}
              </text>
            </g>
          );
        })}

        {placed.map((block) => {
          const x = notchX(block.side, block.distance);
          return (
            <g
              key={block.id}
              className={interactive ? styles.placedBlock : undefined}
              onClick={interactive ? () => onPlacedClick(block.id) : undefined}
            >
              <rect
                x={x - BLOCK_W / 2}
                y={BEAM_TOP - BLOCK_H}
                width={BLOCK_W}
                height={BLOCK_H}
                rx={4}
                fill={massColor(block.mass)}
                className={styles.block}
              />
              <text x={x} y={BEAM_TOP - BLOCK_H / 2 + 5} className={styles.weightLabel}>
                {block.mass}
              </text>
            </g>
          );
        })}
      </g>

      <polygon
        points={`${PIVOT_X},${PIVOT_Y + 6} ${PIVOT_X - 52},${GROUND_Y} ${PIVOT_X + 52},${GROUND_Y}`}
        className={styles.fulcrum}
      />
    </svg>
  );
}

export { massColor };
