# Plan — `conjugaison-present`

Pre-SPEC design notes for the *présent de l'indicatif* module. Slug, subject, and registration follow the rules in `AGENTS.md` and the roadmap entry in `specs/planned-modules.md` (Priority 4 — Français).

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

## Scope

**In scope:**

- Tense: **présent only**.
- Verbs: `chanter, manger, parler, aimer` (1er groupe) ; `finir, choisir` (2e groupe) ; `être, avoir, aller, faire, dire` (5 irréguliers PER cycle 2).
- Pronouns: all 9 PER pronouns, but displayed grouped (`il / elle / on` share a row, `ils / elles` share a row → 6 cells in the table, matching the 6 morphological forms).
- Round = 5 verbs picked at random from a chosen pool.
- Three pools selectable at start: **1er groupe seul** / **2e groupe seul** / **Irréguliers** / **Mélange**.

**Out of scope (deferred to other modules or later iterations):**

- Other tenses (covered by `conjugaison-imparfait`, `conjugaison-passe-compose`).
- Free-text typing mode (could be added later as "harder mode" once the learner shows mastery).
- Score / leaderboard / time pressure — this is a *learning* module, not a fluency drill.
- Audio pronunciation — no audio infrastructure in the platform yet.
- More irréguliers (*prendre, voir, vouloir, pouvoir, devoir, venir*) — add when the verb DB grows; not needed for first version.

---

## Library dependency

Uses `lib/linguistics/french/conjugation.ts`:

- `VERBS` — the 11 verbs already in the DB cover the in-scope verbs exactly.
- `conjugate(verb, 'present', pronoun)` — for the table cell values and for generating distractor chips.
- `Pronoun` type — for the table rows.

**One small library addition this module needs:** a helper to generate **plausible wrong chips** (other forms of the same verb at the same tense). Not in the library yet. To be added inline in the module first, lifted to the library only if `conjugaison-imparfait` or `conjugaison-passe-compose` need the same helper.

---

## Open questions to resolve before writing `SPEC.md`

1. **Pool selection UI** — drop-down vs four big buttons on a start screen? Big buttons feel right at 9 years old.
2. **End-of-round screen** — show the table-completion percentage? show which verbs gave trouble? Or just "Bravo ! → Recommencer" without analytics?
3. **Pre-filled cell strategy** — pre-fill 2 cells (always *je* and *nous*), or randomise which 2 cells are pre-filled? Randomising is more pedagogical (forces the learner to look at the table fresh each time) but harder to implement deterministic distractor generation around.
4. **Distractor strategy** — always show 4 chips with 1 correct + 3 forms of the same verb? Or sometimes mix in a form from a *different* verb of the same group (more confusing, more pedagogical)? Recommend: same-verb chips for first version.
5. **Should the highlighted terminaison stay highlighted across the whole table** once all cells are filled, so the pattern is visible at the end? Strong yes from a PER-pedagogy standpoint.
