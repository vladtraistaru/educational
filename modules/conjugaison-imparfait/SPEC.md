# conjugaison-imparfait — SPEC

## Purpose

Help a 9-year-old (PER cycle 2) discover that the **imparfait** is built from the *nous*-form of présent: drop `-ons`, add the imparfait endings (`-ais, -ais, -ait, -ions, -iez, -aient`). The rule is the lesson; chip-picking is the test.

## User Experience

1. **Start screen** — title, intro line, four big buttons: *1er groupe*, *2e groupe*, *Irréguliers*, *Mélange*. Tapping one starts a round.
2. **Round** — 5 verbs drawn from the chosen pool (no two in a row when pool < 5). `être` is excluded from *1er groupe* and *2e groupe* pools (it lives only in *Irréguliers* and *Mélange*). Progress text: *Verbe X / 5*.
3. **Per verb** — 6 micro-questions in fixed order: `je → tu → il/elle/on → nous → vous → ils/elles`. The surface pronoun for slots 2 and 5 is randomised per verb (`il`/`elle`/`on` and `ils`/`elles`).
4. **Per micro-question** — top row shows the **présent *nous*-form** of the verb (e.g. *nous chant**ons***) with `-ons` struck through and the stem (*chant*) underlined. Below, the question reads *Construis l'imparfait :* `[pronoun] chant______ ?` followed by **4 ending chips** (1 correct + 3 distractors from the other distinct imparfait endings).
   - Correct chip → chip slides into the blank, full form appears (e.g. *je chantais*), 1 s green flash, then advance to next pronoun.
   - Wrong chip → chip shakes red ~400 ms, blank stays empty, all chips remain tappable.
5. **`être` exception** — when the verb is `être`, the top row shows *nous **somm[es]*** greyed out + a one-line note: *« être est spécial : on utilise le radical **ét-** »*. The blank uses the special stem (*ét______*). Endings and chip mechanic are identical.
6. **End of verb** — once all 6 forms are correctly answered, the **full imparfait table** of the verb is shown for ~1.8 s with the **stem in one color** and the **endings in another**. Then advance to the next verb.
7. **End of round** — recap titled *Bravo !* / *Well done!*. Same pattern as *conjugaison-present*: green check (no mistakes) or orange dot (≥ 1 wrong pick); tap an orange row to expand the full imparfait conjugation. Buttons: **Recommencer** (back to start screen) and **Retour** (homepage).

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Top-level state machine: `pool` → `playing` → `recap`. Owns round and per-verb state, the trickyVerbs set, timers for green-flash and end-of-verb reveal. |
| `PresentRule.tsx` | Top row: shows `nous <stem>[ons]` with `-ons` struck through and stem underlined. For `être`, shows `nous somm[es]` greyed + the *ét-* note. |
| `EndingChips.tsx` | Row of 4 ending chips (e.g. `-ais`, `-ait`, `-ions`, `-aient`). Handles the wrong-shake state per chip. |
| `EndOfVerbReveal.tsx` | Brief 1.8 s flash of the full imparfait table with stem in one color and ending in another. |
| `forms-imp.ts` | Pure helpers: `imparfaitStem(verb)`, `nousPresent(verb)` (split into stem + `-ons`), `imparfaitEnding(slot)`, `pickEndingChips(slot)`, `bareImparfait(verb, pronoun)`. |
| `recap-imp.ts` | `buildRecapRows(verbs, tricky)` for the imparfait tense. |
| `Activity.module.css` | Local styles: présent rule typography (strikethrough/underline), question line, end-of-verb reveal palette. |
| Reused from `conjugaison-present/`: `PoolSelector`, `EndOfRoundRecap` (+ `RecapRow`), `ChipRow`, `pools.ts`, `Activity.module.css` (for pool & recap layout via local CSS). |

## Key State

In `Activity.tsx`:

- `screen: 'pool' | 'playing' | 'recap'` — top-level screen.
- `verbs: Verb[]` — 5 verbs of the current round.
- `verbIndex: number` — 0..4.
- `surfacePronouns: Pronoun[6]` — for the current verb, the 6 pronouns to display. Slots 2 and 5 are randomised per verb.
- `pronounIndex: number` — 0..5, the current micro-question within the verb.
- `chips: string[]` — 4 ending chips for the current pronoun.
- `shakingChip: number | null` — chip currently animating wrong (clears after 400 ms).
- `flashEnding: string | null` — ending whose answer is currently in the 1 s green-flash before advancing.
- `revealing: boolean` — true during the end-of-verb full-table reveal.
- `trickyVerbs: Set<string>` — infinitives where the learner made ≥ 1 wrong pick.
- `currentVerbHadMistake: ref<boolean>` — per-verb flag, folded into `trickyVerbs` at end of verb.
