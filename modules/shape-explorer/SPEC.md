# Shape Explorer (2D)

## Purpose

Teaches 2D geometry: identifying basic shapes, counting sides and corners, and connecting shapes to real-world objects. Aimed at younger learners (difficulty 2).

## User Experience

1. A row of 8 shape thumbnails at the top: circle, oval, triangle, square, rectangle, pentagon, hexagon, octagon.
2. Clicking a shape shows it large in the main display area with its name.
3. For polygons (triangle through octagon), a "Count the sides!" button starts an animation that highlights each side one by one with a running count. When counting finishes, the shape gets a gold border and "Done!" feedback.
4. For curved shapes (circle, oval), instead of a counting button, a note explains it has 1 curved edge and 0 straight sides.
5. A properties panel shows: number of sides, number of corners, whether all sides are equal, a real-world example with emoji, and a fun fact.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Owns `selectedId`. Composes ShapeSelector, ShapeDisplay, ShapeProperties. |
| `ShapeSelector.tsx` | Horizontal grid of SVG thumbnails. Highlights the selected shape. |
| `ShapeDisplay.tsx` | Large SVG of the selected shape. Manages the counting animation state (`highlightCount`, `isCounting`). |
| `ShapeProperties.tsx` | Panel showing sides, corners, regularity, real-world example, fun fact. |
| `shapes.ts` | Data for all 8 shapes: id, name, sides, corners, vertices, color, example, emoji, fun fact. |

## Key State

- `Activity.tsx`: `selectedId` — which shape is selected
- `ShapeDisplay.tsx`: `highlightCount` (current side in animation), `isCounting` (animation running). Both reset when the selected shape changes.
