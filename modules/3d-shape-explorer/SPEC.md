# 3D Shape Explorer

## Purpose

Teaches 3D geometry: faces, edges, and vertices. Learners spin 3D shapes in a Three.js viewer and see their properties and real-world examples.

## User Experience

1. A horizontally scrollable row of shape buttons with emoji icons: cube, cuboid, sphere, cylinder, cone, triangular prism, square pyramid.
2. The selected shape renders in a 3D canvas. It auto-rotates so learners see it from all sides.
3. Dragging on the canvas switches to manual orbit control (auto-rotation stops). Selecting a different shape resets the camera and restarts auto-rotation.
4. An info panel shows: shape name, number of faces (flat and curved counted separately), edges, vertices, and a real-world example sentence.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Owns `selectedId`. Composes ShapeSelector, ShapeViewer, ShapeInfo. |
| `ShapeSelector.tsx` | Scrollable button row with emoji + name. Selected shape gets a colored border. |
| `ShapeViewer.tsx` | Three.js canvas via `@react-three/fiber` and `@react-three/drei`. Contains `ShapeGeometry` (maps id to Three.js geometry) and `ShapeMesh` (renders and auto-rotates). Uses `OrbitControls` for manual rotation. |
| `ShapeInfo.tsx` | Properties panel: faces (flat/curved), edges, vertices, example. |
| `shapes.ts` | Data for all 7 shapes: id, name, flatFaces, curvedSurfaces, edges, vertices, color, example. |

## Key State

- `Activity.tsx`: `selectedId` — which 3D shape is selected (default `'cube'`)
- `ShapeViewer.tsx`: `userControlled` — flips to true on first drag, disabling auto-rotation. Resets to false when shape changes.
