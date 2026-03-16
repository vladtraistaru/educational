---
name: konva-transformer
description: Patterns for Konva Transformer resize, rotate, and constrain behavior. Use when implementing or fixing Transformer-based interactions — resize handles, rotation, minimum size, flip prevention, boundBoxFunc, or anchor configuration.
---

# Konva Transformer

## Core Concept

Transformer changes `scaleX`/`scaleY` on nodes, **never** `width`/`height`. You must convert scale to dimensions yourself after the transform.

## Resize: Scale-to-Dimensions Pattern

The official Konva pattern (from Konva's author):

```javascript
// Vanilla Konva — on the shape, not the transformer
shape.on('transform', () => {
  shape.width(Math.max(MIN, shape.width() * shape.scaleX()));
  shape.height(Math.max(MIN, shape.height() * shape.scaleY()));
  shape.scaleX(1);
  shape.scaleY(1);
});
```

For **react-konva**, do this in `onTransformEnd` (not `onTransform`) to avoid fighting React's reconciliation:

```jsx
onTransformEnd={(e) => {
  const node = e.target;
  const scaleX = node.scaleX();
  const scaleY = node.scaleY();
  node.scaleX(1);
  node.scaleY(1);
  onChange({
    x: node.x(),
    y: node.y(),
    width: Math.max(MIN, node.width() * scaleX),
    height: Math.max(MIN, node.height() * scaleY),
  });
}}
```

**Why `onTransformEnd` and not `onTransform` in React**: resetting scale during `onTransform` creates a feedback loop — Konva sees the scale change and re-adjusts position each frame, causing drift/translation artifacts.

## Preventing Flip (Critical)

Set `flipEnabled={false}` on the Transformer. Without this, dragging an anchor past the opposite edge mirrors/flips the shape.

```jsx
<Transformer flipEnabled={false} />
```

## Minimum Size with boundBoxFunc

`boundBoxFunc` operates in **absolute coordinates**. It receives `(oldBox, newBox)` and returns the box to use.

**Correct pattern** — return `oldBox` to reject the transform entirely:

```jsx
boundBoxFunc={(oldBox, newBox) => {
  if (Math.abs(newBox.width) < MIN_WIDTH || Math.abs(newBox.height) < MIN_HEIGHT) {
    return oldBox;
  }
  return newBox;
}}
```

**Wrong pattern** — computing a modified box with clamped values. This causes position drift because the box coordinates are interdependent. Returning `oldBox` is simpler and correct.

## Detecting Which Anchor Is Active

Use `transformer.getActiveAnchor()` — returns the anchor name string:

```javascript
transformerRef.current.getActiveAnchor()
// Returns: 'middle-left', 'middle-right', 'top-left', 'bottom-right', 'rotater', etc.
```

Can be called during `transform`, `transformstart`, or inside `anchorDragBoundFunc`.

## Available Anchors

```
top-left       top-center      top-right
    ●──────────────●──────────────●
    │                              │
middle-left ●                      ● middle-right
    │                              │
    ●──────────────●──────────────●
bottom-left   bottom-center   bottom-right
```

Plus `rotater` (floating above, connected by a line).

Configure via `enabledAnchors`:
```jsx
enabledAnchors={['middle-left', 'middle-right']}  // horizontal resize only
enabledAnchors={[]}                                 // rotation only
```

## Asymmetric Resize (One Side Fixed)

Default behavior (`centeredScaling={false}`): the opposite anchor stays fixed. Konva adjusts `node.x()` and `node.y()` to compensate. Just read `node.x()` and `node.y()` in `onTransformEnd` — they already reflect the correct new center.

For centered/symmetric resize: `centeredScaling={true}`.

## Rotation-Only (No Resize)

```jsx
<Transformer
  enabledAnchors={[]}
  rotateEnabled={true}
/>
```

When rotation-only, the node's position should NOT change. In `onTransform`, reset position to the stored value and reset scale:

```javascript
onTransform={(e) => {
  const node = e.target;
  node.x(storedX);
  node.y(storedY);
  node.scaleX(1);
  node.scaleY(1);
  setRotation(node.rotation());
}}
```

This is safe in `onTransform` because no resize is happening — no feedback loop.

## Key Config Properties

| Property | Default | Purpose |
|----------|---------|---------|
| `flipEnabled` | `true` | Allow mirror/flip past edges |
| `centeredScaling` | `false` | Resize from center vs opposite anchor |
| `keepRatio` | `true` | Lock aspect ratio on corner anchors |
| `rotateAnchorOffset` | `50` | Distance of rotation handle from border |
| `anchorSize` | `10` | Size of anchor squares/circles |
| `anchorCornerRadius` | `0` | Round corners on anchors (set to anchorSize/2 for circles) |
| `padding` | `0` | Extra space around node bounding box |
| `ignoreStroke` | `false` | Exclude stroke from bounding box |

## forceUpdate()

After programmatically changing a node's dimensions or position, call `transformer.forceUpdate()` to recalculate the bounding box:

```javascript
requestAnimationFrame(() => {
  transformerRef.current?.forceUpdate();
  transformerRef.current?.getLayer()?.batchDraw();
});
```

Use `requestAnimationFrame` to wait for React to re-render first.

## Per-Shape Transformer Config

When different shapes need different Transformer behavior (e.g., mirrors resize, lasers don't), either:

1. **Reconfigure dynamically** when selection changes:
   ```javascript
   useEffect(() => {
     const tr = transformerRef.current;
     tr.enabledAnchors(isMirror ? ['middle-left', 'middle-right'] : []);
   }, [selectedId]);
   ```

2. **Per-shape Transformer** (official react-konva pattern): render a Transformer inside each shape component, only when selected. Avoids shared-state complexity.

## Common Pitfalls

1. **Resetting scale in `onTransform`** — causes position drift feedback loop with React. Use `onTransformEnd` for resize. Only use `onTransform` for rotation-only.
2. **Computing modified boxes in `boundBoxFunc`** — use `return oldBox` to reject, not computed values.
3. **Missing `flipEnabled={false}`** — shapes flip past minimum size.
4. **Forgetting `forceUpdate()`** — Transformer bounding box desyncs after programmatic changes.
5. **Using `node.width()` on Groups** — Groups don't have explicit width. The Transformer computes it from children's bounding box.
