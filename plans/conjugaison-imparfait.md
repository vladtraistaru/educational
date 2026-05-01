# Plan — `conjugaison-imparfait`

Pre-SPEC design notes for the *imparfait de l'indicatif* module. Slug, subject, and registration follow the rules in `AGENTS.md` and the roadmap entry in `specs/planned-modules.md` (Priority 4 — Français).

Cross-module decisions (start screen, end-of-round recap, persistence, pronoun handling, feedback timings, no-audio policy) live in `conjugaison-shared.md`. This file covers only what is unique to imparfait.

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

## Module-specific design decisions

- **Stem reveal animation**: the *nous* présent form is shown for 1 s in full (e.g. `nous chantons`), then the `-ons` is **struck through** and the remaining stem (`chant-`) is **underlined**. This makes the rule visceral. Stays underlined through the question.
- **`être` handling**: *être* is **excluded from the `1er groupe` and `2e groupe` pools** and only appears in **`Irréguliers` and `Mélange`**. When it does appear, the top row shows `nous somm[es]` greyed out + a one-line note: *« être est spécial : on utilise le radical** ét- »*. The same chip-picking interaction follows. This explicit acknowledgement of the exception aligns with PER's "*observation des régularités*" — irregularities are taught as identifiable, not as random noise.
- **Pronoun rotation per verb**: each verb gets **6 micro-questions, one per morphological person**, in the order `je, tu, il/elle/on, nous, vous, ils/elles`. The pronoun is bound to one of the 9 PER pronouns at random for the surface form (so `il/elle/on` → sometimes `il`, sometimes `elle`, sometimes `on`). Rationale: deterministic order guarantees the learner meets all 6 endings (including the trickier `nous chantions` and `vous chantiez` with `i` insertion); randomising the surface pronoun keeps it varied.
- **End-of-verb table flash**: once the 6 forms are completed, the **full imparfait table** of the verb is shown for 2 s with **stem in one color, ending in another** (consistent across all verbs). Visualises the very rule the module teaches — same stem repeats six times, the ending is what changes.
- **Round size**: 5 verbs × 6 pronouns = 30 micro-questions per round (not 15 as initially considered). This is the only module of the three with > 5 micro-questions per verb, because here the **pattern is the lesson** and the learner needs to see all 6 endings on each verb.

## Scope

**In scope (specific to this module):**

- Tense: **imparfait only**.
- Verbs: same 11 as `conjugaison-present`.
- Round structure (per above) and pool selector: see `conjugaison-shared.md`.

Out-of-scope items follow the uniform list in `conjugaison-shared.md`. Note in particular that the **semantic distinction *imparfait vs passé composé*** is **not** part of this module; it is the role of a separate planned module (`imparfait-vs-passe-compose`).

---

## Library dependency

Uses `lib/linguistics/french/conjugation.ts`:

- `VERBS` — same 11 as présent module.
- `conjugate(verb, 'present', 'nous')` — for the **shown présent *nous*-form** that's the rule's input.
- `conjugate(verb, 'imparfait', pronoun)` — for the expected answer and to generate distractor chips.

**The library already supports this module fully** — no additions required. The fact that imparfait derives from `nous`-présent is encoded inside `conjugate()`; the module just calls it twice (once for présent display, once for imparfait answer) and the relationship is exposed to the learner through the UI, not the library.
