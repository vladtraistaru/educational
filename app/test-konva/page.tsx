'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

let KonvaLib: typeof import('react-konva') | null = null;

interface ShapeData {
  id: string;
  type: 'rect' | 'group-mirror' | 'rect-mirror';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
}

const MIN_WIDTH = 50;

const INITIAL: ShapeData[] = [
  { id: 'r1', type: 'rect', x: 100, y: 100, width: 120, height: 60, rotation: 0, fill: '#e17055' },
  { id: 'gm1', type: 'group-mirror', x: 350, y: 150, width: 120, height: 3, rotation: -30, fill: '#2d3436' },
  { id: 'rm1', type: 'rect-mirror', x: 600, y: 150, width: 120, height: 6, rotation: -30, fill: '#0984e3' },
];

export default function TestKonva() {
  const [shapes, setShapes] = useState<ShapeData[]>(INITIAL);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const transformerRef = useRef<any>(null);
  const shapeRefs = useRef<Record<string, any>>({});
  const shapesRef = useRef(shapes);
  shapesRef.current = shapes;

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 30));
  }, []);

  useEffect(() => {
    import('react-konva').then((mod) => { KonvaLib = mod; setLoaded(true); });
  }, []);

  const selectedShape = shapes.find((s) => s.id === selectedId);

  useEffect(() => {
    if (!transformerRef.current) return;
    const node = selectedId ? shapeRefs.current[selectedId] : null;
    const tr = transformerRef.current;
    tr.nodes(node ? [node] : []);

    if (selectedShape?.type === 'rect') {
      tr.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right']);
    } else {
      tr.enabledAnchors(['middle-left', 'middle-right']);
    }
    tr.getLayer()?.batchDraw();
  }, [selectedId, loaded, selectedShape?.type]);

  if (!loaded || !KonvaLib) {
    return <div style={{ padding: 20 }}>Loading Konva...</div>;
  }

  const { Stage, Layer, Rect, Line, Group, Transformer } = KonvaLib;

  const handleDragEnd = (id: string, e: any) => {
    setShapes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, x: e.target.x(), y: e.target.y() } : s)),
    );
    addLog(`drag ${id}: x=${Math.round(e.target.x())} y=${Math.round(e.target.y())}`);
  };

  const handleTransform = (id: string, e: any) => {
    const node = e.target;
    const s = shapesRef.current.find((s) => s.id === id);
    addLog(`transform ${id}: scaleX=${node.scaleX().toFixed(2)} x=${Math.round(node.x())} rot=${Math.round(node.rotation())}`);

    if (s?.type === 'rect') {
      // For rect: rotation-only behavior (no position/scale reset since anchors are enabled)
    }
  };

  const handleTransformEnd = (id: string, e: any) => {
    const node = e.target;
    const current = shapesRef.current.find((s) => s.id === id);
    if (!current) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    addLog(`transformEnd ${id}: scaleX=${scaleX.toFixed(2)} scaleY=${scaleY.toFixed(2)} w=${node.width()} h=${node.height()}`);

    if (current.type === 'rect') {
      node.scaleX(1);
      node.scaleY(1);
      setShapes((prev) =>
        prev.map((s) => (s.id === id ? {
          ...s,
          x: node.x(), y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          rotation: node.rotation(),
        } : s)),
      );
    } else if (current.type === 'group-mirror') {
      const newWidth = Math.max(current.width * scaleX, MIN_WIDTH);
      addLog(`  group-mirror: oldW=${current.width} newW=${newWidth.toFixed(1)} nodeX=${node.x().toFixed(1)} nodeY=${node.y().toFixed(1)}`);
      setShapes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, x: node.x(), y: node.y(), width: newWidth, rotation: node.rotation() } : s)),
      );
      requestAnimationFrame(() => {
        transformerRef.current?.forceUpdate();
        transformerRef.current?.getLayer()?.batchDraw();
      });
    } else if (current.type === 'rect-mirror') {
      node.scaleX(1);
      node.scaleY(1);
      const newWidth = Math.max(node.width() * scaleX, MIN_WIDTH);
      node.width(newWidth);
      node.offsetX(newWidth / 2);
      addLog(`  rect-mirror: newW=${newWidth.toFixed(1)} nodeX=${node.x().toFixed(1)}`);
      setShapes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, x: node.x(), y: node.y(), width: newWidth, rotation: node.rotation() } : s)),
      );
      requestAnimationFrame(() => {
        transformerRef.current?.forceUpdate();
        transformerRef.current?.getLayer()?.batchDraw();
      });
    }
  };

  const renderShape = (s: ShapeData) => {
    const ref = (node: any) => { if (node) shapeRefs.current[s.id] = node; };
    const common = {
      x: s.x, y: s.y, rotation: s.rotation, draggable: true,
      onClick: () => setSelectedId(s.id),
      onTap: () => setSelectedId(s.id),
      onDragEnd: (e: any) => handleDragEnd(s.id, e),
      onTransform: (e: any) => handleTransform(s.id, e),
      onTransformEnd: (e: any) => handleTransformEnd(s.id, e),
    };

    switch (s.type) {
      case 'rect':
        return (
          <Rect key={s.id} ref={ref} {...common}
            width={s.width} height={s.height} fill={s.fill} />
        );

      case 'group-mirror':
        return (
          <Group key={s.id} ref={ref} {...common}>
            <Rect x={-s.width / 2} y={-10} width={s.width} height={20} fill="transparent" />
            <Line points={[-s.width / 2, 0, s.width / 2, 0]} stroke={s.fill} strokeWidth={s.height} lineCap="round" />
          </Group>
        );

      case 'rect-mirror':
        return (
          <Rect key={s.id} ref={ref} {...common}
            width={s.width} height={s.height}
            offsetX={s.width / 2} offsetY={s.height / 2}
            fill={s.fill} />
        );
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h2>Konva Transformer Test Page</h2>
      <p style={{ fontSize: 14, color: '#666' }}>
        <b style={{ color: '#e17055' }}>Red</b> = standard Rect |
        <b style={{ color: '#2d3436' }}> Black</b> = Group mirror (current approach) |
        <b style={{ color: '#0984e3' }}> Blue</b> = Rect mirror with offsetX
      </p>
      <div style={{ border: '2px solid #ddd', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
        <Stage
          width={800} height={300}
          onPointerDown={(e: any) => { if (e.target === e.target.getStage()) setSelectedId(null); }}
        >
          <Layer>
            {shapes.map(renderShape)}
            <Transformer
              ref={transformerRef}
              rotateEnabled
              flipEnabled={false}
              rotateAnchorOffset={25}
              anchorCornerRadius={10}
              anchorSize={16}
              padding={2}
              borderStrokeWidth={1}
              boundBoxFunc={(oldBox: any, newBox: any) => {
                if (Math.abs(newBox.width) < MIN_WIDTH || Math.abs(newBox.height) < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>
      <div>
        <b>Selected:</b> {selectedId ?? 'none'}
        {selectedShape && ` (${selectedShape.type}, w=${Math.round(selectedShape.width)}, h=${selectedShape.height})`}
      </div>
      <div style={{ maxHeight: 200, overflow: 'auto', fontSize: 12, marginTop: 8, background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
        {log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
