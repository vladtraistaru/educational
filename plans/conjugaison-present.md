# Plan — `conjugaison-present`

Pre-SPEC design notes for the *présent de l'indicatif* module. Slug, subject, and registration follow the rules in `AGENTS.md` and the roadmap entry in `specs/planned-modules.md` (Priority 4 — Français).

Cross-module decisions (start screen, end-of-round recap, persistence, pronoun handling, feedback timings, no-audio policy) live in `conjugaison-shared.md`. This file covers only what is unique to présent.

---

## Learner

A child of about **9 years old**, in **5P or 6P** (PER cycle 2, début). Already knows présent fragments orally from cycle 1 (the PER attente at end of cycle 1 is to *conjugue oralement au présent les verbes du type «chanter» + être, avoir, aller*). Cycle 2 is about **systematizing** what they already half-know and moving it from oral into clean written form.

PER alignment: **`L1 26` — Fonctionnement de la langue**, axe *Conjugaison*, niveau **apprentissage** (not *sensibilisation*, not yet *mobilisation*).

---

## Learning goal

By the end of a session, the learner can:

1. Recognise the six terminaisons of the présent for **1er groupe** verbs: `-e, -es, -e, -ons, -ez, -ent`.
2. Recognise the six terminaisons for **2e groupe** verbs: `-is, -is, -it, -issons, -issez, -issent`.
3. Recall the full présent of **5 irréguliers fondamentaux**: *être, avoir, aller, faire, dire*.

The system focus is on **terminaisons** — that's the PER's stated pedagogical goal: "*observation des régularités des terminaisons*". The module exists to make the *pattern* salient, not just to drill forms.

---

## Interaction — "Fill the table"

The screen shows a **conjugation table** for one verb at présent. Some cells are pre-filled (the easier ones the learner already knows or has just done). One cell is **empty and highlighted** — the learner taps a chip from a row of options below to fill it.

```
              chanter — présent
  ┌────────────────────┐
  │ je       chante    │  ← pre-filled
  │ tu       chantes   │  ← pre-filled
  │ il/elle  ?         │  ← target
  │ nous     chantons  │
  │ vous     chantez   │
  │ ils      chantent  │
  └────────────────────┘

  Options:  [ chante ]  [ chantent ]  [ chantons ]  [ chantez ]
```

The learner taps a chip → instant feedback. If correct, the chip slides into the cell with a green flash, and the **terminaison `-e` is highlighted** for one second. If wrong, the chip shakes red, the cell stays empty, the learner picks again.

After all 6 cells are filled, a "**Suivant**" button advances to the next verb. A small progress bar shows verbs done / total in the round (e.g. 3 / 8).

### Why this format for a 9-year-old

- **No keyboard typing** — eliminates the "wrong because of accent typo" frustration. Accents matter linguistically (*être* vs *etre*), but the learner is here to learn conjugation, not type accents.
- **Visual table** — matches the MER textbook artifact they see in class; transfer is immediate.
- **Highlighting the terminaison on success** — turns each correct answer into a **micro-lesson** about the pattern, not just a tick.
- **Multiple chips force discrimination** — the wrong chips are deliberately neighbour-forms (`chante` vs `chantes` vs `chantent`), so the learner must attend to the ending, which is the whole point.
- **Per-verb completion before advancing** — gives a sense of finishing, important for sustained attention at this age.

---

## Module-specific design decisions

- **Pre-filled cells**: 2 cells are pre-filled at the start of each verb. **Always `je` and `nous`** (not random). Rationale: `je` and `nous` are the most familiar to a 9-year-old (used most in everyday speech); pre-filling them gives a confident starting point and lets the learner see two reference forms before tackling the others.
- **Cell order to fill**: the remaining 4 cells are revealed **one at a time, top-to-bottom** (`tu`, then `il/elle/on`, then `vous`, then `ils/elles`). The learner is never overwhelmed by a wall of empty cells; one missing cell at a time is the focus.
- **Distractor chips per cell**: always **4 chips, all from the same verb at the same tense** — the correct form plus 3 other forms of that verb. Rationale: same-verb distractors force the learner to attend to the *terminaison* (the lesson), not to the verb stem (already given by the table context).
- **Terminaison highlighting on success**: the correct ending in the just-filled cell flashes in `feedbackCorrect` color for 1 s, then settles to a persistent **bold** style for the rest of the verb's display.
- **End-of-verb full-table state**: once all 6 cells are filled, the table stays on screen for 1.5 s with **all terminaisons in bold** — the system pattern is visible at a glance — before advancing to the next verb.

## Scope

**In scope (specific to this module):**

- Tense: **présent only**.
- Verbs: `chanter, manger, parler, aimer` (1er groupe) ; `finir, choisir` (2e groupe) ; `être, avoir, aller, faire, dire` (5 irréguliers PER cycle 2).
- Round structure and pronoun handling: see `conjugaison-shared.md`.

Out-of-scope items follow the uniform list in `conjugaison-shared.md`.

---

## Library dependency

Uses `lib/linguistics/french/conjugation.ts`:

- `VERBS` — the 11 verbs already in the DB cover the in-scope verbs exactly.
- `conjugate(verb, 'present', pronoun)` — for the table cell values and for generating distractor chips.
- `Pronoun` type — for the table rows.

**One small library addition this module needs:** a helper to generate **plausible wrong chips** (other forms of the same verb at the same tense). Not in the library yet. **Decision: build inline in the module first**; lift to the library only if `conjugaison-imparfait` or `conjugaison-passe-compose` end up needing the same helper.
