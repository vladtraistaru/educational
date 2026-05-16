# Lenses and Curved Mirrors

## Purpose

Interactive introduction to lenses and curved mirrors. Learners place a parallel-bundle light source and one or more thin optical elements (converging/diverging lenses, concave/convex mirrors) on a canvas and watch parallel rays converge to or diverge from a focal point.

## User Experience

1. A react-konva canvas (800x500, responsive) shows a parallel-bundle source on the left and one converging lens at the centre by default.
2. "Shine" toggles the source on/off. When turned on, the rays animate in segment by segment (same draw-in animation as `laser-and-mirrors`).
3. "Add element" opens a dropdown with four choices: converging lens, diverging lens, concave mirror, convex mirror.
4. Drag the source or any element to reposition. Click to select, then use the Transformer rotation handle to rotate or the top/bottom anchors to resize the element's aperture (height).
5. When an element is selected, a yellow curvature handle appears on the bulge of the lens or mirror. Drag it along the optical axis to make the element more or less curved — the focal length is computed live from the geometry (`f = (a² + b²) / (4b)` where `a` is the aperture half-height and `b` is the bulge depth). When the source is selected, ray-count and bundle-width sliders appear.
6. Each ray bends or reflects according to the paraxial thin-element rule for its kind:
   - **Converging lens** — ray exits toward the focal point on the far side of the lens.
   - **Diverging lens** — ray exits as if coming from the focal point on the source side.
   - **Concave mirror** — ray reflects toward the focal point on the source side.
   - **Convex mirror** — ray reflects as if coming from the virtual focal point behind the mirror.
7. Rays missing an element's plane pass straight through. Rays update live during drag and rotate.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Owns shape state, renders Konva Stage/Layer with source, elements, ray polylines, and Transformer. Handles drag, rotate, beam animation, and the controls bar. |
| `optics.ts` | Pure logic. `traceParallelBundle()` emits N parallel rays from the source and traces each through the elements using the paraxial bending rule. Defines `OpticalElement`, `BeamSegment`, and the `focalLengthOf(halfHeight, bulge)` / `bulgeFromFocalLength(halfHeight, focalLength)` helpers that derive focal length from element geometry. |
| `optics.test.ts` | Vitest unit tests for the bending math. |
| `SourceShape.tsx` | Konva visual for the parallel-bundle emitter (a bar with N tick marks). |
| `ElementShape.tsx` | Konva visual for each element kind: lentil (convex lens), hourglass (concave lens), arc with hatching (concave/convex mirror). Renders the draggable curvature handle and focal-point dots when the element is selected. |

## Key State

- `shapes[]` — array containing one `SourceData` (position, rotation, ray count, bundle width) plus N `ElementData` (id, kind, position, rotation, halfHeight, bulge). Focal length is derived from `(halfHeight, bulge)` and is not stored.
- `selectedId` — which shape has the Transformer attached.
- `sourceOn` / `animating` — source toggle and ray draw-in animation flag.
- `beamTravel` — pixels of ray drawn so far during animation (`Infinity` = fully drawn).
- `lightSpeed` / `beamMax` — advanced sliders for animation speed and per-ray max length.
