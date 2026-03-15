import { useRef, useState } from 'react';
import {
  computeReflection, LASER_HALF, MIRROR_HALF,
  type Point,
} from './optics';
import styles from './Activity.module.css';

interface Props {
  laserOn: boolean;
  animating: boolean;
  laserPos: Point;
  laserAngle: number;
  mirrorPos: Point;
  mirrorAngle: number;
  onLaserPosChange: (p: Point) => void;
  onLaserAngleChange: (a: number) => void;
  onMirrorPosChange: (p: Point) => void;
  onMirrorAngleChange: (a: number) => void;
  onInteractionStart: () => void;
}

type Interaction =
  | { type: 'idle' }
  | { type: 'drag'; target: 'laser' | 'mirror'; offset: Point }
  | { type: 'rotate'; target: 'laser' | 'mirror' };

const HANDLE_R = 8;
const HANDLE_GAP = 20;
const RAD_TO_DEG = 180 / Math.PI;

export default function OpticsCanvas({
  laserOn, animating,
  laserPos, laserAngle, mirrorPos, mirrorAngle,
  onLaserPosChange, onLaserAngleChange,
  onMirrorPosChange, onMirrorAngleChange,
  onInteractionStart,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [interaction, setInteraction] = useState<Interaction>({ type: 'idle' });

  const geo = computeReflection(laserPos, laserAngle, mirrorPos, mirrorAngle);

  function toSvg(e: React.PointerEvent): Point {
    const ctm = svgRef.current!.getScreenCTM()!;
    return { x: (e.clientX - ctm.e) / ctm.a, y: (e.clientY - ctm.f) / ctm.d };
  }

  function handleDown(
    e: React.PointerEvent<SVGElement>,
    target: 'laser' | 'mirror',
    mode: 'drag' | 'rotate',
  ) {
    e.stopPropagation();
    svgRef.current?.setPointerCapture(e.pointerId);
    onInteractionStart();
    const pt = toSvg(e);
    if (mode === 'drag') {
      const pos = target === 'laser' ? laserPos : mirrorPos;
      setInteraction({ type: 'drag', target, offset: { x: pt.x - pos.x, y: pt.y - pos.y } });
    } else {
      setInteraction({ type: 'rotate', target });
    }
  }

  function handleMove(e: React.PointerEvent) {
    if (interaction.type === 'idle') return;
    const pt = toSvg(e);
    if (interaction.type === 'drag') {
      const pos = { x: pt.x - interaction.offset.x, y: pt.y - interaction.offset.y };
      if (interaction.target === 'laser') onLaserPosChange(pos);
      else onMirrorPosChange(pos);
    } else {
      const center = interaction.target === 'laser' ? laserPos : mirrorPos;
      const angle = Math.atan2(pt.y - center.y, pt.x - center.x);
      if (interaction.target === 'laser') onLaserAngleChange(angle);
      else onMirrorAngleChange(angle);
    }
  }

  function handleUp() {
    setInteraction({ type: 'idle' });
  }

  const laserDeg = laserAngle * RAD_TO_DEG;
  const mirrorDeg = mirrorAngle * RAD_TO_DEG;

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

        {/* Mirror */}
        <g transform={`translate(${mirrorPos.x}, ${mirrorPos.y}) rotate(${mirrorDeg})`}>
          {/* Invisible wider hit area for dragging */}
          <rect
            x={-MIRROR_HALF} y={-12} width={MIRROR_HALF * 2} height={24}
            fill="transparent"
            className={styles.draggable}
            onPointerDown={(e) => handleDown(e, 'mirror', 'drag')}
          />
          <line
            x1={-MIRROR_HALF} y1={0} x2={MIRROR_HALF} y2={0}
            stroke="#2d3436" strokeWidth={6} strokeLinecap="round"
            pointerEvents="none"
          />
          <circle
            cx={MIRROR_HALF + HANDLE_GAP} cy={0} r={HANDLE_R}
            className={styles.rotateHandle}
            onPointerDown={(e) => handleDown(e, 'mirror', 'rotate')}
          />
        </g>

        {/* Beams */}
        {laserOn && (
          <>
            <line
              x1={geo.laserTip.x} y1={geo.laserTip.y}
              x2={geo.beamEnd.x} y2={geo.beamEnd.y}
              className={animating ? styles.beamIncidentAnim : styles.beam}
              style={animating ? {
                strokeDasharray: geo.incidentBeamLength,
                strokeDashoffset: geo.incidentBeamLength,
              } : undefined}
            />
            {geo.hitPoint && geo.reflectedEnd && (
              <line
                x1={geo.hitPoint.x} y1={geo.hitPoint.y}
                x2={geo.reflectedEnd.x} y2={geo.reflectedEnd.y}
                className={animating ? styles.beamReflectedAnim : styles.beam}
                style={animating ? {
                  strokeDasharray: geo.reflectedBeamLength,
                  strokeDashoffset: geo.reflectedBeamLength,
                } : undefined}
              />
            )}
          </>
        )}
      </svg>
    </div>
  );
}
