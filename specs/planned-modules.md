# Planned modules (roadmap)

Product plan aligned with the Romandie PER sketch in `docs/curriculum/romandie.md` (especially §3.5, ~9 ans / milieu de primaire). Each planned slug has a **draft** `SPEC.md` under `modules/<slug>/`. A module is **shipped** only after `config.ts`, `translations.ts`, `Activity.tsx`, `index.ts`, and `registry.ts` registration exist per `AGENTS.md`.

---

## Priority 1 — largest curriculum gaps

| Slug (proposed) | Subject | Short description |
|-----------------|---------|-------------------|
| `measure-lengths` | mathematics | Compare and read lengths using cm/m on a ruler or bar; simple real-world contexts. |
| `measure-time` | mathematics | Read analog and digital clocks; durations and “before / after” in a day. |
| `symmetry-play` | mathematics | Complete a figure across a mirror line; spot symmetrical or not in grids or photos. |
| `add-subtract-playground` | mathematics | Mental and small-number written +/−; multiple strategies; complements existing multiplication modules. |
| `grid-coordinates` | mathematics | Locate cells on a grid; simple “map” or treasure-hunt wording; optional first-quadrant pairs later. |

---

## Priority 2 — operations, space, problems

| Slug (proposed) | Subject | Short description |
|-----------------|---------|-------------------|
| `division-sharing` | mathematics | Division as fair sharing and grouping; ties arrays from multiplication to “how many groups”. |
| `solid-views` | mathematics | Match 3D shapes to top / front / side views; extends `3d-shape-explorer`. |
| `perimeter-intro` | mathematics | Perimeter on a grid or with known side lengths; rectangles first. |
| `area-intro` | mathematics | Count unit squares; compare areas; rectangles on a grid after perimeter is comfortable. |
| `word-problems-steps` | mathematics | One- and two-step problems in short stories; optional sketch or bar hint; mixed + − ×. |

---

## Priority 3 — sciences de la nature (MSN)

| Slug (proposed) | Subject | Short description |
|-----------------|---------|-------------------|
| `plant-parts` | science | Observe and label root, stem, leaf, flower, fruit; link to everyday plants. |
| `food-chains-simple` | science | Who eats whom in a pond or forest; producer → consumer chains at primary level. |
| `states-of-matter` | science | Solid, liquid, gas with simple sorting and everyday examples; no heavy theory. |

---

## Priority 4 — Français (L1, langue de scolarisation)

Aligned with PER **L1** axes (see `docs/curriculum/romandie.md` §4.1). Cycle 1 modules focus on entry into reading/writing; cycle 2 on autonomous reading, grammar, and writing.

| Slug (proposed) | Subject | PER axis | Short description |
|-----------------|---------|----------|-------------------|
| `phoneme-grapheme-match` | literacy | `L1 11-12` (cycle 1) | Match a heard sound to the right letter or letter group; combinatoire foundation. |
| `syllable-counter` | literacy | `L1 11-12` (cycle 1) | Tap or click to segment a spoken word into syllables; phonological awareness. |
| `mots-outils-flash` | literacy | `L1 11-12` (cycle 1) | Recognise high-frequency function words (le, la, et, est, dans…) at sight. |
| `accord-singulier-pluriel` | literacy | `L1 16` / `L1 26` | Agree noun + adjective in number; chaîne d’accord on short noun phrases. |
| `classes-de-mots` | literacy | `L1 16` / `L1 26` | Sort words into nom / verbe / adjectif / déterminant; cycle 2 grammar basics. |
| `conjugaison-present` | literacy | `L1 26` (cycle 2) | Conjugate regular verbs (1er groupe + être/avoir) at présent de l’indicatif. |
| `lecture-comprehension-courte` | literacy | `L1 21` (cycle 2) | Read a short text, answer literal then inferential questions. |
| `comparaison-fr-en` | literacy | `L 17` / `L 27` | Spot cognates and false friends between French and English; interlinguistic awareness. |

---

## Already shipped (context)

| Slug | Notes |
|------|--------|
| `number-scale-explorer` | Number line / parts — Nombres (partial). |
| `shape-explorer`, `3d-shape-explorer`, `euclidean-postulates` | Espace — geometry. |
| `multiplication-patterns`, `times-table-challenge` | Opérations — multiplication. |
| `laser-and-mirrors` | Physics / light — not MER “vivant & matière” but valuable for sciences tools. |

---

## How to implement one item

1. Create `/modules/<slug>/` with `SPEC.md` (design first).  
2. Add `config.ts`, `translations.ts`, `Activity.tsx`, `index.ts`, optional CSS.  
3. Register in `modules/registry.ts`.
