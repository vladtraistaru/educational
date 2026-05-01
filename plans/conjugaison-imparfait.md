# Plan — `conjugaison-imparfait`

Pre-SPEC design notes for the *imparfait de l'indicatif* module. Slug, subject, and registration follow the rules in `AGENTS.md` and the roadmap entry in `specs/planned-modules.md` (Priority 4 — Français).

---

## Learner

A child of about **9 years old**, in **5P or 6P**. Has worked with `conjugaison-present` first (recommended order — see plans for `conjugaison-present.md`). Per PER, imparfait is *deliberately introduced after présent* because it is **the most regular tense in French** — perfect for cementing how the conjugation system works in general.

PER alignment: **`L1 26` — Fonctionnement de la langue**, axe *Conjugaison*. Introduced typically in 5P–6P; the PER notes "*Privilégier les observations à partir du temps verbal le plus régulier: l'imparfait*".

---

## Learning goal

By the end of a session, the learner can:

1. Recognise that **imparfait is built from the *nous*-form of présent** (drop `-ons`, add the imparfait endings).
2. Recall the six imparfait endings: `-ais, -ais, -ait, -ions, -iez, -aient`.
3. Apply the rule to all in-scope verbs, including irregulars — because for imparfait, irregulars and regulars use **the same endings** (only `être` has a special stem `ét-`).

The system focus is on **the derivation rule**: présent *nous*-form is the bridge to imparfait. If the learner internalises this, they have unlocked imparfait for any verb they know at présent.

---

## Interaction — "Transform from présent"

Two-row layout. The top row shows the **présent *nous*-form** of a verb, with `-ons` visually emphasized. The bottom row asks for the **imparfait** at a randomly chosen pronoun.

```
            Construis l'imparfait :

  Présent :   nous chant[ons]    ← -ons highlighted, with hint icon

  Imparfait :  je chant_____ ?

  Options:  [ -ais ]  [ -ait ]  [ -ions ]  [ -aient ]
```

The learner taps an ending chip → the chip slides into the blank, full form is displayed (e.g. *je chantais*), green flash on success, red shake + reset on failure.

Three rounds per verb, each with a different pronoun. After the third correct answer, a brief animation shows **all 6 forms of the verb at imparfait** with the **stem highlighted in one color and the endings in another**, reinforcing the system. Then "**Suivant**" → next verb.

### Why this format for a 9-year-old

- **The présent *nous*-form is always shown** — this **teaches the rule** instead of just testing memory. The rule is the actual content; the answer is a downstream consequence.
- **Endings as chips, not full forms** — forces attention on the exact morpheme that varies. The stem is given (because it's derived); only the ending choice is the test.
- **`être` exception is handled gently** — when the verb is *être*, the top row shows `nous somm[es]` greyed out + a small note "*être est spécial : on utilise* **ét-**". Then the same chip-picking interaction. Explicit acknowledgement that exceptions exist, not hiding them.
- **End-of-verb full-table flash** — visual closure, shows the whole pattern at once. Pedagogically strong: builds the *gestalt* of the conjugation table.

---

## Scope

**In scope:**

- Tense: **imparfait only**.
- Verbs: same 11 as `conjugaison-present` (`chanter, manger, parler, aimer, finir, choisir, être, avoir, aller, faire, dire`).
- Pronouns: all 9 PER pronouns, randomised per round.
- Round structure: 5 verbs × 3 pronouns each = 15 micro-questions per round.
- One pool selector at start (same UI as `conjugaison-present`): **1er groupe** / **2e groupe** / **Irréguliers** / **Mélange**.

**Out of scope:**

- Other tenses (separate modules).
- The semantic distinction *imparfait vs passé composé* — that's a whole separate module (`imparfait-vs-passe-compose`, mentioned in expansion of Priority 4). This module is purely about producing imparfait forms correctly.
- Free-text typing.
- Verbs beyond the 11.

---

## Library dependency

Uses `lib/linguistics/french/conjugation.ts`:

- `VERBS` — same 11 as présent module.
- `conjugate(verb, 'present', 'nous')` — for the **shown présent *nous*-form** that's the rule's input.
- `conjugate(verb, 'imparfait', pronoun)` — for the expected answer and to generate distractor chips.

**The library already supports this module fully** — no additions required. The fact that imparfait derives from `nous`-présent is encoded inside `conjugate()`; the module just calls it twice (once for présent display, once for imparfait answer) and the relationship is exposed to the learner through the UI, not the library.

---

## Open questions to resolve before writing `SPEC.md`

1. **Pronoun choice within a verb** — random across all 9 each time, or guarantee at least one of `nous` and `vous` (the forms with `i` insertion: *nous chantions*, *vous chantiez*) so the learner sees the trickier endings? Recommend: deterministic — round through the 6 morphological persons in order (je, tu, il, nous, vous, ils), randomly bind `il` to one of `il/elle/on` and `ils` to one of `ils/elles`.
2. **Stem reveal animation** — show the *nous*-form *with* `-ons` for 1 second, then *strike through* the `-ons` and *underline* the remaining stem? This makes the rule visceral. Worth the small motion design effort.
3. **`être` handling** — is the gentle "*être est spécial*" note enough, or should *être* be excluded from the first encounter and only introduced after the learner has done one round of regulars? Recommend: exclude from "1er groupe" pool; include only in "Irréguliers" and "Mélange".
4. **Should the end-of-verb table flash include a **stem / ending color split** (e.g. blue stem, orange ending)?** Strong yes — visualises the very rule the module teaches.
5. **Reuse with `conjugaison-present`** — should the pool-selection start screen be a **shared component**? Decide after at least two modules exist; for now, copy-paste is fine.
