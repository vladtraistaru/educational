# `conjugaison-passe-compose` — Spec

## Purpose

Teach a 9-year-old (PER 6P) that the passé composé is **built**, not memorised:
**auxiliaire (présent de avoir/être) + participe passé**. The learner makes
two independent decisions per verb — pick the right auxiliary, then pick the
right participe — and sees the form take shape inside a past-tense sentence
frame.

## User Experience

### Start screen — pool selector

Same shared 4-button layout as the other conjugaison modules: **1er groupe**,
**2e groupe**, **Irréguliers**, **Mélange**. Tap = round starts.

### Round 1

5 verbs drawn at random from the pool, **excluding `aller`**. For each verb:

1. A short past-time sentence frame appears with two empty slots:
   *« Hier, [pronom] [____aux____] [____pp____] {object}. »*
   Five frames rotate: *Hier… / La semaine dernière… / Quand j'ai fini… /
   Ce matin… / Pendant les vacances…*. The verb's sample object comes from
   the per-verb map in `translations.ts`.
2. **Stage 1 — auxiliary**: 4 chips, mixed *avoir* + *être* forms (the
   correct one + 3 distractors at the same person from the wrong auxiliary
   or at neighbour persons from the correct auxiliary).
3. Wrong pick → red shake, hint badge *« avoir ou être ? »* for ~2 s.
   Correct pick → green flash, chip slides into the aux slot, **participe
   chips unlock**.
4. **Stage 2 — participe**: 4 chips, the correct participe + 3 high-likelihood
   wrong forms (infinitive, présent *nous*-form, présent *je*-form).
5. Wrong pick → shake + hint *« -é, -i, ou irrégulier ? »*. Correct → green
   flash, sentence reads naturally for ~1.5 s, advance.

### Round 2 (and beyond)

If the chosen pool may include `aller` (Irréguliers / Mélange), the first
round-2 (or later) appearance triggers a **one-time intro panel**:

> *« Attention ! Quelques verbes utilisent **être** au lieu de **avoir** au
> passé composé. Le verbe* aller *en fait partie. »*

A *Continuer* button dismisses the panel. From then on `aller` may appear
freely.

### Recap screen

Reuses `EndOfRoundRecap` from `conjugaison-present`. Each row shows the verb
infinitive + a green check (no mistakes) or an orange dot (one or more wrong
picks). Tap an orange row to expand the full passé composé conjugation.

Buttons: **Recommencer** (back to pool screen) and **Retour** (homepage).

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Orchestrator: screen state, per-verb state, advance flow |
| `SentenceFrame.tsx` | Renders the time frame with two slot placeholders |
| `AuxiliaryChips.tsx` | 4 mixed avoir/être chips, locks self after correct pick |
| `ParticipeChips.tsx` | 4 participe chips, disabled until aux is correct |
| `AllerIntro.tsx` | One-shot intro panel before the first `aller` round |
| `frames.ts` | The 5 sentence-frame templates and per-verb sample-object map |
| `forms-pc.ts` | Aux-chip and participe-chip pool generation |
| `recap-pc.ts` | Builds `RecapRow[]` for the end-of-round recap |
| `translations.ts` | FR + EN strings (frames, hints, intro paragraph) |
| `config.ts` | Module config (slug, subject `literacy`, difficulty 5) |
| `index.ts` | Standard barrel |
| `Activity.module.css` | Slot/chip/intro styles unique to this module |

Reused from `conjugaison-present`: `PoolSelector`, `EndOfRoundRecap`,
`PoolId`, `ROUND_LENGTH`, `pickRoundVerbs`, `pickSurfacePronouns`.

## Key State

In `Activity.tsx`:

- `screen: 'pool' | 'aller-intro' | 'playing' | 'recap'`
- `verbs: Verb[]` — the 5 verbs of the current round
- `verbIndex: number`
- `surfacePronoun: Pronoun` — the pronoun shown for the current verb
- `stage: 'aux' | 'pp' | 'done'` — which chip pool is active
- `auxChips: string[]` / `ppChips: string[]`
- `pickedAux: string | null` / `pickedPp: string | null`
- `shakingChip: number | null` (per-stage)
- `hintVisible: boolean` — whether a structural hint badge is showing
- `hasSeenAllerIntro: boolean` — set true after the user dismisses the panel
- `roundsPlayed: number` — 0 means "round 1" (excludes `aller`)
- `trickyVerbs: Set<string>` — verbs needing >1 try, drives the recap dot
- `currentVerbHadMistake: useRef<boolean>`
- `timers: useRef<number[]>` — cleared on unmount and on restart
