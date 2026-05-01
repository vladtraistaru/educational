'use client';

import { useEffect, useRef, useState } from 'react';
import {
  COMPONENT_HEIGHT,
  COMPONENT_WIDTH,
  PlacedComponent,
  Pt,
  SimResult,
  TERMINAL_RADIUS,
  Terminal,
  TerminalRef,
  WireLink,
  getTerminalPosition,
  pathLength,
  pointAlongPath,
  pointsToFlat,
  routeOrthogonal,
} from './state';

const VIRTUAL_W = 800;
const VIRTUAL_H = 500;
const ELECTRON_SPACING = 30;

interface Props {
  placed: PlacedComponent[];
  wires: WireLink[];
  pendingWireStart: TerminalRef | null;
  simResult: SimResult;
  onAddPlaced: (kind: 'bulb' | 'switch', x: number, y: number) => void;
  onMovePlaced: (id: string, x: number, y: number) => void;
  onTerminalClick: (ref: TerminalRef) => void;
  onSwitchToggle: (id: string) => void;
  onWireClick: (id: string) => void;
  onCanvasClick: () => void;
}

let Konva: typeof import('react-konva') | null = null;

export default function CircuitCanvas(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(VIRTUAL_W);
  const [konvaLoaded, setKonvaLoaded] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    import('react-konva').then((mod) => {
      Konva = mod;
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

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setTick((t) => (t + 1) % 10000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData('application/x-circuit-component') as 'bulb' | 'switch';
    if (kind !== 'bulb' && kind !== 'switch') return;
    const rect = containerRef.current!.getBoundingClientRect();
    const scale = stageWidth / VIRTUAL_W;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    props.onAddPlaced(kind, x, y);
  };

  if (!konvaLoaded || !Konva) {
    return (
      <div ref={containerRef} style={{ width: '100%', minHeight: 500, background: '#f5f6fa' }}>
        Loading canvas...
      </div>
    );
  }

  const { Stage, Layer, Rect, Circle, Line, Group, Text } = Konva;
  const scale = stageWidth / VIRTUAL_W;
  const stageHeight = VIRTUAL_H * scale;

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', background: '#f5f6fa', borderRadius: 8 }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={handleDrop}
    >
      <Stage
        width={stageWidth}
        height={stageHeight}
        scaleX={scale}
        scaleY={scale}
        onClick={(e: any) => {
          if (e.target === e.target.getStage()) props.onCanvasClick();
        }}
      >
        <Layer>
          {props.wires.map((w) => {
            const from = findTerminal(props.placed, w.from);
            const to = findTerminal(props.placed, w.to);
            if (!from || !to) return null;
            const route = routeOrthogonal(from, w.from.terminal, to, w.to.terminal);
            const i = props.simResult.wireCurrent.get(w.id) ?? 0;
            const flowing = i > 0.001;
            return (
              <Group key={w.id} onClick={() => props.onWireClick(w.id)} onTap={() => props.onWireClick(w.id)}>
                <Line
                  points={pointsToFlat(route)}
                  stroke="#2d3436"
                  strokeWidth={4}
                  hitStrokeWidth={20}
                  lineCap="round"
                  lineJoin="round"
                />
                {flowing && renderElectrons(route, i, tick, Circle, Text)}
              </Group>
            );
          })}

          {props.placed.map((c) => renderComponent(c, props, Rect, Circle, Line, Group, Text))}

          {props.pendingWireStart &&
            renderPendingHighlight(props.placed, props.pendingWireStart, Circle)}
        </Layer>
      </Stage>
    </div>
  );
}

function findTerminal(placed: PlacedComponent[], ref: TerminalRef) {
  const c = placed.find((p) => p.id === ref.componentId);
  if (!c) return null;
  return getTerminalPosition(c, ref.terminal);
}

function renderElectrons(
  route: Pt[],
  current: number,
  tick: number,
  Circle: any,
  Text: any,
) {
  const len = pathLength(route);
  if (len < 1) return null;
  const speed = 0.15 + Math.min(current / 0.2, 1) * 0.45;
  const offset = (tick * speed) % ELECTRON_SPACING;
  const nodes = [];
  for (let d = offset; d < len; d += ELECTRON_SPACING) {
    const p = pointAlongPath(route, d);
    if (!p) continue;
    nodes.push(
      <Circle
        key={`g${d}`}
        x={p.x}
        y={p.y}
        radius={7}
        fill="rgba(116, 185, 255, 0.35)"
        listening={false}
      />,
      <Circle
        key={`c${d}`}
        x={p.x}
        y={p.y}
        radius={4.5}
        fill="#0984e3"
        stroke="#0652a3"
        strokeWidth={0.5}
        listening={false}
      />,
      <Text
        key={`t${d}`}
        x={p.x - 3}
        y={p.y - 4}
        text="−"
        fontSize={8}
        fontStyle="bold"
        fill="#ffffff"
        listening={false}
      />,
    );
  }
  return nodes;
}

function renderComponent(
  c: PlacedComponent,
  props: Props,
  Rect: any,
  Circle: any,
  Line: any,
  Group: any,
  Text: any,
) {
  const onDragMove = (e: any) => props.onMovePlaced(c.id, e.target.x(), e.target.y());
  const litMap = props.simResult.bulbLit;

  const terminalCircles = (
    <>
      {(['a', 'b'] as Terminal[]).map((t) => {
        const local = t === 'a' ? -COMPONENT_WIDTH / 2 : COMPONENT_WIDTH / 2;
        return (
          <Circle
            key={t}
            x={local}
            y={0}
            radius={TERMINAL_RADIUS}
            fill="#636e72"
            stroke="#2d3436"
            strokeWidth={1.5}
            onClick={(e: any) => {
              e.cancelBubble = true;
              props.onTerminalClick({ componentId: c.id, terminal: t });
            }}
            onTap={(e: any) => {
              e.cancelBubble = true;
              props.onTerminalClick({ componentId: c.id, terminal: t });
            }}
          />
        );
      })}
    </>
  );

  if (c.kind === 'battery') {
    return (
      <Group key={c.id} x={c.x} y={c.y} draggable onDragMove={onDragMove}>
        <Rect
          width={COMPONENT_WIDTH}
          height={COMPONENT_HEIGHT}
          offsetX={COMPONENT_WIDTH / 2}
          offsetY={COMPONENT_HEIGHT / 2}
          fill="#2d3436"
          cornerRadius={6}
        />
        <Text x={-COMPONENT_WIDTH / 2 + 8} y={-8} text="−" fontSize={20} fill="#fff" />
        <Text x={COMPONENT_WIDTH / 2 - 18} y={-8} text="+" fontSize={20} fill="#fff" />
        {terminalCircles}
      </Group>
    );
  }

  if (c.kind === 'bulb') {
    const lit = litMap.get(c.id) ?? false;
    const current = props.simResult.componentCurrent.get(c.id) ?? 0;
    const brightness = lit ? Math.min(current / 0.2, 1) : 0;
    return (
      <Group key={c.id} x={c.x} y={c.y} draggable onDragMove={onDragMove}>
        <Line
          points={[-COMPONENT_WIDTH / 2, 0, -COMPONENT_HEIGHT / 2 + 5, 0]}
          stroke="#2d3436"
          strokeWidth={3}
        />
        <Line
          points={[COMPONENT_HEIGHT / 2 - 5, 0, COMPONENT_WIDTH / 2, 0]}
          stroke="#2d3436"
          strokeWidth={3}
        />
        <Circle
          radius={COMPONENT_HEIGHT / 2 - 4}
          fill={lit ? `rgba(253, 203, 110, ${0.4 + brightness * 0.6})` : '#fff5cc'}
          stroke="#2d3436"
          strokeWidth={2}
          shadowColor="#fdcb6e"
          shadowBlur={lit ? 20 + brightness * 30 : 0}
          shadowOpacity={lit ? 0.9 : 0}
        />
        <Line
          points={[-6, 4, 0, -4, 6, 4]}
          stroke="#e17055"
          strokeWidth={1.5}
        />
        {terminalCircles}
      </Group>
    );
  }

  // switch
  const closed = c.closed ?? false;
  return (
    <Group
      key={c.id}
      x={c.x}
      y={c.y}
      draggable
      onDragMove={onDragMove}
      onClick={(e: any) => {
        if (e.evt.detail === 0) return;
        props.onSwitchToggle(c.id);
      }}
      onTap={() => props.onSwitchToggle(c.id)}
    >
      <Rect
        width={COMPONENT_WIDTH}
        height={COMPONENT_HEIGHT}
        offsetX={COMPONENT_WIDTH / 2}
        offsetY={COMPONENT_HEIGHT / 2}
        fill="#dfe6e9"
        stroke="#2d3436"
        strokeWidth={2}
        cornerRadius={6}
      />
      <Line
        points={
          closed
            ? [-COMPONENT_WIDTH / 2 + 10, 0, COMPONENT_WIDTH / 2 - 10, 0]
            : [-COMPONENT_WIDTH / 2 + 10, 0, COMPONENT_WIDTH / 2 - 14, -COMPONENT_HEIGHT / 2 + 6]
        }
        stroke="#2d3436"
        strokeWidth={4}
        lineCap="round"
      />
      <Circle x={-COMPONENT_WIDTH / 2 + 10} y={0} radius={4} fill="#2d3436" />
      <Circle x={COMPONENT_WIDTH / 2 - 10} y={0} radius={4} fill="#2d3436" />
      {terminalCircles}
    </Group>
  );
}

function renderPendingHighlight(
  placed: PlacedComponent[],
  pending: TerminalRef,
  Circle: any,
) {
  const c = placed.find((p) => p.id === pending.componentId);
  if (!c) return null;
  const p = getTerminalPosition(c, pending.terminal);
  return (
    <Circle
      x={p.x}
      y={p.y}
      radius={TERMINAL_RADIUS + 6}
      stroke="#00b894"
      strokeWidth={3}
      listening={false}
    />
  );
}
