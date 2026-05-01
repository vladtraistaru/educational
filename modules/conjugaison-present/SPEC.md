# conjugaison-present — SPEC

## Purpose

Help a 9-year-old (PER cycle 2) systematise the **présent de l'indicatif** by completing conjugation tables one cell at a time, with each correct answer highlighting the **terminaison** so the pattern becomes visible.

## User Experience

1. **Start screen** — title, intro line, and **four big buttons**: *1er groupe*, *2e groupe*, *Irréguliers*, *Mélange*. Tapping one starts a round immediately.
2. **Round** — 5 verbs drawn from the chosen pool (no repeats unless pool < 5; never two in a row). Progress text: *Verbe X / 5*.
3. **Per verb** — a 6-row table (`je`, `tu`, `il/elle/on`, `nous`, `vous`, `ils/elles`) is shown for the current verb at présent.
   - `je` and `nous` are pre-filled.
   - The remaining 4 cells are revealed **one at a time, top-to-bottom**: `tu` → `il/elle/on` → `vous` → `ils/elles`.
   - The pronoun shown for the `il/elle/on` row is one of `il`/`elle`/`on` picked at random for this verb; same for `ils`/`elles`.
   - Below the table, a row of **4 chips**: the correct form + 3 other random forms of the **same verb** at présent.
   - Tap correct chip → it animates into the cell, the cell turns green for 1 s, the **terminaison flashes** and then settles to bold for the rest of the verb's display. The next empty cell becomes the target.
   - Tap wrong chip → chip shakes red ~400 ms, cell stays empty, chip remains tappable.
4. **End of verb** — when all 6 cells are filled, the full table is shown for 1.5 s with all terminaisons in bold, then the next verb loads.
5. **End of round** — recap titled *Bravo !* / *Well done!*: a table of the 5 verbs with a green check (no mistakes) or orange dot (≥ 1 wrong pick on any cell). Tap an orange-dot row to expand and show the full conjugation. Two buttons: **Recommencer** (back to start screen) and **Retour** (homepage `/`).

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Top-level state machine: `pool` → `playing` → `recap`. Owns the round state, the per-verb state, the trickyVerbs set, and the timers for green-flash and end-of-verb reveal. |
| `PoolSelector.tsx` | Generic 4-button start screen. Takes a label per pool + an `onPick(poolId)` callback. Reusable by modules 2 and 3. |
| `ConjugationTable.tsx` | Renders the 6-row table for one verb. Receives the verb, the surface pronouns, the filled-form per slot, the current target slot, and the slot that just flashed. |
| `ChipRow.tsx` | Renders the 4 chips for the current target cell, handles the wrong-shake state per chip. |
| `EndOfRoundRecap.tsx` | Generic recap. Takes a list of `{ infinitive, tricky, fullTable }` rows + texts + callbacks. Reusable by modules 2 and 3. |
| `pools.ts` | Pool definitions and a `pickRoundVerbs(pool)` helper. |
| `distractors.ts` | `pickChips(verb, pronoun)` returns the 4 shuffled chip forms for a slot. |
| `forms.ts` | `bareForm(verb, pronoun)` and `terminaisonOf(form, verb)` helpers used by table + chips. |
| `Activity.module.css` | Table layout, chip layout, green-flash / red-shake / terminaison highlight animations. |

## Key State

In `Activity.tsx`:

- `screen: 'pool' | 'playing' | 'recap'` — top-level screen.
- `pool: PoolId | null` — selected pool (kept across recap so Recommencer is meaningful even though we go to pool screen).
- `verbs: Verb[]` — the 5 verbs of the current round, fixed at round start.
- `verbIndex: number` — 0..4.
- `surfacePronouns: Pronoun[6]` — for the current verb, the 6 pronouns to display in the rows. Slots 0/1/3/4 are fixed (`je`/`tu`/`nous`/`vous`); slots 2 and 5 are randomised (`il`/`elle`/`on` and `ils`/`elles`) per verb.
- `filledSlots: boolean[6]` — which cells are now filled (slots 0 and 3 start true).
- `currentSlot: 1 | 2 | 4 | 5 | null` — the next empty slot to fill, top-to-bottom; `null` while the end-of-verb pause runs.
- `chips: string[]` — the 4 chip forms for `currentSlot`.
- `shakingChip: number | null` — index of a chip currently animating wrong (clears after 400 ms).
- `flashSlot: number | null` — slot whose terminaison is currently in green-flash mode (clears after 1 s, then the bold style remains via `filledSlots`).
- `trickyVerbs: Set<string>` — infinitives where the learner made ≥ 1 wrong pick. Used by the recap.
- `currentVerbHadMistake: boolean` — per-verb flag, folded into `trickyVerbs` at end of verb.
