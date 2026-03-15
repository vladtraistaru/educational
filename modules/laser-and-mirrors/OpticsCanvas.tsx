import { useRef, useState } from 'react';
import {
  traceBeam, LASER_HALF, MIRROR_HALF,
  type Point, type Mirror,
} from './optics';
import styles from './Activity.module.css';

interface Props {
  laserOn: boolean;
  animating: boolean;
  laserPos: Point;
  laserAngle: number;
  mirrors: Mirror[];
  onLaserPosChange: (p: Point) => void;
  onLaserAngleChange: (a: number) => void;
  onMirrorChange: (id: number, pos: Point, angle: number) => void;
  onInteractionStart: () => void;
}

type Target = 'laser' | { mirrorId: number };

type Interaction =
  | { type: 'idle' }
  | { type: 'drag'; target: Target; offset: Point }
  | { type: 'rotate'; target: Target };

const HANDLE_R = 8;
const HANDLE_GAP = 20;
const RAD_TO_DEG = 180 / Math.PI;

export default function OpticsCanvas({
  laserOn, animating,
  laserPos, laserAngle, mirrors,
  onLaserPosChange, onLaserAngleChange, onMirrorChange,
  onInteractionStart,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [interaction, setInteraction] = useState<Interaction>({ type: 'idle' });

  const segments = laserOn ? traceBeam(laserPos, laserAngle, mirrors) : [];

  function toSvg(e: React.PointerEvent): Point {
    const ctm = svgRef.current!.getScreenCTM()!;
    return { x: (e.clientX - ctm.e) / ctm.a, y: (e.clientY - ctm.f) / ctm.d };
  }

  function getPos(target: Target): Point {
    if (target === 'laser') return laserPos;
    return mirrors.find((m) => m.id === target.mirrorId)!.pos;
  }

  function handleDown(
    e: React.PointerEvent<SVGElement>,
    target: Target,
    mode: 'drag' | 'rotate',
  ) {
    e.stopPropagation();
    svgRef.current?.setPointerCapture(e.pointerId);
    onInteractionStart();
    const pt = toSvg(e);
    if (mode === 'drag') {
      const pos = getPos(target);
      setInteraction({ type: 'drag', target, offset: { x: pt.x - pos.x, y: pt.y - pos.y } });
    } else {
      setInteraction({ type: 'rotate', target });
    }
  }

  function handleMove(e: React.PointerEvent) {
    if (interaction.type === 'idle') return;
    const pt = toSvg(e);
    const { target } = interaction;

    if (interaction.type === 'drag') {
      const pos = { x: pt.x - interaction.offset.x, y: pt.y - interaction.offset.y };
      if (target === 'laser') {
        onLaserPosChange(pos);
      } else {
        const m = mirrors.find((mi) => mi.id === target.mirrorId)!;
        onMirrorChange(m.id, pos, m.angle);
      }
    } else {
      const center = getPos(target);
      const angle = Math.atan2(pt.y - center.y, pt.x - center.x);
      if (target === 'laser') {
        onLaserAngleChange(angle);
      } else {
        const m = mirrors.find((mi) => mi.id === target.mirrorId)!;
        onMirrorChange(m.id, m.pos, angle);
      }
    }
  }

  function handleUp() {
    setInteraction({ type: 'idle' });
  }

  const laserDeg = laserAngle * RAD_TO_DEG;

  return (
    <div className={styles.canvas}>
      <svg
        ref={svgRef}
        viewBox="0 0 800 500"
        xmlns="http://www.w3.org/2000/svg"
        onPointerMove={handleMove}
        onPointerUp={handleUp}
      >
        {/* Laser */}
        <g transform={`translate(${laserPos.x}, ${laserPos.y}) rotate(${laserDeg})`}>
          <rect
            x={-LASER_HALF} y={-12} width={LASER_HALF * 2} height={24}
            rx={4} fill="#d63031"
            className={styles.draggable}
            onPointerDown={(e) => handleDown(e, 'laser', 'drag')}
          />
          <circle cx={LASER_HALF} cy={0} r={4} fill="#ff7675" />
          <circle
            cx={LASER_HALF + HANDLE_GAP} cy={0} r={HANDLE_R}
            className={styles.rotateHandle}
            onPointerDown={(e) => handleDown(e, 'laser', 'rotate')}
          />
        </g>

        {/* Mirrors */}
        {mirrors.map((m) => {
          const deg = m.angle * RAD_TO_DEG;
          const target: Target = { mirrorId: m.id };
          return (
            <g key={m.id} transform={`translate(${m.pos.x}, ${m.pos.y}) rotate(${deg})`}>
              <rect
                x={-MIRROR_HALF} y={-12} width={MIRROR_HALF * 2} height={24}
                fill="transparent"
                className={styles.draggable}
                onPointerDown={(e) => handleDown(e, target, 'drag')}
              />
              <line
                x1={-MIRROR_HALF} y1={0} x2={MIRROR_HALF} y2={0}
                stroke="#2d3436" strokeWidth={6} strokeLinecap="round"
                pointerEvents="none"
              />
              <circle
                cx={MIRROR_HALF + HANDLE_GAP} cy={0} r={HANDLE_R}
                className={styles.rotateHandle}
                onPointerDown={(e) => handleDown(e, target, 'rotate')}
              />
            </g>
          );
        })}

        {/* Beam segments */}
        {segments.map((seg, i) => (
          <line
            key={i}
            x1={seg.from.x} y1={seg.from.y}
            x2={seg.to.x} y2={seg.to.y}
            className={animating && i === 0 ? styles.beamIncidentAnim : styles.beam}
            style={animating && i === 0 ? {
              strokeDasharray: seg.length,
              strokeDashoffset: seg.length,
            } : undefined}
          />
        ))}
      </svg>
    </div>
  );
}
