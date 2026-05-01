# Plan — `conjugaison-passe-compose`

Pre-SPEC design notes for the *passé composé* module. Slug, subject, and registration follow the rules in `AGENTS.md` and the roadmap entry in `specs/planned-modules.md` (Priority 4 — Français).

Cross-module decisions (start screen, end-of-round recap, persistence, pronoun handling, feedback timings, no-audio policy) live in `conjugaison-shared.md`. This file covers only what is unique to passé composé.

---

## Learner

A child of about **9 years old**, in **6P** (introduction year per PER cycle 2 / MER 6H — the BDPER catalogue lists *Conjuguer au passé composé* as a 6H fiche d'exercices). Has worked with `conjugaison-present` and `conjugaison-imparfait` first (recommended order — passé composé requires confident présent of *avoir* and *être*, since they're the auxiliaries).

PER alignment: **`L1 26` — Fonctionnement de la langue**, axe *Conjugaison*. The hardest of the three tenses targeted in this batch — it has **two genuinely new concepts** the learner hasn't met yet:

1. The tense is built from **two pieces** (an auxiliary + a participe passé), not a single inflected word.
2. The auxiliary is **not always the same** — most verbs use *avoir*, but a small group uses *être* (and pronominal verbs always use *être*, but those are out of scope here).

---

## Learning goal

By the end of a session, the learner can:

1. Recognise that passé composé = **auxiliaire (présent) + participe passé**.
2. For an in-scope verb, **choose the right auxiliary** (*avoir* for most; *être* for *aller* in this scope).
3. **Identify the correct participe passé** of the verb (regular: -er → -é, -ir → -i; irregular: *été, eu, allé, fait, dit*).
4. Combine the two parts at the right pronoun (e.g. "*nous avons mangé*", "*je suis allé*").

The module's **central insight**: passé composé is built — not memorised. The interaction explicitly separates the two construction choices so the learner builds the form, doesn't just recall it.

---

## Interaction — "Build with two chips"

A single sentence frame, with two empty slots:

```
                     Construis le passé composé :

           Hier,  nous  [____]  [____]  une pomme.
                         ↑       ↑
                     auxiliaire  participe

           Verbe : manger          Pronom : nous

           Choisis l'auxiliaire :
           [ avons ]  [ sommes ]  [ ai ]  [ as ]

           (puis) Choisis le participe :
           [ mangé ]  [ manger ]  [ mangeons ]  [ mange ]
```

Two-stage chip-picking: **first** the auxiliary chip, **then** the participe chip. Both chips slide into their slots; the full form lights up green when both correct, the sentence reads naturally end-to-end ("*Hier, nous avons mangé une pomme.*").

If the auxiliary is wrong, immediate red shake and a tiny hint badge: *"avoir ou être ?"* — invites the learner to reconsider before picking again. If the participe is wrong, hint: *"-é, -i, ou irrégulier ?"*. Hints are **structural**, not answers.

Each round = 5 verbs, randomly drawn. The end-of-round screen highlights any verb where the learner needed > 1 try, so they can re-attempt.

### Why this format for a 9-year-old

- **Two-chip construction makes the structure literal.** A 9-year-old learning passé composé often writes "*j'ai allé*" or "*je suis mangé*" — the whole pedagogical point is that **two independent decisions** are made. Forcing two separate picks makes the structure tangible in a way a single text input never does.
- **Sentence frame, not isolated form.** Passé composé is a **past** tense — the sentence frame ("Hier, ...", "La semaine dernière, ...", "Quand j'ai fini, ...") embeds the meaning. The learner sees that this tense *means something* in time, not just *looks a certain way* on the page.
- **Structural hints, not answers.** "*avoir ou être ?*" pushes the learner back to the rule, not to the answer. This is how teachers actually correct passé composé errors orally.
- **Auxiliary chips include both auxiliaries**, so the learner is *always* making the *avoir* / *être* choice, even for the (majority) *avoir* verbs. The choice itself is the lesson.

---

## Module-specific design decisions

- **Sentence frame rotation**: 5 frames, one per verb in the round, rotated:
  1. `Hier, [pronom] [aux] [pp] {object}.`
  2. `La semaine dernière, [pronom] [aux] [pp] {object}.`
  3. `Quand j'ai fini, [pronom] [aux] [pp] {object}.`
  4. `Ce matin, [pronom] [aux] [pp] {object}.`
  5. `Pendant les vacances, [pronom] [aux] [pp] {object}.`
  
  Rationale: rotating frames builds the **temporal meaning** of passé composé (a *past punctual* event), without overwhelming the learner. All frames are clearly past-tense markers a 9-year-old recognises.

- **Per-verb sample object**: stored in the module's `translations.ts` as `{ verbInfinitive → object }` so the sentence reads naturally. Examples:
  - `chanter` → *une chanson*
  - `manger` → *une pomme*
  - `parler` → *avec mon ami*
  - `aimer` → *ce livre*
  - `finir` → *mes devoirs*
  - `choisir` → *un cadeau*
  - `aller` → *à l'école*
  - `faire` → *un dessin*
  - `dire` → *bonjour*
  - `être` → *content* (frame becomes "*Hier, nous avons été contents.*" — works grammatically, slightly stilted but pedagogically clear)
  - `avoir` → *un cadeau* (frame becomes "*Hier, j'ai eu un cadeau.*")

- **Auxiliary chip pool**: always **4 chips**, **2 *avoir* forms + 2 *être* forms** — including the correct one. The other 3 chips are forms at the same person but from the wrong auxiliary, OR forms at a different person from the correct auxiliary. This forces a double check: *avoir or être? AND which person?*

- **Participe chip pool**: always **4 chips** — the correct participe + 3 high-likelihood wrong-form distractors:
  - the **infinitive** (e.g. *manger* alongside *mangé*)
  - the **présent *nous*-form** (e.g. *mangeons*)
  - the **présent *je*-form** (e.g. *mange*)
  
  These are exactly the wrong forms a 9-year-old produces at this stage — ear-confusable for 1er groupe, but visibly different on the page.

- **Two-stage pick is enforced**: the participe chips are **disabled** until a correct auxiliary chip is picked. Reason: the cognitive flow is *first decide which auxiliary, then build the participe* — locking the order respects this.

- **`aller` first appearance**: round 1 is **avoir verbs only**. *aller* (the only *être* verb in scope) is **introduced in round 2** with a small *« Nouveau ! »* badge and a **one-paragraph intro panel** before the first *aller* question:
  > *« Attention ! Quelques verbes utilisent **être** au lieu de **avoir** au passé composé. Le verbe* aller *en fait partie. »*
  
  This avoids overwhelming the learner with two new concepts (the structure + the auxiliary choice) at once.

- **Hints on wrong picks**: structural, never giving the answer:
  - Wrong auxiliary → *« avoir ou être ? »*
  - Wrong participe → *« -é, -i, ou irrégulier ? »*
  
  Hints appear next to the chip row for ~2 s after a wrong pick, then fade.

- **No agreement penalty**: the module accepts the masculine-singular participe by default. A learner answering with `nous sommes allés` (correct with agreement) is still marked **correct** (so future iterations adding agreement don't break backward compatibility); but the module never *requests* the agreed form in this version.

## Scope

**In scope (specific to this module):**

- Tense: **passé composé only**.
- Verbs: same 11 as the other two modules.
- Auxiliaries: **avoir** for 10 verbs; **être** for `aller` (the only `être`-auxiliary verb in current scope).
- Round structure: 5 verbs, with *aller* deferred to round 2.

**Out of scope — extra to the uniform list in `conjugaison-shared.md`:**

- **Gender / number agreement of the participe with *être*** (already covered above — module accepts but does not require).
- More verbs taking *être* (*venir, partir, arriver, sortir, ...*) — add when the verb DB grows.
- Pronominal verbs (*se laver, s'habiller*) — they always use *être* and trigger the agreement question.
- Tense distinction *imparfait vs passé composé* — separate planned module.

---

## Library dependency

Uses `lib/linguistics/french/conjugation.ts`:

- `VERBS` — same 11; `aller` already has `auxiliary: 'etre'` and `participePasse: 'allé'` set correctly.
- `conjugate(verb, 'passe-compose', pronoun)` — to verify the final two-chip combination.
- `Auxiliary` type — for the auxiliary chip pool.
- The `Verb.participePasse` and `Verb.auxiliary` fields — read directly to build the participe chip pool and the correct auxiliary chip.

**Two small library helpers this module needs**, to be added at SPEC time (each ~3 lines):

1. `getAuxiliary(verb): Auxiliary` — exposes `verb.auxiliary ?? 'avoir'` cleanly so the module doesn't replicate the default-handling rule.
2. `getParticipe(verb): string` — exposes the participe passé (regular derivation for groups 1/2, stored value for group 3) so the module doesn't replicate the derivation logic that `conjugate()` already does internally.

Both go straight into `lib/linguistics/french/conjugation.ts` as exports, with a unit test each.
