# Geometry Rules (Euclidean Postulates)

## Purpose

Teaches Euclid's five postulates through interactive SVG visualizations. Each postulate gets its own step with a hands-on exercise that demonstrates the rule.

## User Experience

A 5-step stepper. Each step shows a card with the postulate's title, description, an interactive SVG, and a hint. Previous/Next buttons navigate between steps. Each step has a distinct accent color.

1. **Straight line** — 8 dots on screen. Click two dots to draw a straight line between them. Demonstrates that a line can connect any two points.
2. **Extend a line** — A horizontal line with drag handles at both ends. Drag outward to extend. Arrows appear when extended. Shows that lines extend indefinitely.
3. **Draw a circle** — Click and drag on the canvas: mousedown sets center, drag sets radius, release commits the circle. Multiple circles with different colors. Shows that a circle is defined by center + radius.
4. **Right angles** — Four right angles at different positions and rotations. A "Compare" button moves them all to the center and aligns them, showing they are identical. "Scatter" returns them.
5. **Parallel lines** — Two horizontal parallel lines. "Extend!" animates both lines stretching outward. Distance markers show the gap stays constant. Shows parallel lines never meet.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Stepper state (`step`), renders the current postulate's sub-component with `key={step}` to force remount on step change. |
| `ConnectDots.tsx` | Postulate 1: click-to-connect dots with lines. |
| `ExtendLine.tsx` | Postulate 2: drag handles to extend a line segment. |
| `DrawCircle.tsx` | Postulate 3: click-and-drag to draw circles. |
| `RightAngles.tsx` | Postulate 4: compare/scatter four right angles. |
| `ParallelLines.tsx` | Postulate 5: animate extending parallel lines. |

## Key State

- `Activity.tsx`: `step` (0-4) — which postulate is displayed
- Each sub-component manages its own interaction state independently (lines drawn, handle positions, circles, animation progress, etc.)
- Using `key={step}` on the sub-component means all local state resets when switching steps
