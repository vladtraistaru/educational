# Balance Lab

## Purpose

Teaches the law of the lever — a beam balances when `mass × distance` is equal on both sides — through a predict-then-test loop. Because torque is a product, every puzzle is also multiplication and division practice: balancing `3 kg at notch 8` means finding the pair that makes 24 on the other side.

The three challenge kinds build toward mechanical advantage: a small mass far from the pivot lifts a large mass close to it.

## User Experience

1. The menu explains the big idea (`force × distance`) and offers a **Start** button plus the level count.
2. Each level shows a seesaw: a beam on a triangular fulcrum with 10 numbered notches on each side, counting outward from the pivot.
3. **Crates** (fixed loads, brown) are pre-placed by the level and cannot be moved. The learner's **blocks** (available masses, coloured by weight) sit in a tray below.
4. The learner taps a block in the tray to select it, then taps any free notch to place it. Tapping an already-placed block returns it to the tray. A selected block is highlighted; tapping it again deselects.
5. While placing, the beam is **held level** — the outcome is hidden on purpose, so the learner must reason rather than nudge a weight and watch.
6. Once at least one block is placed, the **prediction row** appears: *tips left* / *stays balanced* / *tips right*. Choosing one enables the **Release** button.
7. **Release** animates the beam to its tilt angle (proportional to the net torque, saturating — a visual model, not a rigid-body swing).
8. Feedback then shows the torque arithmetic for both sides (`3 × 8 = 24` vs `6 × 4 = 24`), whether the prediction was right, and whether the beam balanced.
9. A balanced beam unlocks **Next**; an unbalanced one offers **Try again**, which re-holds the beam and keeps the blocks in place so the learner can adjust one at a time.
10. After the last level the result screen shows total stars, levels solved, and correct predictions, with **Play again**.

### Challenge kinds

| Kind | Setup | Idea |
|------|-------|------|
| `balance` | Crates on one or both sides, blocks that match the missing torque | `m₁ × d₁ = m₂ × d₂` |
| `lift` | A heavy crate close to the pivot, only a light block available | Mechanical advantage — go further out |
| `fewest` | A large torque and several blocks, capped by `maxBlocks` | Factor thinking; find the efficient placement |

### Stars

Per level: **3** when the first release balances *and* the prediction was right, **2** when the first release balances, **1** when it balances later.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Screen router (`menu` / `playing` / `results`) and run totals (stars, solved, correct predictions). |
| `MenuScreen.tsx` | Big-idea intro and start button. |
| `ChallengeScreen.tsx` | One level: placement state, prediction, release, feedback, level advance. |
| `BeamStage.tsx` | SVG seesaw — fulcrum, rotating beam, notches, crates and blocks. Pure presentation. |
| `BlockTray.tsx` | Unplaced blocks with selection state. |
| `ResultScreen.tsx` | Run totals and replay. |
| `levels.ts` | The 12-level table and `PlacedWeight` / `Level` types. |
| `translations.ts` | EN/FR strings, including per-level hints. |

Physics lives in `@/lib/science/mechanics` (`netTorque`, `tilt`, `isBalanced`, `beamAngle`, `solveBalance`), not in the module.

## Key State

In `Activity.tsx`:

- `screen: 'menu' | 'playing' | 'results'`
- `levelIndex: number` — index into `LEVELS`
- `totals: { stars, solved, predicted }` — accumulated across the run

In `ChallengeScreen.tsx`:

- `placed: PlacedWeight[]` — the learner's blocks with `side` and `distance`; crates come from the level and stay separate
- `selectedBlockId: string | null` — tap-to-select, tap-to-place
- `prediction: Tilt | null` — locked in before release
- `released: boolean` — drives the beam angle (held at 0 until true) and reveals feedback
- `attempts: number` — releases so far, used for the star award

The beam angle is derived, not stored: `released ? beamAngle(allLoads) : 0`, animated by a CSS transition on the SVG group's `transform`.
