'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import translations from './translations';
import styles from './Activity.module.css';
import {
  traceBeam, DEFAULT_LASER_POS, DEFAULT_LASER_ANGLE, DEFAULT_MIRRORS, DEFAULT_BEAM_MAX,
  LASER_HALF, MIRROR_HALF,
  Point,
  type Mirror,
} from './optics';

interface ShapeData {
  id: string;
  type: 'laser' | 'mirror';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
}

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const VIRTUAL_W = 800;
const VIRTUAL_H = 500;
const MIN_MIRROR_WIDTH = 50;

const INITIAL_SHAPES: ShapeData[] = [
  {
    id: 'l1', type: 'laser',
    x: DEFAULT_LASER_POS.x, y: DEFAULT_LASER_POS.y,
    width: LASER_HALF * 2, height: 24,
    rotation: DEFAULT_LASER_ANGLE * RAD_TO_DEG, fill: '#d63031',
  },
  ...DEFAULT_MIRRORS.map((m) => ({
    id: `m${m.id}`, type: 'mirror' as const,
    x: m.pos.x, y: m.pos.y,
    width: MIRROR_HALF * 2, height: 3,
    rotation: m.angle * RAD_TO_DEG, fill: '#2d3436',
  })),
];

let Konva: typeof import('react-konva') | null = null;

export default function LaserAndMirrors(_props: ActivityProps) {
  const [shapes, setShapes] = useState<ShapeData[]>(INITIAL_SHAPES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [laserOn, setLaserOn] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [konvaLoaded, setKonvaLoaded] = useState(false);
  const [stageWidth, setStageWidth] = useState(VIRTUAL_W);
  const [beamTravel, setBeamTravel] = useState(Infinity);
  const [lightSpeed, setLightSpeed] = useState(600);
  const lightSpeedRef = useRef(lightSpeed);
  lightSpeedRef.current = lightSpeed;
  const [beamMax, setBeamMax] = useState(DEFAULT_BEAM_MAX);
  const nextId = useRef(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformerRef = useRef<any>(null);
  const shapeRefs = useRef<Record<string, any>>({});
  const shapesRef = useRef(shapes);
  shapesRef.current = shapes;
  const { language } = useLanguage();
  const t = translations[language];

  const handleToggle = () => {
    const wasOff = !laserOn;
    setLaserOn(!laserOn);
    if (wasOff) {
      setBeamTravel(0);
      setAnimating(true);
    } else {
      setAnimating(false);
      setBeamTravel(Infinity);
    }
  };

  const beamSegments = useMemo(() => {
    if (!laserOn) return [];
    const laser = shapes.find((s) => s.type === 'laser');
    if (!laser) return [];
    const mirrors: Mirror[] = shapes
      .filter((s) => s.type === 'mirror')
      .map((s, i) => ({ id: i, pos: new Point(s.x, s.y), angle: s.rotation * DEG_TO_RAD, halfWidth: s.width / 2 }));
    return traceBeam(new Point(laser.x, laser.y), laser.rotation * DEG_TO_RAD, mirrors, beamMax, { w: VIRTUAL_W, h: VIRTUAL_H });
  }, [shapes, laserOn, beamMax]);

  const beamSegmentsRef = useRef(beamSegments);
  beamSegmentsRef.current = beamSegments;

  useEffect(() => {
    if (!animating) return;
    const totalLen = beamSegmentsRef.current.reduce((sum, s) => sum + s.length, 0);
    if (!totalLen || lightSpeedRef.current === Infinity) {
      setBeamTravel(Infinity); setAnimating(false); return;
    }
    let prev: number | null = null;
    let traveled = 0;
    let raf: number;
    const tick = (ts: number) => {
      if (!prev) prev = ts;
      traveled += ((ts - prev) / 1000) * lightSpeedRef.current;
      prev = ts;
      setBeamTravel(traveled);
      if (traveled >= totalLen) {
        setBeamTravel(Infinity);
        setAnimating(false);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animating]);

  useEffect(() => {
    import('react-konva').then((mod) => { Konva = mod; setKonvaLoaded(true); });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width));
    observer.observe(el);
    setStageWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const selectedShape = shapes.find((s) => s.id === selectedId);
  const isMirrorSelected = selectedShape?.type === 'mirror';

  useEffect(() => {
    if (!transformerRef.current) return;
    const node = selectedId ? shapeRefs.current[selectedId] : null;
    const tr = transformerRef.current;
    tr.nodes(node ? [node] : []);
    tr.enabledAnchors(isMirrorSelected ? ['middle-left', 'middle-right'] : []);
    tr.getLayer()?.batchDraw();
  }, [selectedId, konvaLoaded, isMirrorSelected]);

  const scale = stageWidth / VIRTUAL_W;
  const stageHeight = VIRTUAL_H * scale;

  const handleDragMove = useCallback((id: string, e: any) => {
    setShapes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, x: e.target.x(), y: e.target.y() } : s)),
    );
  }, []);

  const handleTransform = useCallback((id: string, e: any) => {
    const node = e.target;
    const current = shapesRef.current.find((s) => s.id === id);
    if (!current) return;

    if (current.type === 'mirror') {
      const newWidth = Math.max(node.width() * node.scaleX(), MIN_MIRROR_WIDTH);
      node.scaleX(1);
      node.scaleY(1);
      node.width(newWidth);
      node.offsetX(newWidth / 2);
      setShapes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, x: node.x(), y: node.y(), width: newWidth, rotation: node.rotation() } : s)),
      );
    } else {
      node.x(current.x);
      node.y(current.y);
      node.scaleX(1);
      node.scaleY(1);
      setShapes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, rotation: node.rotation() } : s)),
      );
    }
  }, []);

  const handleTransformEnd = useCallback((id: string, e: any) => {
    const node = e.target;
    const current = shapesRef.current.find((s) => s.id === id);
    if (current?.type === 'mirror') {
      const scaleX = node.scaleX();
      const newWidth = Math.max(node.width() * scaleX, MIN_MIRROR_WIDTH);
      node.scaleX(1);
      node.scaleY(1);
      node.width(newWidth);
      node.offsetX(newWidth / 2);
      setShapes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, x: node.x(), y: node.y(), width: newWidth, rotation: node.rotation() } : s)),
      );
    }
  }, []);

  const addMirror = () => {
    const id = nextId.current++;
    const newId = `m${id}`;
    setShapes((prev) => [
      ...prev,
      { id: newId, type: 'mirror', x: 300 + id * 40, y: 200, width: MIRROR_HALF * 2, height: 3, rotation: -45, fill: '#2d3436' },
    ]);
    setSelectedId(newId);
  };

  const [wallMirrors, setWallMirrors] = useState(false);

  const toggleWallMirrors = () => {
    if (wallMirrors) {
      setShapes((prev) => prev.filter((s) => !s.id.startsWith('wall-')));
    } else {
      const W = VIRTUAL_W;
      const H = VIRTUAL_H;
      const mw = MIRROR_HALF * 2;
      const walls: ShapeData[] = [];
      const margin = 5;
      const countH = Math.ceil(W / mw);
      const countV = Math.ceil(H / mw);
      for (let i = 0; i < countH; i++) {
        const x = margin + mw / 2 + i * mw;
        walls.push({ id: `wall-t${i}`, type: 'mirror', x, y: margin, width: mw, height: 3, rotation: 0, fill: '#636e72' });
        walls.push({ id: `wall-b${i}`, type: 'mirror', x, y: H - margin, width: mw, height: 3, rotation: 0, fill: '#636e72' });
      }
      for (let i = 0; i < countV; i++) {
        const y = margin + mw / 2 + i * mw;
        walls.push({ id: `wall-l${i}`, type: 'mirror', x: margin, y, width: mw, height: 3, rotation: 90, fill: '#636e72' });
        walls.push({ id: `wall-r${i}`, type: 'mirror', x: W - margin, y, width: mw, height: 3, rotation: 90, fill: '#636e72' });
      }
      setShapes((prev) => [...prev, ...walls]);
    }
    setWallMirrors(!wallMirrors);
  };

  if (!konvaLoaded || !Konva) {
    return (
      <div ref={containerRef} style={{ width: '100%', minHeight: 200 }}>
        Loading canvas...
      </div>
    );
  }

  const { Stage, Layer, Rect, Circle, Line, Group, Transformer } = Konva;

  const renderShape = (s: ShapeData) => {
    const ref = (node: any) => { if (node) shapeRefs.current[s.id] = node; };
    const common = {
      x: s.x, y: s.y, rotation: s.rotation, draggable: true,
      onClick: () => setSelectedId(s.id),
      onTap: () => setSelectedId(s.id),
      onDragMove: (e: any) => handleDragMove(s.id, e),
      onTransform: (e: any) => handleTransform(s.id, e),
      onTransformEnd: (e: any) => handleTransformEnd(s.id, e),
    };

    switch (s.type) {
      case 'laser': {
        const hw = s.width / 2;
        const hh = s.height / 2;
        return (
          <Group key={s.id} ref={ref} {...common}>
            <Rect width={s.width} height={s.height} offsetX={hw} offsetY={hh} fill={s.fill} cornerRadius={4} />
            <Line points={[hw, -hh, hw + 12, 0, hw, hh]} fill="#b71c1c" closed />
            <Circle x={hw + 12} r={5} fill="#ff7675" />
            <Circle x={hw + 12} r={9} fill="rgba(255,118,117,0.3)" />
          </Group>
        );
      }
      case 'mirror':
        return (
          <Rect key={s.id} ref={ref} {...common}
            width={s.width} height={s.height}
            offsetX={s.width / 2} offsetY={s.height / 2}
            fill={s.fill} cornerRadius={2}
            hitStrokeWidth={20}
          />
        );
    }
  };

  const cumLengths = beamSegments.reduce<number[]>((acc, seg, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + beamSegments[i - 1].length);
    return acc;
  }, []);

  const totalBeamLength = beamSegments.reduce((sum, s) => sum + s.length, 0);
  const visibleLength = Math.min(beamTravel, totalBeamLength);

  return (
    <>
      <div className={styles.buttonRow}>
        <button
          className={`${laserOn ? shared.btnDanger : shared.btnPrimary} ${styles.toggleBtn}`}
          onClick={handleToggle}
        >
          {laserOn ? '⏹' : '💡'} {laserOn ? t.turnOff : t.shine}
        </button>
        <button className={`${shared.btnSecondary} ${styles.toggleBtn}`} onClick={addMirror}>
          + {t.addMirror}
        </button>
        <button
          className={`${wallMirrors ? shared.btnDanger : shared.btnSecondary} ${styles.toggleBtn}`}
          onClick={toggleWallMirrors}
        >
          {wallMirrors ? '✕' : '▢'} Walls
        </button>
        {laserOn && (
          <span className={styles.rayCounter}>
            📏 {Math.round(visibleLength)} px
          </span>
        )}
      </div>
      <details className={styles.advanced}>
        <summary>⚙️ Advanced</summary>
        <div className={styles.advancedControls}>
          <label className={styles.speedSlider}>
            🐢 Speed
            <input
              type="range" min={50} max={10000} step={50}
              value={lightSpeed === Infinity ? 10000 : lightSpeed}
              onChange={(e) => {
                const v = Number(e.target.value);
                setLightSpeed(v >= 10000 ? Infinity : v);
              }}
            />
            {lightSpeed === Infinity ? '∞' : lightSpeed}
          </label>
          <label className={styles.speedSlider}>
            ✂️ Beam length
            <input
              type="range" min={200} max={100000} step={200}
              value={beamMax}
              onChange={(e) => setBeamMax(Number(e.target.value))}
            />
            {beamMax}
          </label>
        </div>
      </details>
      <div ref={containerRef} className={styles.canvas}>
        <Stage
          width={stageWidth} height={stageHeight}
          scaleX={scale} scaleY={scale}
          onPointerDown={(e: any) => { if (e.target === e.target.getStage()) setSelectedId(null); }}
        >
          <Layer>
            {beamSegments.map((seg, i) => {
              const remaining = beamTravel - cumLengths[i];
              if (remaining <= 0) return null;
              const frac = Math.min(remaining / seg.length, 1);
              const toX = seg.from.x + (seg.to.x - seg.from.x) * frac;
              const toY = seg.from.y + (seg.to.y - seg.from.y) * frac;
              return (
                <Line
                  key={`beam-${i}`}
                  points={[seg.from.x, seg.from.y, toX, toY]}
                  stroke="#ff3333" strokeWidth={3} lineCap="round"
                  shadowColor="rgba(255,50,50,0.6)" shadowBlur={6} shadowEnabled
                  listening={false}
                />
              );
            })}
            {shapes.map(renderShape)}
            <Transformer
              ref={transformerRef}
              rotateEnabled
              flipEnabled={false}
              rotateAnchorOffset={25}
              rotateAnchorCursor="crosshair"
              anchorCornerRadius={10}
              padding={0}
              borderStrokeWidth={1}
              anchorSize={20}
              boundBoxFunc={(oldBox: any, newBox: any) => {
                if (Math.abs(newBox.width) < MIN_MIRROR_WIDTH) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>
    </>
  );
}
