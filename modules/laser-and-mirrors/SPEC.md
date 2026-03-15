# Laser and Mirrors

## Purpose

Interactive introduction to light and reflection. Learners position a laser and mirrors on a canvas and observe how the beam bounces, demonstrating the law of reflection.

## User Experience

1. An SVG canvas (800x500) shows a red laser and one mirror.
2. "Shine" toggles the laser on/off. When turned on, the first beam segment animates in.
3. "Add mirror" places a new mirror on the canvas.
4. Drag the laser or a mirror body to reposition. Drag the circular handle to rotate.
5. The beam traces from the laser tip, bouncing off each mirror it hits. The beam updates live during drag.
6. The reflection follows the law of reflection: angle of incidence equals angle of reflection. Up to 20 bounces are traced.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Owns laser state (on/off, position, angle), mirrors array, and animation flag. |
| `OpticsCanvas.tsx` | SVG rendering: laser body, mirrors, beam segments, rotation handles. Handles pointer events for drag and rotate using pointer capture. |
| `optics.ts` | Pure logic: `traceBeam()` ray-traces from laser through mirrors using ray-segment intersection and vector reflection. Defines `Point`, `Mirror`, `BeamSegment` types and default positions. |

## Key State

- `Activity.tsx`: `laserOn`, `animating`, `laserPos`, `laserAngle`, `mirrors[]`, `nextId` (ref for mirror IDs)
- `OpticsCanvas.tsx`: local `interaction` state (`'idle' | 'drag' | 'rotate'`) for pointer event handling
