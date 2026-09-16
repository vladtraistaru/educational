# Molecule Lab

## Purpose

A first, hands-on taste of **chemistry**: everything around us is built from a small set of atoms. Children pick simple atoms (H, O, N, C, Na, Cl, S), put them together in a mixing bowl and discover real molecules — water, salt, carbon dioxide, ozone… Each discovery shows the molecule's shape and **where you meet it in nature or everyday life**. No organic chemistry, no equations, no numbers beyond counting atoms.

Target: ~8–12 years. Reading support: short sentences, big emoji, colours per atom.

## Big idea: atom "hands"

Each atom is drawn with little **hands** (its usual number of bonds): H 1, O 2, N 3, C 4, Cl 1, Na 1, S 2. The tip line teaches "molecules are happy when every hand holds another hand". Hands are a guide only — the lab never forbids a combination; it just checks whether the atoms in the bowl match a known molecule.

## User Experience

Two tabs at the top: **Free lab** and **Nature missions**.

### Free lab

1. **Atom shelf** — seven big round atom buttons (colour, symbol, name, hands). Tap to drop one into the bowl.
2. **Mixing bowl** — shows the atoms added so far (max 8), plus a live count like `2 × H, 1 × O`. Tap an atom in the bowl to take it back out. **Clear** empties the bowl.
3. **Combine!** —
   - **Match**: the bowl shakes, then a **result card** pops in: the molecule drawn with coloured atoms and bond lines (single/double/triple, dashed for salt-like "ionic" pairs), its name, formula with subscripts (H₂O), a big nature emoji, *where you find it* and a *fun fact*. If it's the first time, a "New discovery!" badge appears. The bowl empties so the child can try again.
   - **Almost** (1–2 atoms away from a molecule): friendly hint — "So close! Try adding 1 × H" / "Try taking out 1 × O". The molecule's name is not revealed.
   - **No match**: "These atoms don't make a molecule from our lab book" + the hands tip.
4. **Lab book** (collection) — a grid of all molecules. Found ones show emoji, formula and name and can be tapped to reopen their card. Unfound ones show "?" and how many atoms they need. Progress: "7 / 17 discovered". Discoveries are remembered on this device (localStorage).

### Nature missions

1. A round of 8 random missions. Each mission shows a big emoji and a riddle ("I fall from the clouds and fill the oceans.").
2. The child builds with the same shelf and bowl and presses **Combine!**
   - Right molecule → result card + "Mission complete!" + **Next**.
   - A different real molecule → "You made *carbon dioxide* — not this one, but it goes in your lab book!" (it is added to the collection).
   - Otherwise → hint towards the mission's molecule (add/remove atoms).
3. **Skip** moves on without a point. After the last mission: result screen with stars (solved / 8) and **Play again**.

## Molecules

Only small inorganic molecules, each tied to something a child knows:

| Formula | Name | In nature / life |
|---|---|---|
| H₂ | hydrogen | the Sun |
| O₂ | oxygen | the air plants make |
| N₂ | nitrogen | most of the air |
| Cl₂ | chlorine | swimming pools |
| O₃ | ozone | shield high in the sky |
| H₂O | water | rain, rivers, you |
| H₂O₂ | hydrogen peroxide | cleaning scraped knees |
| CO₂ | carbon dioxide | breath out, fizzy drinks |
| CO | carbon monoxide | smoke — why homes have alarms |
| NH₃ | ammonia | smelly pee, plant food |
| NaCl | salt | the sea |
| HCl | hydrochloric acid | your stomach |
| H₂S | hydrogen sulfide | rotten eggs, volcanoes |
| SO₂ | sulfur dioxide | volcanoes, struck match |
| NO | nitric oxide | lightning |
| NaOH | sodium hydroxide | soap making |
| NaHCO₃ | baking soda | cakes rising, fizzy volcano |

Dangerous substances are framed with a safety note, never as something to try.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Tabs (lab / missions), discovered set + localStorage persistence. |
| `LabMode.tsx` | Free lab: bowl state, combine feedback, selected result, lab book. |
| `MissionMode.tsx` | Mission round: target, attempts, feedback, progress, results. |
| `Workbench.tsx` | Atom shelf + mixing bowl + Combine/Clear buttons (shared by both modes). |
| `AtomToken.tsx` | Round atom with symbol and hands, in two sizes. |
| `MoleculeDiagram.tsx` | SVG drawing of a molecule from its layout. |
| `ResultCard.tsx` | Diagram, name, formula, nature emoji, where + fact. |
| `LabBook.tsx` | Collection grid with progress. |
| `FormulaText.tsx` | Renders `H2O` as H₂O. |
| `molecules.ts` | Molecule list: formula, emoji, 2D atom layout, bonds. |
| `moleculeFacts.ts` | Per-language name, riddle, nature text, fun fact. |
| `lab.ts` | `findMolecule`, `hintFor`, `closestHint` — pure logic (tested). |
| `translations.ts` | UI strings + element names. |

Shared logic in `lib/science/chemistry/`: `elements.ts` (symbol, colour, hands) and `formula.ts` (`parseFormula`, `countAtoms`, `sameComposition`, `compositionDiff`), with tests.

## Key State

- `Activity.tsx`: `mode` (`'lab' | 'missions'`), `discovered` (`Set<string>` of molecule ids, loaded from/saved to localStorage), `discover(id)` passed down.
- `LabMode.tsx`: `atoms` (`ElementSymbol[]` in the bowl), `feedback` (`match | almost | none`), `shownId` (molecule card on screen), `isNew`.
- `MissionMode.tsx`: `missionIds` (8 shuffled ids), `index`, `solved`, `atoms`, `feedback` (`solved | other | hint`), `finished`.
- `Workbench.tsx` is controlled: `atoms`, `onAdd`, `onRemove`, `onClear`, `onCombine`, `shake`.
