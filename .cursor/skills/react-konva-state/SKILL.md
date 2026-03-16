---
name: react-konva-state
description: Patterns for synchronizing React state with Konva canvas nodes. Use when building interactive react-konva components — handling drag, transform, selection, dynamic shapes, or when Konva node state desyncs from React state.
---

# react-konva State Synchronization

## The Fundamental Tension

Konva is imperative (mutates node properties directly). React is declarative (renders from state). Every interaction pattern must bridge this gap: read from Konva nodes, write to React state, let React re-render.

## Drag: Update State on Every Move

```jsx
onDragMove={(e) => {
  setShapes(prev => prev.map(s =>
    s.id === id ? { ...s, x: e.target.x(), y: e.target.y() } : s
  ));
}}
```

`onDragMove` is safe for live updates — Konva drives position, React syncs.

## Transform: Split Between `onTransform` and `onTransformEnd`

**Rotation** (no resize): safe in `onTransform` — reset position and scale, update rotation in state.

**Resize**: ONLY in `onTransformEnd` — read final scale, convert to dimensions, reset scale, update state. Doing this in `onTransform` creates a feedback loop where Konva and React fight over the node's scale and position.

```jsx
// Rotation-only: safe in onTransform
onTransform={(e) => {
  const node = e.target;
  node.x(stored.x); // lock position
  node.y(stored.y);
  node.scaleX(1);   // lock scale
  node.scaleY(1);
  setRotation(node.rotation());
}}

// Resize: ONLY in onTransformEnd
onTransformEnd={(e) => {
  const node = e.target;
  const scaleX = node.scaleX();
  node.scaleX(1);
  node.scaleY(1);
  onChange({
    x: node.x(),
    y: node.y(),
    width: Math.max(MIN, node.width() * scaleX),
    rotation: node.rotation(),
  });
  // Force Transformer to recalculate after React re-renders
  requestAnimationFrame(() => {
    transformerRef.current?.forceUpdate();
    transformerRef.current?.getLayer()?.batchDraw();
  });
}}
```

## Official react-konva Transformer Pattern

From the Konva docs — each shape owns its Transformer:

```jsx
const Shape = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        ref={shapeRef}
        {...shapeProps}
        draggable
        onClick={onSelect}
        onDragEnd={(e) => {
          onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};
```

Key points:
- Transformer is per-shape, rendered only when selected
- `flipEnabled={false}` prevents mirror/flip
- `boundBoxFunc` returns `oldBox` to reject (not a computed box)
- Scale reset happens in `onTransformEnd`
- Position is read from `node.x()`, `node.y()` (Konva already adjusted for anchor)

## Shared Transformer (Alternative Pattern)

When using one Transformer for all shapes, reconfigure it on selection change:

```jsx
useEffect(() => {
  const tr = transformerRef.current;
  const node = selectedId ? shapeRefs.current[selectedId] : null;
  tr.nodes(node ? [node] : []);
  // Reconfigure per shape type
  tr.enabledAnchors(isMirror ? ['middle-left', 'middle-right'] : []);
  tr.getLayer()?.batchDraw();
}, [selectedId]);
```

## Refs for Live Access

Use refs to access current state in callbacks without re-creating them:

```jsx
const shapesRef = useRef(shapes);
shapesRef.current = shapes;

const handleTransform = useCallback((id, e) => {
  const current = shapesRef.current.find(s => s.id === id);
  // current is always fresh, no stale closure
}, []);  // stable callback, no deps needed
```

## Dynamic Konva Import (SSR Safety)

Konva requires `window`/`canvas`. In Next.js, import dynamically:

```jsx
let Konva = null;

useEffect(() => {
  import('react-konva').then((mod) => {
    Konva = mod;
    setLoaded(true);
  });
}, []);
```

Or use `next/dynamic` with `{ ssr: false }` for the component.

## Responsive Canvas

Use `ResizeObserver` to adapt Stage size to container:

```jsx
useEffect(() => {
  const el = containerRef.current;
  const observer = new ResizeObserver(([entry]) =>
    setStageWidth(entry.contentRect.width)
  );
  observer.observe(el);
  return () => observer.disconnect();
}, []);

const scale = stageWidth / VIRTUAL_W;
const stageHeight = VIRTUAL_H * scale;

<Stage width={stageWidth} height={stageHeight} scaleX={scale} scaleY={scale}>
```

## Common Pitfalls

1. **Resetting scale in `onTransform` for resize** — feedback loop causes drift. Use `onTransformEnd`.
2. **Stale closures in callbacks** — use refs to always read current state.
3. **Missing `forceUpdate()`** — after programmatic dimension changes, Transformer bounding box is stale.
4. **Forgetting `flipEnabled={false}`** — shapes flip when resized past zero.
5. **Computing modified boundBoxFunc boxes** — return `oldBox` to reject, don't compute partial boxes.
6. **Using `onDragEnd` vs `onDragMove`** — `onDragEnd` updates once (less re-renders but laggy). `onDragMove` updates live (smooth but more renders). Choose based on whether other elements depend on live position.
