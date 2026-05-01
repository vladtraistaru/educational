# Plan — shared decisions for the three conjugation modules

Cross-module rules that apply identically to `conjugaison-present`, `conjugaison-imparfait`, and `conjugaison-passe-compose`. Each per-tense plan covers only what is unique to that tense; everything else is here.

---

## Audience and platform conventions

- **Learner**: ~9 years old, PER cycle 2 (5P–6P).
- **Subject** (`config.ts`): `'literacy'`.
- **Difficulty**: présent = 3, imparfait = 4, passé composé = 5 — keeps the homepage sort meaningful within the literacy strand.
- **Translations**: French and English, per `AGENTS.md` `Language` constraints. The activity itself runs in French (the subject *is* French); UI chrome (button labels, recap headings) is bilingual.
- **Styling**: Pico CSS + the shared classes in `modules/activity.module.css` (`activityArea`, `btnPrimary`, `btnSecondary`, `feedbackCorrect`, `feedbackIncorrect`). Per-module CSS modules only for the table / chip / sentence-frame layouts that are unique to each module.

---

## Start screen — pool selector

Every module opens with the **same start screen pattern**:

- Module title (from `translations.ts`).
- One-sentence intro (from `translations.ts`).
- **Four big buttons**, stacked on mobile, in a 2×2 grid on desktop:

  | Button | Pool |
  |--------|------|
  | **1er groupe** | `chanter, manger, parler, aimer` |
  | **2e groupe** | `finir, choisir` |
  | **Irréguliers** | `être, avoir, aller, faire, dire` |
  | **Mélange** | All 11 verbs |

- Buttons use `btnPrimary` / `btnSecondary` / equivalents from the shared CSS — visually distinct so the four pools are easy to scan.
- Tapping a button starts a round immediately (no confirm step).

Same UI in all three modules. **Code may be copy-pasted across modules at first.** Lift to a shared `<PoolSelector>` component only if/when a fourth conjugation module appears.

---

## Round structure

- **One round = 5 verbs**, drawn at random from the chosen pool.
- Verbs are not repeated within a round; if the pool has fewer than 5 verbs (`2e groupe` has only 2), the round repeats the available verbs to reach 5 questions, but never two in a row.
- Within a verb, micro-questions are tense-specific (see per-tense plans).
- A small **progress indicator** at the top of the activity area: e.g. `Verbe 3 / 5` — text only, no decorative bar. Same wording in all three modules.

---

## Pronoun handling — the 9 → 6 collapse

PER recognises 9 pronouns: `je, tu, il, elle, on, nous, vous, ils, elles`. Morphologically there are only **6 distinct forms** (`il/elle/on` share, `ils/elles` share). All three modules use this collapse:

- The conjugation **table**, when shown, has **6 rows** (`je`, `tu`, `il/elle/on`, `nous`, `vous`, `ils/elles`).
- When a question asks for a single pronoun, the module picks **one of the 9** at random (so the learner sometimes sees `elle` or `on`, not always `il`), but the *expected answer* is computed against that exact pronoun via the library — which already returns the right form.
- This decision is purely UI; the library `conjugate(verb, tense, pronoun)` continues to accept all 9 pronouns and returns the correct form.

---

## Feedback and animations

A single feedback vocabulary across the three modules:

| Event | Visual | Duration |
|-------|--------|----------|
| Correct pick | Chip slides into target slot, **green flash** (uses `feedbackCorrect` color), **terminaison or relevant morpheme highlighted** for 1 s | 1 s |
| Wrong pick | Chip shakes red briefly (uses `feedbackIncorrect` color); cell/slot stays empty; chip remains tappable | ~400 ms |
| Verb completed | Brief **full-form reveal** (the whole conjugated form / table) with stem and ending in two colours | 1.5 s |
| Round completed | Recap screen (see below) | until learner taps **Recommencer** or **Retour** |

No sound. No haptic. No score. No timer. **These are learning modules, not drills.** A future fluency module (e.g. `conjugaison-defi`) can add timer + score; these three deliberately do not.

---

## End-of-round recap

Same recap layout in all three modules:

- Title: **« Bravo ! »** (FR) / **"Well done!"** (EN).
- A **table of the 5 verbs** the learner just saw, one row per verb:
  - Verb infinitive (e.g. *chanter*).
  - **Status icon** — green check if the learner got every micro-question right on the first try; orange dot if they needed > 1 try on at least one micro-question.
  - On tap of an "orange dot" row: expand to show **the full conjugation** of that verb at the module's tense, so the learner can see what they missed.
- Two buttons at the bottom:
  - **Recommencer** → returns to the start screen (same module, learner picks a pool again — possibly the same one).
  - **Retour** → navigates to the homepage.
- No accuracy percentage, no time stat, no score. The recap is **a study aid**, not a report card.

The "needed > 1 try" tracking is the **only state the module needs to keep across the round** beyond current verb / current pronoun. A simple `Set<verbInfinitive>` of "tricky" verbs is enough.

---

## Persistence

**No persistence across sessions.** State lives in `Activity.tsx` only and resets on page reload, navigation, or pool change. This matches every other module on the platform.

If progress tracking is added later, it goes in via Supabase (planned per `AGENTS.md`) and applies to all modules at once — not module-by-module.

---

## Cross-cutting library notes

All three modules consume `lib/linguistics/french/conjugation.ts`. The library already covers the linguistic content; module logic stays UI/state only. Two anticipated library-level additions are tracked in the per-tense plans (a distractor helper for présent; two convenience reads for passé composé) — both are tiny and add only when the relevant SPEC confirms the need.

---

## Out of scope for all three modules (uniform deferral)

- Free-text typing (chips only).
- Audio / pronunciation.
- Score / leaderboard / time pressure.
- Cross-session persistence.
- Verbs beyond the 11 in the library.
- Tenses beyond the three in scope (futur simple, conditionnel, subjonctif…).
- Gender / number agreement of participe passé with `être` (passé composé module returns masculine-singular by default).
