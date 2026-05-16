'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import translations from './translations';
import styles from './Activity.module.css';
import {
  traceParallelBundle,
  DEFAULT_SOURCE_POS,
  DEFAULT_SOURCE_ANGLE,
  DEFAULT_RAY_COUNT,
  DEFAULT_BUNDLE_WIDTH,
  DEFAULT_BULGE,
  DEFAULT_ELEMENT_HALF_HEIGHT,
  DEFAULT_ELEMENTS,
  Point,
  type ElementKind,
  type OpticalElement,
} from './optics';

interface SourceData {
  id: 'source';
  kind: 'source';
  x: number;
  y: number;
  rotation: number;
  rayCount: number;
  bundleWidth: number;
}

interface ElementData {
  id: string;
  kind: ElementKind;
  x: number;
  y: number;
  rotation: number;
  halfHeight: number;
  bulge: number;
}

type ShapeData = SourceData | ElementData;

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const VIRTUAL_W = 800;
const VIRTUAL_H = 500;
const MIN_HALF_HEIGHT = 30;

const INITIAL_SHAPES: ShapeData[] = [
  {
    id: 'source',
    kind: 'source',
    x: DEFAULT_SOURCE_POS.x,
    y: DEFAULT_SOURCE_POS.y,
    rotation: DEFAULT_SOURCE_ANGLE * RAD_TO_DEG,
    rayCount: DEFAULT_RAY_COUNT,
    bundleWidth: DEFAULT_BUNDLE_WIDTH,
  },
  ...DEFAULT_ELEMENTS.map((el) => ({
    id: `e${el.id}`,
    kind: el.kind,
    x: el.pos.x,
    y: el.pos.y,
    rotation: el.angle * RAD_TO_DEG,
    halfHeight: el.halfHeight,
    bulge: el.bulge,
  })),
];

let Konva: typeof import('react-konva') | null = null;
let SourceShape: typeof import('./SourceShape').default | null = null;
let ElementShape: typeof import('./ElementShape').default | null = null;

function ElementIcon({ kind }: { kind: ElementKind }) {
  const stroke = 'currentColor';
  const fill = 'rgba(255,255,255,0.35)';
  if (kind === 'converging-lens') {
    return (
      <svg width={26} height={26} viewBox="-14 -14 28 28" aria-hidden>
        <path
          d="M 0,-11 Q 6,0 0,11 Q -6,0 0,-11 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === 'diverging-lens') {
    return (
      <svg width={26} height={26} viewBox="-14 -14 28 28" aria-hidden>
        <path
          d="M -5,-11 L 5,-11 Q 0,0 5,11 L -5,11 Q 0,0 -5,-11 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === 'concave-mirror') {
    return (
      <svg width={26} height={26} viewBox="-14 -14 28 28" aria-hidden>
        <path d="M 4,-11 Q -5,0 4,11" fill="none" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" />
        <line x1={4} y1={-10} x2={9} y2={-7} stroke={stroke} strokeWidth={1.2} />
        <line x1={3} y1={-5} x2={8} y2={-2} stroke={stroke} strokeWidth={1.2} />
        <line x1={-1} y1={0} x2={4} y2={3} stroke={stroke} strokeWidth={1.2} />
        <line x1={3} y1={5} x2={8} y2={8} stroke={stroke} strokeWidth={1.2} />
      </svg>
    );
  }
  return (
    <svg width={26} height={26} viewBox="-14 -14 28 28" aria-hidden>
      <path d="M -4,-11 Q 5,0 -4,11" fill="none" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" />
      <line x1={-4} y1={-10} x2={-9} y2={-7} stroke={stroke} strokeWidth={1.2} />
      <line x1={-3} y1={-5} x2={-8} y2={-2} stroke={stroke} strokeWidth={1.2} />
      <line x1={1} y1={0} x2={-4} y2={3} stroke={stroke} strokeWidth={1.2} />
      <line x1={-3} y1={5} x2={-8} y2={8} stroke={stroke} strokeWidth={1.2} />
    </svg>
  );
}

export default function LensesAndMirrors(_props: ActivityProps) {
  const [shapes, setShapes] = useState<ShapeData[]>(INITIAL_SHAPES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [konvaLoaded, setKonvaLoaded] = useState(false);
  const [stageWidth, setStageWidth] = useState(VIRTUAL_W);
  const nextId = useRef(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformerRef = useRef<any>(null);
  const shapeRefs = useRef<Record<string, any>>({});
  const shapesRef = useRef(shapes);
  shapesRef.current = shapes;
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    Promise.all([
      import('react-konva'),
      import('./SourceShape'),
      import('./ElementShape'),
    ]).then(([konvaMod, srcMod, elMod]) => {
      Konva = konvaMod;
      SourceShape = srcMod.default;
      ElementShape = elMod.default;
      setKonvaLoaded(true);
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width));
    observer.observe(el);
    setStageWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const source = shapes.find((s): s is SourceData => s.kind === 'source')!;
  const elements = shapes.filter((s): s is ElementData => s.kind !== 'source');

  const opticalElements: OpticalElement[] = useMemo(
    () =>
      elements.map((e, i) => ({
        id: i + 1,
        kind: e.kind,
        pos: new Point(e.x, e.y),
        angle: e.rotation * DEG_TO_RAD,
        halfHeight: e.halfHeight,
        bulge: e.bulge,
      })),
    [elements],
  );

  const rayBundles = useMemo(() => {
    return traceParallelBundle(
      new Point(source.x, source.y),
      source.rotation * DEG_TO_RAD,
      source.rayCount,
      source.bundleWidth,
      opticalElements,
      Infinity,
      { w: VIRTUAL_W, h: VIRTUAL_H },
    );
  }, [source, opticalElements]);

  const selectedShape = shapes.find((s) => s.id === selectedId);
  const isElementSelected = !!selectedShape && selectedShape.kind !== 'source';
  const isSourceSelected = selectedShape?.kind === 'source';

  const selectedGeometryKey = !selectedShape
    ? ''
    : selectedShape.kind === 'source'
      ? `s-${selectedShape.bundleWidth}`
      : `${selectedShape.bulge}-${selectedShape.halfHeight}`;

  useEffect(() => {
    if (!transformerRef.current) return;
    const node = selectedId ? shapeRefs.current[selectedId] : null;
    const tr = transformerRef.current;
    tr.nodes(node ? [node] : []);
    tr.enabledAnchors(
      isElementSelected || isSourceSelected ? ['top-center', 'bottom-center'] : [],
    );
    requestAnimationFrame(() => {
      tr.forceUpdate();
      tr.getLayer()?.batchDraw();
    });
  }, [selectedId, konvaLoaded, isElementSelected, isSourceSelected, selectedGeometryKey]);

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
    if (current.kind !== 'source') {
      const rawHalf = node.scaleY() * current.halfHeight;
      const newHalf = Math.max(rawHalf, MIN_HALF_HEIGHT);
      node.scaleX(1);
      node.scaleY(1);
      setShapes((prev) =>
        prev.map((s) =>
          s.id === id && s.kind !== 'source'
            ? { ...s, x: node.x(), y: node.y(), rotation: node.rotation(), halfHeight: newHalf }
            : s,
        ),
      );
    } else {
      const rawWidth = node.scaleY() * current.bundleWidth;
      const newWidth = Math.max(rawWidth, 0);
      node.scaleX(1);
      node.scaleY(1);
      setShapes((prev) =>
        prev.map((s) =>
          s.id === id && s.kind === 'source'
            ? { ...s, x: node.x(), y: node.y(), rotation: node.rotation(), bundleWidth: newWidth }
            : s,
        ),
      );
    }
  }, []);

  const addElement = (kind: ElementKind) => {
    const id = nextId.current++;
    const newId = `e${id}`;
    setShapes((prev) => [
      ...prev,
      {
        id: newId,
        kind,
        x: 300 + id * 30,
        y: 250,
        rotation: 0,
        halfHeight: DEFAULT_ELEMENT_HALF_HEIGHT,
        bulge: DEFAULT_BULGE,
      },
    ]);
    setSelectedId(newId);
  };

  const updateElementBulge = useCallback((id: string, val: number) => {
    setShapes((prev) =>
      prev.map((s) =>
        s.id === id && s.kind !== 'source' ? { ...s, bulge: val } : s,
      ),
    );
  }, []);

  const removeSelectedElement = () => {
    if (!selectedId || !isElementSelected) return;
    delete shapeRefs.current[selectedId];
    setShapes((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
  };

  const updateSourceRays = (val: number) => {
    setShapes((prev) =>
      prev.map((s) => (s.id === 'source' ? { ...s, rayCount: val } : s)),
    );
  };

  if (!konvaLoaded || !Konva || !SourceShape || !ElementShape) {
    return (
      <div ref={containerRef} style={{ width: '100%', minHeight: 200 }}>
        Loading canvas...
      </div>
    );
  }

  const { Stage, Layer, Line, Transformer } = Konva;

  const renderShape = (s: ShapeData) => {
    const ref = (node: any) => {
      if (node) shapeRefs.current[s.id] = node;
    };
    const common = {
      x: s.x,
      y: s.y,
      rotation: s.rotation,
      draggable: true,
      onClick: () => setSelectedId(s.id),
      onDragMove: (e: any) => handleDragMove(s.id, e),
      onTransform: (e: any) => handleTransform(s.id, e),
      onTransformEnd: (e: any) => handleTransform(s.id, e),
      shapeRef: ref,
    };
    const Source = SourceShape!;
    const Element = ElementShape!;
    if (s.kind === 'source') {
      return (
        <Source
          key={s.id}
          {...common}
          rayCount={s.rayCount}
          bundleWidth={s.bundleWidth}
        />
      );
    }
    return (
      <Element
        key={s.id}
        {...common}
        kind={s.kind}
        halfHeight={s.halfHeight}
        bulge={s.bulge}
        selected={selectedId === s.id}
        onBulgeChange={(val: number) => updateElementBulge(s.id, val)}
      />
    );
  };

  return (
    <>
      <div className={styles.buttonRow}>
        <button
          className={`${shared.btnSecondary} ${styles.iconBtn}`}
          onClick={() => addElement('converging-lens')}
          title={t.convergingLens}
          aria-label={t.convergingLens}
        >
          <ElementIcon kind="converging-lens" />
        </button>
        <button
          className={`${shared.btnSecondary} ${styles.iconBtn}`}
          onClick={() => addElement('diverging-lens')}
          title={t.divergingLens}
          aria-label={t.divergingLens}
        >
          <ElementIcon kind="diverging-lens" />
        </button>
        <button
          className={`${shared.btnSecondary} ${styles.iconBtn}`}
          onClick={() => addElement('concave-mirror')}
          title={t.concaveMirror}
          aria-label={t.concaveMirror}
        >
          <ElementIcon kind="concave-mirror" />
        </button>
        <button
          className={`${shared.btnSecondary} ${styles.iconBtn}`}
          onClick={() => addElement('convex-mirror')}
          title={t.convexMirror}
          aria-label={t.convexMirror}
        >
          <ElementIcon kind="convex-mirror" />
        </button>
        <label className={styles.slider}>
          {t.rayCount}
          <input
            type="range" min={1} max={15} step={1}
            value={source.rayCount}
            onChange={(e) => updateSourceRays(Number(e.target.value))}
          />
          {source.rayCount}
        </label>
        {isElementSelected && (
          <button
            className={`${shared.btnDanger} ${styles.toggleBtn}`}
            onClick={removeSelectedElement}
          >
            ✕ {t.remove}
          </button>
        )}
      </div>
      <div ref={containerRef} className={styles.canvas}>
        <Stage
          width={stageWidth} height={stageHeight}
          scaleX={scale} scaleY={scale}
          onPointerDown={(e: any) => {
            if (e.target === e.target.getStage()) setSelectedId(null);
          }}
        >
          <Layer>
            {rayBundles.map((ray, ri) =>
              ray.map((seg, si) => (
                <Line
                  key={`r${ri}-s${si}`}
                  points={[seg.from.x, seg.from.y, seg.to.x, seg.to.y]}
                  stroke="#ff3333"
                  strokeWidth={2}
                  lineCap="round"
                  shadowColor="rgba(255,50,50,0.6)"
                  shadowBlur={4}
                  shadowEnabled
                  listening={false}
                />
              )),
            )}
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
                if (Math.abs(newBox.height) < MIN_HALF_HEIGHT * 2) {
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
