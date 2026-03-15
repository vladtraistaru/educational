# Laser and Mirrors

## Purpose

Interactive introduction to light and reflection. Learners position a laser and mirrors on a canvas and observe how the beam bounces, demonstrating the law of reflection.

## User Experience

1. A react-konva canvas (800x500, responsive) shows a red laser and one mirror.
2. "Shine" toggles the laser on/off. When turned on, the beam animates in segment by segment.
3. "Add mirror" places a new mirror on the canvas.
4. Drag the laser or a mirror to reposition. Click to select, then use the Transformer rotation handle to rotate.
5. The beam traces from the laser tip, bouncing off each mirror it hits. The beam updates live during drag and rotate.
6. The reflection follows the law of reflection: angle of incidence equals angle of reflection. Up to 20 bounces are traced.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | All-in-one: owns shape state, renders Konva Stage/Layer with laser, mirrors, beam segments, and Transformer. Handles drag, rotate, beam animation. |
| `optics.ts` | Pure logic: `traceBeam()` ray-traces from laser through mirrors using ray-segment intersection and vector reflection. Defines `Point`, `Mirror`, `BeamSegment` types and default positions. |

## Key State

- `shapes[]` — array of `ShapeData` objects (laser + mirrors) with position, rotation, dimensions
- `selectedId` — which shape has the Transformer attached
- `laserOn` / `animating` — laser toggle and beam draw-in animation flag
- `beamTravel` — pixels of beam drawn so far during animation (Infinity = fully drawn)
