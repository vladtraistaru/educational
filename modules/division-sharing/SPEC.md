# Division Sharing

## Purpose

Builds **division** from two concrete meanings — **fair sharing** ("12 cookies shared between 3 friends: how many each?") and **grouping** ("12 cookies in bags of 3: how many bags?") — then links each result back to multiplication. Aligns with MER *Opérations* (~8–10 years). Complements `multiplication-patterns`, `multiplication-creatures`, `times-table-challenge`.

## User Experience

The activity has two mode tabs (same tab pattern as `symmetry-play`) and a difficulty toggle.

### Mode 1 — Share (partitive division)

1. Prompt: "Share **12** 🍪 fairly between **3** plates." A pile of N tokens (emoji) sits above P plates.
2. Each plate is a 🍽️ button with its tokens stacked above it. **Tap a plate** → one token moves from the pile onto that plate. **Tap a token on a plate** → it returns to the pile. A **"Deal one each"** button places one token on every plate at once (only if the pile has at least P tokens left) — this models the classic dealing strategy.
3. Each plate shows its count underneath.
4. **Check** button:
   - Correct when every plate holds the same count **and** fewer than P tokens remain in the pile (remaining tokens are the remainder).
   - Wrong feedback is specific: "The plates don't have the same number" or "You can still give one more to every plate".
5. On success, the **equation strip** appears: `12 ÷ 3 = 4`, then `4 × 3 = 12`. With a remainder: `14 ÷ 3 = 4 remainder 2` and `4 × 3 + 2 = 14`. Leftover tokens stay visible in the pile, highlighted, labelled "remainder / reste".
6. **Next** button loads the next scenario.

### Mode 2 — Group (quotitive division)

1. Prompt: "Put **12** 🍎 into bags of **3**. How many bags?" N tokens are laid out in a loose grid.
2. **Tap tokens** to select them into the *current group* (highlighted). When the selection reaches k tokens it automatically closes into a bag (visually outlined, coloured, numbered). Tapping a selected (not yet closed) token deselects it. Tapping a closed bag opens it and returns its tokens.
3. A running counter shows "Bags: 3".
4. **Check**: correct when no more full groups can be made (loose tokens < k). Feedback on wrong: "You can still make another bag".
5. On success the equation strip shows `12 ÷ 3 = 4` and `4 × 3 = 12` (or remainder form as above).
6. **Next** loads the next scenario.

### Difficulty

- **Easy**: no remainder. N ≤ 20, divisor 2–5.
- **Harder**: about half the scenarios have a remainder. N ≤ 30, divisor 2–6.

Scenarios are generated randomly within these bounds (not a fixed list), avoiding divisor 1, quotient 0, and repeating the previous scenario. Each scenario picks an emoji theme (🍪 cookies, 🍎 apples, 🍬 candies, ⚽ balls, 🌸 flowers) with singular/plural EN/FR nouns.

### Score

A small "✓ Correct in a row: N" streak per mode, reset on a wrong Check. No timer. Share and Group each have their own success message ("that is fair!" / "no more bags can be made!").

### Vocabulary (EN / FR)

share / partager · fairly / équitablement · group, bag / groupe, sachet · remainder / reste · divided by / divisé par. Equation strip uses `÷` in both languages; the word "remainder" / "reste" is spelled out.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Mode tabs, difficulty, current scenario, streak, Check/Next, renders the active scene + equation strip. |
| `ShareScene.tsx` | Pile + plates; tap plate to add, tap token to return, "Deal one each"; reports counts to parent. |
| `GroupScene.tsx` | Token field; tap to select; auto-close group at k; tap bag to open; reports groups to parent. |
| `EquationStrip.tsx` | Renders `N ÷ d = q (remainder r)` and the linked multiplication. |
| `division.ts` | Pure logic: `divide(n, d) → { quotient, remainder }`, `shareProblem(plateCounts, pileLeft) → 'unequal' \| 'giveMore' \| null`, `isFairShare(plateCounts, pileLeft)`, `isGroupingComplete(loose, k)`, `generateScenario(difficulty, previous?)` (uses `randInt`; quotient ≥ 2). |
| `division.test.ts` | Vitest tests for `division.ts` (remainders, fair-share edge cases, generator bounds and no-repeat). |
| `themes.ts` | Emoji + EN/FR singular/plural nouns. |
| `Activity.module.css` | Scoped styles: plates, pile, bag outlines, token pop animation. |
| `config.ts`, `translations.ts`, `index.ts` | Standard module files. |

Use `randInt` / `shuffle` from `@/lib/science/math/random` for generation. No new dependencies.

## Key State

- `Activity.tsx`: `mode` (`share` \| `group`), `difficulty` (`easy` \| `harder`), `scenario` (`{ n, divisor, theme }`), `status` (`idle` \| `correct` \| `wrong`), `wrongReason`, `streak` per mode.
- Share state (lifted into `Activity.tsx` so Check can read it): `plates: number[]` (count per plate); pile = `n − sum(plates)`.
- Group state (lifted): `groups: number[][]` (closed bags as token indices), `selection: number[]` (current open group).
- The first scenario is fixed (12 🍪 ÷ 3) to avoid a server/client hydration mismatch; later ones are random. Closed bags are shown in a row above the loose-token field.
- Scene state resets whenever `scenario` or `mode` changes (switching mode keeps the scenario; changing difficulty loads a new one). After a correct Check, scene is read-only until Next.
