# Multiplication Patterns

## Purpose

Explores multiplication through arrays and a 12x12 times-table grid. Learners discover patterns: commutativity, square numbers, even/odd products, the nines trick, ones-digit cycles, doubling chains, digit sums, and multiples overlap.

## User Experience

Two sections stacked vertically:

### Array Builder (top)
- Two factors (1-12) adjustable with up/down buttons.
- A dot array shows rows x columns in real time. Rows use different colors.
- The equation `A x B = product` is displayed.
- "Flip it!" swaps the factors to demonstrate commutativity (same product, different array).

### Pattern Explorer (below)
- A row of 9 pattern buttons, each with an icon.
- Selecting a pattern highlights relevant cells in the 12x12 grid and shows a description.
- Some patterns have extra controls:
  - **Times Table / Ones Digit** — number picker for which table to highlight
  - **Mirror (Commutativity)** — click a cell to highlight its mirror across the diagonal
  - **Doubling** — toggle between two chains (2-4-8 vs 3-6-12)
  - **Overlap** — pick two numbers to see their multiples and LCM
  - **Ones Digit** — shows a DigitStar (SVG connecting digits 0-9 in a circle by their cycle)

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Owns all state. Composes ArrayBuilder and PatternPanel + MultiplicationGrid. |
| `ArrayBuilder.tsx` | Factor selectors (TappableNumber), dot array, flip button. |
| `MultiplicationGrid.tsx` | 12x12 grid using GridRow. Applies cell highlighting via pattern logic. |
| `PatternPanel.tsx` | Pattern buttons, descriptions, and pattern-specific controls (NumberPicker, OnesDigitCycleDisplay, DoublingPanel, DigitSumLegend, OverlapPanel). |
| `DigitStar.tsx` | SVG visualization: digits 0-9 arranged on a circle, connected by the ones-digit cycle for a given table. |
| `patterns.ts` | Pure logic: defines each pattern's `getCellHighlight` and `getCellColor` functions. No UI. |

## Key State

All in `Activity.tsx`:

- `factorA`, `factorB` — Array Builder factors
- `activePatternId` — selected pattern (or null)
- `selectedTimesTable` — number for times-table and ones-digit patterns
- `mirrorCell` — encoded row/col for commutativity highlight
- `selectedChain` — 1 or 2 for doubling chain selection
- `overlapA`, `overlapB` — numbers for multiples overlap pattern
