'use client';

import type Konva from 'konva';
import { Group, Rect, Circle } from 'react-konva';
import { SOURCE_HALF } from './optics';

interface SourceShapeProps {
  x: number;
  y: number;
  rotation: number;
  rayCount: number;
  bundleWidth: number;
  draggable: boolean;
  onClick: () => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransform: (e: Konva.KonvaEventObject<Event>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
  shapeRef: (node: Konva.Group | null) => void;
}

export default function SourceShape({
  x,
  y,
  rotation,
  rayCount,
  bundleWidth,
  draggable,
  onClick,
  onDragMove,
  onTransform,
  onTransformEnd,
  shapeRef,
}: SourceShapeProps) {
  const bodyW = SOURCE_HALF * 2;
  const bodyH = Math.max(bundleWidth + 20, 40);
  const dots: number[] = [];
  for (let i = 0; i < rayCount; i++) {
    const t = rayCount === 1 ? 0 : i / (rayCount - 1) - 0.5;
    dots.push(t * bundleWidth);
  }
  return (
    <Group
      ref={shapeRef}
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
      <Rect
        x={-SOURCE_HALF}
        y={-bodyH / 2}
        width={bodyW}
        height={bodyH}
        fill="#2d3436"
        cornerRadius={6}
      />
      <Rect
        x={SOURCE_HALF - 6}
        y={-bodyH / 2 + 4}
        width={4}
        height={bodyH - 8}
        fill="#fdcb6e"
        cornerRadius={2}
      />
      {dots.map((dy, i) => (
        <Circle
          key={i}
          x={SOURCE_HALF + 2}
          y={dy}
          radius={3}
          fill="#ff7675"
        />
      ))}
    </Group>
  );
}
