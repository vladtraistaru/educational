'use client';

import { useEffect, useRef, useState } from 'react';
import {
  COMPONENT_HEIGHT,
  COMPONENT_WIDTH,
  DEFAULT_RESISTOR_OHMS,
  PlacedComponent,
  Pt,
  RESISTOR_OHMS_OPTIONS,
  SimResult,
  TERMINAL_RADIUS,
  Terminal,
  TerminalRef,
  WireLink,
  getTerminalOutward,
  getTerminalPosition,
  pathLength,
  pointAlongPath,
  pointsToFlat,
  routeOrthogonal,
} from './state';

const VIRTUAL_W = 800;
const VIRTUAL_H = 500;
const ELECTRON_SPACING = 30;
const TERMINAL_HIT_RADIUS = 18;

interface Props {
  placed: PlacedComponent[];
  wires: WireLink[];
  pendingWireStart: TerminalRef | null;
  selectedId: string | null;
  simResult: SimResult;
  onAddPlaced: (kind: 'bulb' | 'switch' | 'resistor', x: number, y: number) => void;
  onMovePlaced: (id: string, x: number, y: number) => void;
  onSelect: (id: string | null) => void;
  onRotate: (id: string) => void;
  onTerminalClick: (ref: TerminalRef) => void;
  onSwitchToggle: (id: string) => void;
  onSetOhms: (id: string, ohms: number) => void;
  onRemovePlaced: (id: string) => void;
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
    const kind = e.dataTransfer.getData('application/x-circuit-component') as
      | 'bulb'
      | 'switch'
      | 'resistor';
    if (kind !== 'bulb' && kind !== 'switch' && kind !== 'resistor') return;
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
            const fromC = props.placed.find((p) => p.id === w.from.componentId);
            const toC = props.placed.find((p) => p.id === w.to.componentId);
            if (!fromC || !toC) return null;
            const from = getTerminalPosition(fromC, w.from.terminal);
            const to = getTerminalPosition(toC, w.to.terminal);
            const fOut = getTerminalOutward(fromC, w.from.terminal);
            const tOut = getTerminalOutward(toC, w.to.terminal);
            const baseRoute = routeOrthogonal(from, fOut, to, tOut);
            const reversed = props.simResult.wireReversed.get(w.id) ?? false;
            const route = reversed ? baseRoute.slice().reverse() : baseRoute;
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

          {props.selectedId &&
            renderRotateButton(props.placed, props.selectedId, props.onRotate, Circle, Text, Group)}

          {props.selectedId &&
            renderRemoveButton(props.placed, props.selectedId, props.onRemovePlaced, Circle, Text, Group)}

          {props.selectedId &&
            renderOhmsPicker(props.placed, props.selectedId, props.onSetOhms, Rect, Text, Group)}
        </Layer>
      </Stage>
    </div>
  );
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
        const handle = (e: any) => {
          e.cancelBubble = true;
          props.onTerminalClick({ componentId: c.id, terminal: t });
        };
        return (
          <Group key={t} x={local} y={0} onClick={handle} onTap={handle}>
            <Circle radius={TERMINAL_HIT_RADIUS} fill="rgba(0,0,0,0.001)" />
            <Circle
              radius={TERMINAL_RADIUS}
              fill="#636e72"
              stroke="#2d3436"
              strokeWidth={1.5}
              listening={false}
            />
          </Group>
        );
      })}
    </>
  );

  const isSelected = props.selectedId === c.id;
  const selectionRing = isSelected ? (
    <Rect
      width={COMPONENT_WIDTH + 12}
      height={COMPONENT_HEIGHT + 12}
      offsetX={(COMPONENT_WIDTH + 12) / 2}
      offsetY={(COMPONENT_HEIGHT + 12) / 2}
      stroke="#0984e3"
      strokeWidth={2}
      dash={[6, 4]}
      cornerRadius={8}
      listening={false}
    />
  ) : null;

  const groupCommon = {
    key: c.id,
    x: c.x,
    y: c.y,
    rotation: c.rotation,
    draggable: true,
    onDragMove,
    onClick: (e: any) => {
      e.cancelBubble = true;
      props.onSelect(c.id);
      if (c.kind === 'switch' && e.evt?.detail !== 0) props.onSwitchToggle(c.id);
    },
    onTap: (e: any) => {
      e.cancelBubble = true;
      props.onSelect(c.id);
      if (c.kind === 'switch') props.onSwitchToggle(c.id);
    },
  };

  if (c.kind === 'battery') {
    return (
      <Group {...groupCommon}>
        {selectionRing}
        <Rect
          width={COMPONENT_WIDTH}
          height={COMPONENT_HEIGHT}
          offsetX={COMPONENT_WIDTH / 2}
          offsetY={COMPONENT_HEIGHT / 2}
          fill="#2d3436"
          cornerRadius={6}
        />
        <Text x={-COMPONENT_WIDTH / 2 + 8} y={-COMPONENT_HEIGHT / 2 + 6} text="−" fontSize={18} fill="#fff" />
        <Text x={COMPONENT_WIDTH / 2 - 16} y={-COMPONENT_HEIGHT / 2 + 6} text="+" fontSize={18} fill="#fff" />
        <Text
          x={-COMPONENT_WIDTH / 2}
          y={-6}
          width={COMPONENT_WIDTH}
          align="center"
          text="5V"
          fontSize={18}
          fontStyle="bold"
          fill="#fff"
        />
        {terminalCircles}
      </Group>
    );
  }

  if (c.kind === 'bulb') {
    const burnt = props.simResult.bulbBurnt.get(c.id) ?? false;
    const lit = !burnt && (litMap.get(c.id) ?? false);
    const current = props.simResult.componentCurrent.get(c.id) ?? 0;
    const brightness = lit ? Math.min(current / 0.5, 1) : 0;
    const milliamps = Math.round(current * 1000);
    const radius = COMPONENT_HEIGHT / 2 - 4;
    return (
      <Group {...groupCommon}>
        {selectionRing}
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
          radius={radius}
          fill={burnt ? '#b2bec3' : lit ? `rgba(253, 203, 110, ${0.15 + brightness * 0.85})` : '#fff5cc'}
          stroke="#2d3436"
          strokeWidth={2}
          shadowColor="#fdcb6e"
          shadowBlur={lit ? brightness * 50 : 0}
          shadowOpacity={lit ? brightness : 0}
        />
        {burnt ? (
          <>
            <Line points={[-radius * 0.7, -radius * 0.5, radius * 0.7, radius * 0.5]} stroke="#2d3436" strokeWidth={1.5} />
            <Line points={[-radius * 0.5, radius * 0.6, 0, -radius * 0.2, radius * 0.5, radius * 0.6]} stroke="#2d3436" strokeWidth={1.5} />
          </>
        ) : (
          <Line points={[-6, 4, 0, -4, 6, 4]} stroke="#e17055" strokeWidth={1.5} />
        )}
        <Text
          x={-COMPONENT_WIDTH / 2}
          y={COMPONENT_HEIGHT / 2 + 2}
          width={COMPONENT_WIDTH}
          align="center"
          text={burnt ? '⚡ burnt' : lit ? `${milliamps} mA` : '0 mA'}
          fontSize={12}
          fontStyle="bold"
          fill={burnt ? '#d63031' : '#2d3436'}
        />
        {terminalCircles}
      </Group>
    );
  }

  if (c.kind === 'resistor') {
    const ohms = c.ohms ?? DEFAULT_RESISTOR_OHMS;
    const zigPoints = buildZigzag(-COMPONENT_WIDTH / 2 + 14, COMPONENT_WIDTH / 2 - 14, 6, 7);
    return (
      <Group {...groupCommon}>
        {selectionRing}
        <Line
          points={[-COMPONENT_WIDTH / 2, 0, -COMPONENT_WIDTH / 2 + 14, 0]}
          stroke="#2d3436"
          strokeWidth={3}
        />
        <Line
          points={[COMPONENT_WIDTH / 2 - 14, 0, COMPONENT_WIDTH / 2, 0]}
          stroke="#2d3436"
          strokeWidth={3}
        />
        <Line
          points={zigPoints}
          stroke="#2d3436"
          strokeWidth={3}
          lineJoin="round"
          lineCap="round"
        />
        <Text
          x={-COMPONENT_WIDTH / 2}
          y={-COMPONENT_HEIGHT / 2 + 4}
          width={COMPONENT_WIDTH}
          align="center"
          text={`${ohms} Ω`}
          fontSize={13}
          fontStyle="bold"
          fill="#2d3436"
        />
        {terminalCircles}
      </Group>
    );
  }

  const closed = c.closed ?? false;
  return (
    <Group {...groupCommon}>
      {selectionRing}
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

function buildZigzag(x1: number, x2: number, amplitude: number, peaks: number): number[] {
  const pts: number[] = [x1, 0];
  const step = (x2 - x1) / (peaks * 2);
  for (let i = 1; i <= peaks * 2; i++) {
    const x = x1 + step * i;
    const y = i % 2 === 1 ? -amplitude : amplitude;
    pts.push(x, y);
  }
  pts.push(x2, 0);
  return pts;
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

function renderRotateButton(
  placed: PlacedComponent[],
  selectedId: string,
  onRotate: (id: string) => void,
  Circle: any,
  Text: any,
  Group: any,
) {
  const c = placed.find((p) => p.id === selectedId);
  if (!c) return null;
  const bx = c.x + COMPONENT_WIDTH / 2 + 10;
  const by = c.y - COMPONENT_HEIGHT / 2 - 10;
  const handleClick = (e: any) => {
    e.cancelBubble = true;
    onRotate(selectedId);
  };
  return (
    <Group x={bx} y={by} onClick={handleClick} onTap={handleClick}>
      <Circle radius={14} fill="#0984e3" stroke="#0652a3" strokeWidth={1.5} shadowBlur={4} shadowOpacity={0.3} />
      <Text x={-6} y={-7} text="↻" fontSize={16} fontStyle="bold" fill="#fff" listening={false} />
    </Group>
  );
}

function renderRemoveButton(
  placed: PlacedComponent[],
  selectedId: string,
  onRemove: (id: string) => void,
  Circle: any,
  Text: any,
  Group: any,
) {
  const c = placed.find((p) => p.id === selectedId);
  if (!c || c.kind === 'battery') return null;
  const bx = c.x - COMPONENT_WIDTH / 2 - 10;
  const by = c.y - COMPONENT_HEIGHT / 2 - 10;
  const handleClick = (e: any) => {
    e.cancelBubble = true;
    onRemove(selectedId);
  };
  return (
    <Group x={bx} y={by} onClick={handleClick} onTap={handleClick}>
      <Circle radius={14} fill="#e17055" stroke="#b94f3a" strokeWidth={1.5} shadowBlur={4} shadowOpacity={0.3} />
      <Text x={-5} y={-8} text="×" fontSize={20} fontStyle="bold" fill="#fff" listening={false} />
    </Group>
  );
}

function renderOhmsPicker(
  placed: PlacedComponent[],
  selectedId: string,
  onSetOhms: (id: string, ohms: number) => void,
  Rect: any,
  Text: any,
  Group: any,
) {
  const c = placed.find((p) => p.id === selectedId);
  if (!c || c.kind !== 'resistor') return null;
  const current = c.ohms ?? DEFAULT_RESISTOR_OHMS;
  const chipW = 44;
  const chipH = 24;
  const gap = 4;
  const totalW = RESISTOR_OHMS_OPTIONS.length * chipW + (RESISTOR_OHMS_OPTIONS.length - 1) * gap;
  const startX = c.x - totalW / 2;
  const y = c.y - COMPONENT_HEIGHT / 2 - chipH - 32;
  return (
    <Group>
      {RESISTOR_OHMS_OPTIONS.map((ohms, i) => {
        const x = startX + i * (chipW + gap);
        const selected = ohms === current;
        const handleClick = (e: any) => {
          e.cancelBubble = true;
          onSetOhms(selectedId, ohms);
        };
        return (
          <Group key={ohms} x={x} y={y} onClick={handleClick} onTap={handleClick}>
            <Rect
              width={chipW}
              height={chipH}
              fill={selected ? '#0984e3' : '#ffffff'}
              stroke={selected ? '#0652a3' : '#b2bec3'}
              strokeWidth={1.5}
              cornerRadius={6}
              shadowBlur={2}
              shadowOpacity={0.25}
            />
            <Text
              x={0}
              y={5}
              width={chipW}
              align="center"
              text={`${ohms} Ω`}
              fontSize={12}
              fontStyle="bold"
              fill={selected ? '#ffffff' : '#2d3436'}
              listening={false}
            />
          </Group>
        );
      })}
    </Group>
  );
}
