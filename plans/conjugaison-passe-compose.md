# Plan — `conjugaison-passe-compose`

Pre-SPEC design notes for the *passé composé* module. Slug, subject, and registration follow the rules in `AGENTS.md` and the roadmap entry in `specs/planned-modules.md` (Priority 4 — Français).

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

## Scope

**In scope:**

- Tense: **passé composé only**.
- Verbs: same 11 as the other two modules (`chanter, manger, parler, aimer, finir, choisir, être, avoir, aller, faire, dire`).
- Auxiliaries: **avoir** for 10 verbs; **être** for `aller` (the only `être`-auxiliary verb in current scope).
- Pronouns: all 9 PER pronouns.
- Round = 5 verbs.

**Out of scope (deliberate, with reasons):**

- **Gender / number agreement of the participe with *être*** (*je suis allé* vs *je suis allée*, *nous sommes allés*). The library returns masculine-singular by default. PER cycle 2 introduces this gradually 7P–8P; for a 9-year-old's *first encounter* with passé composé, surfacing agreement adds noise. **The module displays the masculine-singular default and does not penalise; a future iteration can add a "with agreement" mode.**
- More verbs taking *être* (*venir, partir, arriver, sortir, ...*). Add when the verb DB grows.
- Pronominal verbs (*se laver, s'habiller*) — out of scope for the same reason: they always use *être* and trigger the agreement question.
- Tense distinction *imparfait vs passé composé* — separate planned module.
- Free-text typing.

---

## Library dependency

Uses `lib/linguistics/french/conjugation.ts`:

- `VERBS` — same 11; `aller` already has `auxiliary: 'etre'` and `participePasse: 'allé'` set correctly.
- `conjugate(verb, 'passe-compose', pronoun)` — to verify the final two-chip combination.
- `Auxiliary` type — for the auxiliary chip pool.
- The `Verb.participePasse` and `Verb.auxiliary` fields — read directly to build the participe chip pool and the correct auxiliary chip.

**Two small library helpers this module would benefit from** (probably worth lifting to the library now since they're general):

1. `getAuxiliary(verb): 'avoir' | 'etre'` — currently the module would read `verb.auxiliary ?? 'avoir'` inline. A one-line library function makes the default explicit and documents it.
2. `getParticipe(verb): string` — currently the module would replicate the regular-verb derivation logic that `conjugate()` does internally. Exposing it stops the duplication.

Both are ~3 lines each. Defer until writing the SPEC confirms they're needed; they're cheap to add then.

---

## Open questions to resolve before writing `SPEC.md`

1. **Sentence frame variety** — same frame every round ("Hier, ... une pomme") or rotate frames ("Hier, ...", "La semaine dernière, ...", "Quand j'ai fini, ...")? Rotating builds the sense that passé composé describes *past punctual events*, which is its meaning. Recommend: 4–5 frames, rotated.
2. **Sentence object word** — does the object change per verb? *manger une pomme* makes sense; *finir une pomme* doesn't. Either curate a `{ verb → sample object }` map, or use a generic frame like "Hier, … et tout s'est bien passé." that works with any verb. Recommend: per-verb sample object stored in the module's translations, not in the library.
3. **Auxiliary chip pool** — always show 4 chips (2 *avoir* forms + 2 *être* forms), or show all 6 *avoir* forms or all 6 *être* forms? 4 chips with a mix is the right cognitive load; the learner must read the pronoun and pick the *matching person* from the *correct auxiliary*.
4. **Participe chip distractors** — beside the correct participe (*mangé*), use the **infinitive** (*manger*), the **présent *nous*-form** (*mangeons*), and the **présent *je*-form** (*mange*) as distractors. These are exactly the wrong forms a 9-year-old produces. Confirm this strategy in the SPEC.
5. **`aller` first appearance** — should *aller* (the only *être* verb) be excluded from the first round to let *avoir* feel "default" first, then introduced in round 2? Recommend: yes — first round is *avoir* verbs only; second round introduces *aller* with a small "*nouveau !*" badge and a one-sentence intro panel.
