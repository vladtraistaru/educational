# Billiards

## Purpose

Teaches the physics of collisions and motion on a pool table. Ten missions each isolate one idea, and a free-play table lets the learner break a full rack and experiment:

- a ball keeps going in a straight line until something stops it, and friction slowly slows it down;
- on a cushion, **angle in = angle out** (the same rule as the mirror in Laser and Mirrors);
- in a head-on hit between equal balls, the cue ball stops and the other ball takes all the speed (momentum is passed on);
- after a glancing hit between equal balls, the two balls leave at a **right angle**;
- a heavy ball barely moves and sends the cue ball back; a light ball shoots off faster than the cue ball came in.

## User Experience

1. The menu explains the big idea and how to shoot, with two buttons: **Missions** and **Free play**.
2. **Shooting**: press anywhere on the table and pull away from the white ball, like a slingshot. The cue stick appears behind the ball; the further the pointer is from the ball, the harder the shot (power bar on the bottom rail). Letting go shoots. Letting go next to the ball cancels.
3. While aiming, the **guide line** predicts the cue ball's path through up to two cushion or post bounces. When the path meets a ball, a ghost ball shows the contact point, and two short lines show where the hit ball will go and where the cue ball will go after the hit.
4. While balls move, each leaves a faint **trail**, so the shot can be read afterwards (bounce angles, the 90° split). Trails clear on the next shot.
5. **Missions**: each level shows its goal (sink the ball / sink *n* balls / don't sink the bomb), the shots left, and a "physics idea" card explaining what to look for.
   - Sinking the white ball (a scratch) costs the shot; the white ball goes back to its starting spot.
   - Sinking the bomb ball loses the level. Running out of shots loses the level.
   - A lost level offers **Try again**; a won level shows stars and **Next**. **Restart** is always available.
6. After the last mission the result screen shows stars and levels solved, with **Play again**.
7. **Free play**: a rack of ten balls. The learner can switch the table surface (felt / ice / sand) to feel friction, toggle the guide, and rack again. Shots and balls sunk are counted.

### Stars

`par` is the number of shots a level needs; the learner gets `par + 2` shots. **3** stars at par, **2** at par + 1, **1** at par + 2.

## Physics model

Top-down 2D, table 1000 × 500 units, ball radius 13. Each frame is split into substeps so no ball moves more than ~5 units per substep.

- **Ball–ball**: impulse along the line of centres, restitution 0.95, masses respected. Overlap is pushed apart in inverse-mass proportion.
- **Posts**: fixed round pegs, treated as infinite mass (restitution 0.9).
- **Cushions**: the normal component flips and the whole velocity is scaled by 0.8, so the angle out equals the angle in exactly.
- **Pockets**: six (corners and middle of the long sides). A ball is sunk when its centre is inside a pocket circle; cushions have gaps at the pocket mouths.
- **Friction**: constant deceleration (felt 320, ice 70, sand 900 units/s²); a ball below 4 units/s stops.
- No spin.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Screen router (`menu` / `missions` / `results` / `free`) and run totals. |
| `MenuScreen.tsx` | Big idea, how to shoot, mode buttons. |
| `MissionScreen.tsx` | One level: shots, sunk count, win/lose rules, feedback, stars. |
| `FreePlay.tsx` | Ten-ball rack, surface and guide controls, counters. |
| `ResultScreen.tsx` | Mission totals and replay. |
| `Table.tsx` | Canvas, animation loop, pointer aiming, shot lifecycle (scratch re-spot). Owns the mutable world in a ref. |
| `draw.ts` | Canvas rendering of rails, felt, pockets, posts, trails, guide, balls, cue and power bar. |
| `physics.ts` | Pure engine: types, table and pockets, `step`, `isMoving`, surfaces. |
| `aim.ts` | `aimFromPointer` (pointer → direction + power) and `predictPath` (guide ray cast). |
| `levels.ts` | Ball presets, the 10-level table, rack builder, `buildWorld`, `starsFor`. |
| `translations.ts` | EN/FR strings, per-level title and idea. |

## Key State

In `Activity.tsx`: `screen`, `levelIndex`, `totals: { stars, solved }`.

In `MissionScreen.tsx`: `attempt` (remounts the table), `shots`, `sunk`, `status: 'playing' | 'won' | 'lost'`, `note` (feedback for the last shot).

In `FreePlay.tsx`: `rack` (remount key), `surface`, `guide`, `shots`, `sunk`.

In `Table.tsx` (refs, not state — the loop reads them every frame): `world`, `aim` (pointer while pressed), `shot` (balls sunk during the running shot), `trails`. The table reports each finished shot through `onShotEnd({ potted, scratch })`.
