'use client';

import { useEffect, useRef } from 'react';
import type Konva from 'konva';
import { Group, Line, Circle, Rect } from 'react-konva';
import { type ElementKind, focalLengthOf, MIN_BULGE } from './optics';

interface ElementShapeProps {
  x: number;
  y: number;
  rotation: number;
  kind: ElementKind;
  halfHeight: number;
  bulge: number;
  selected: boolean;
  draggable: boolean;
  onClick: () => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransform: (e: Konva.KonvaEventObject<Event>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
  onBulgeChange: (bulge: number) => void;
  shapeRef: (node: Konva.Group | null) => void;
}

const HATCH_SPACING = 10;
const HATCH_LENGTH = 10;

function lensPoints(halfHeight: number, bulge: number): number[] {
  const steps = 12;
  const pts: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = -halfHeight + 2 * halfHeight * t;
    const x = bulge * Math.sin(Math.PI * t);
    pts.push(x, y);
  }
  for (let i = steps; i >= 0; i--) {
    const t = i / steps;
    const y = -halfHeight + 2 * halfHeight * t;
    const x = -bulge * Math.sin(Math.PI * t);
    pts.push(x, y);
  }
  return pts;
}

function divergingLensPoints(halfHeight: number, bulge: number): number[] {
  const pts: number[] = [];
  const tipY = halfHeight + 6;
  pts.push(bulge, -tipY);
  pts.push(bulge, tipY);
  pts.push(0, halfHeight - 4);
  pts.push(-bulge, tipY);
  pts.push(-bulge, -tipY);
  pts.push(0, -halfHeight + 4);
  return pts;
}

function mirrorArcPoints(halfHeight: number, bulge: number): number[] {
  const steps = 16;
  const pts: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = -halfHeight + 2 * halfHeight * t;
    const x = bulge * (1 - 4 * (t - 0.5) * (t - 0.5));
    pts.push(x, y);
  }
  return pts;
}

function hatchLines(halfHeight: number, baseBulge: number, sign: number): number[][] {
  const lines: number[][] = [];
  const count = Math.floor((2 * halfHeight) / HATCH_SPACING);
  const startY = -halfHeight + ((2 * halfHeight) - count * HATCH_SPACING) / 2;
  for (let i = 0; i <= count; i++) {
    const y = startY + i * HATCH_SPACING;
    const t = (y + halfHeight) / (2 * halfHeight);
    const surfaceX = sign * baseBulge * (1 - 4 * (t - 0.5) * (t - 0.5));
    const x1 = surfaceX;
    const x2 = surfaceX + sign * HATCH_LENGTH * 0.7;
    const y2 = y + HATCH_LENGTH * 0.7;
    lines.push([x1, y, x2, y2]);
  }
  return lines;
}

export default function ElementShape({
  x,
  y,
  rotation,
  kind,
  halfHeight,
  bulge,
  selected,
  draggable,
  onClick,
  onDragMove,
  onTransform,
  onTransformEnd,
  onBulgeChange,
  shapeRef,
}: ElementShapeProps) {
  const isMirror = kind === 'concave-mirror' || kind === 'convex-mirror';
  const isConverging = kind === 'converging-lens' || kind === 'concave-mirror';
  const handleSign = isMirror ? -1 : 1;
  const f = focalLengthOf(halfHeight, bulge);

  let shapeNode: React.ReactNode = null;
  let hatching: React.ReactNode = null;
  let focalDots: React.ReactNode = null;

  if (kind === 'converging-lens') {
    shapeNode = (
      <Line
        points={lensPoints(halfHeight, bulge)}
        closed
        fill="rgba(116, 185, 255, 0.55)"
        stroke="#0984e3"
        strokeWidth={2}
        tension={0.5}
      />
    );
  } else if (kind === 'diverging-lens') {
    shapeNode = (
      <Line
        points={divergingLensPoints(halfHeight, bulge)}
        closed
        fill="rgba(116, 185, 255, 0.55)"
        stroke="#0984e3"
        strokeWidth={2}
        tension={0.4}
      />
    );
  } else if (kind === 'concave-mirror') {
    shapeNode = (
      <Line
        points={mirrorArcPoints(halfHeight, -bulge)}
        stroke="#2d3436"
        strokeWidth={3}
        lineCap="round"
        tension={0.5}
      />
    );
    const lines = hatchLines(halfHeight, -bulge, 1);
    hatching = lines.map((p, i) => (
      <Line key={i} points={p} stroke="#636e72" strokeWidth={1.5} />
    ));
  } else {
    shapeNode = (
      <Line
        points={mirrorArcPoints(halfHeight, -bulge)}
        stroke="#2d3436"
        strokeWidth={3}
        lineCap="round"
        tension={0.5}
      />
    );
    const lines = hatchLines(halfHeight, -bulge, -1);
    hatching = lines.map((p, i) => (
      <Line key={i} points={p} stroke="#636e72" strokeWidth={1.5} />
    ));
  }

  if (selected) {
    const dotColor = '#fdcb6e';
    if (isMirror) {
      const x1 = isConverging ? -f : f;
      focalDots = (
        <>
          <Circle x={x1} y={0} radius={4} fill={dotColor} />
          <Line
            points={[-300, 0, 300, 0]}
            stroke="#b2bec3"
            strokeWidth={1}
            dash={[4, 4]}
            opacity={0.7}
          />
        </>
      );
    } else {
      focalDots = (
        <>
          <Circle x={-f} y={0} radius={4} fill={dotColor} />
          <Circle x={f} y={0} radius={4} fill={dotColor} />
          <Line
            points={[-300, 0, 300, 0]}
            stroke="#b2bec3"
            strokeWidth={1}
            dash={[4, 4]}
            opacity={0.7}
          />
        </>
      );
    }
  }

  const maxBulge = halfHeight * 0.95;
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    const node = e.target;
    const rawX = node.x();
    let newBulge = Math.abs(rawX);
    if (newBulge < MIN_BULGE) newBulge = MIN_BULGE;
    if (newBulge > maxBulge) newBulge = maxBulge;
    node.x(handleSign * newBulge);
    node.y(0);
    onBulgeChange(newBulge);
  };

  const ANCHOR_SIZE = 20;
  const curvatureHandle = selected ? (
    <Rect
      x={handleSign * bulge}
      y={0}
      width={ANCHOR_SIZE}
      height={ANCHOR_SIZE}
      offsetX={ANCHOR_SIZE / 2}
      offsetY={ANCHOR_SIZE / 2}
      cornerRadius={10}
      fill="white"
      stroke="#0099ff"
      strokeWidth={1}
      draggable
      onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => {
        e.cancelBubble = true;
      }}
      onTouchStart={(e: Konva.KonvaEventObject<TouchEvent>) => {
        e.cancelBubble = true;
      }}
      onClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
        e.cancelBubble = true;
      }}
      onDragMove={handleDragMove}
    />
  ) : null;

  const bodyRef = useRef<Konva.Group | null>(null);
  const outerRef = useRef<Konva.Group | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const body = bodyRef.current;
    if (!outer || !body) return;
    outer.getClientRect = function (config?: any) {
      return body.getClientRect(config);
    };
  });

  const setOuterRef = (node: Konva.Group | null) => {
    outerRef.current = node;
    shapeRef(node);
  };

  return (
    <Group
      ref={setOuterRef}
      x={x}
      y={y}
      rotation={rotation}
      draggable={draggable}
      onClick={onClick}
      onTap={onClick}
      onDragMove={onDragMove}
      onTransform={onTransform}
      onTransformEnd={onTransformEnd}
    >
      {focalDots}
      <Group ref={bodyRef}>
        {hatching}
        {shapeNode}
      </Group>
      {curvatureHandle}
    </Group>
  );
}
