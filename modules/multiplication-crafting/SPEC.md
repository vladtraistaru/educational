# Multiplication Crafting

## Purpose

An arcade-style survival game that drills multiplication facts for tables 2-12 (multiplying by 1 is too easy, so it is left out). The learner picks one of three **mystery recipes** and fills a 3×3 crafting table by answering `A × B = ?` questions. Every few correct answers a new row of ingredients appears and a **discovery card** reveals a multiplication fact hidden in that recipe ("a cake has 7 slices, so 3 cakes are 3 × 7 = 21"). Once the table is full, the final stretch crafts the item. A wrong answer costs a life; the game ends when all lives are lost and the discoveries so far are the trophy.

The recipes are inspired by Minecraft. Every fact was checked against the Minecraft Wiki (ingredient counts, 7 cake slices, beacon pyramid layers 3²/5²/7²/9² = 9/25/49/81, total 164).

## Recipes

Each recipe fills all 9 slots of the grid, so the 3 rows × 3 columns array is itself a multiplication.

| Recipe | Grid (rows) | Multiplication hooks |
|--------|-------------|----------------------|
| Cake | 3 milk / sugar + egg + sugar / 3 wheat | 4 × 3 buckets, 5 × 2 sugar, 3 × 7 slices |
| TNT | checkerboard of 5 gunpowder + 4 sand | 3 × 5 gunpowder, 6 × 4 sand, 8 × 9 = 72 items > a stack of 64 |
| Beacon | 3 glass / glass + nether star + glass / 3 obsidian | 2 × 5 glass, pyramid layers 3×3, 5×5, 7×7, 9×9 = 164 blocks |

On the menu the recipes stay mysterious: a grid of empty slots plus a one-line clue. The results screen never names the recipe: the player only learns it by crafting it (the crafted discovery names the item) or from the facts already unlocked.

## Progress design

- **Five stages** (thresholds 0 / 3 / 8 / 15 / 25 correct answers): empty table → row 1 → row 2 → row 3 (table full) → crafted result.
- **Discovery moment** (`DiscoveryOverlay`): ~4.5s sequence — the old table fades, a white flash and confetti burst, the new row (or the crafted item) pops in ingredient by ingredient, then headline, stage name and the multiplication fact reveal in sequence.
- **Teaser**: the progress meter shows greyed-out silhouettes of what the next stage will add, plus how many more correct answers are needed.

## Graphics

All art is original: 8×8 pixel-art icons defined as character grids in `icons.ts` and drawn as SVG by `PixelIcon`, and the crafting table is plain CSS. No Mojang textures or images are used (Mojang's usage guidelines do not allow redistributing game assets). Every screen shows the required "not an official Minecraft product" disclaimer.

## User Experience

### Menu (`MenuScreen`)
- Three mystery-recipe cards (empty grid with a "?" in the middle, plus a clue such as "Something sweet…").
- Tap a card to start the game with that recipe.

### Game (`GameScreen`)
- Crafting table in a fixed-height arena, reacting to answers (bob when correct, shake when wrong, fade into the discovery overlay on a new stage).
- Progress meter: current stage name, bar, silhouettes of the next stage and remaining count.
- 3 hearts show remaining lives; a wrong answer removes one heart.
- Question `A × B = ?` with a text box for the answer (numeric keypad on phones; Enter or the Check button submits), factors 2-12. No multiple choice, so the answer must be recalled, not guessed.
- Score and streak multiplier in the top bar. Streaks of 3+ give x2 points, 6+ give x3, 10+ give x4. A wrong answer resets the streak.
- A wrong answer shows the correct product for ~2.2s; a correct one moves on after ~900ms (4500ms for a discovery) the next question loads. At 0 lives the round ends.

### Results (`ResultScreen`)
- The crafting table as far as it got, score, total correct, best streak.
- "Your discoveries": the multiplication facts unlocked this round.
- "Play Again" returns to the menu.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Owns screen flow (`'menu' \| 'playing' \| 'results'`), chosen recipe, final result; shows the disclaimer. |
| `MenuScreen.tsx` | Mystery recipe cards. Calls `onStart` with the recipe id. |
| `GameScreen.tsx` | Owns score, streak, lives, correct count, current question, mood and the active discovery. Advances automatically; calls `onFinish` when lives run out. |
| `ResultScreen.tsx` | Final table, recipe name, stats, unlocked facts, play again. |
| `CraftingTable.tsx` | 3×3 grid + arrow + result slot for a stage; mood-driven animation; `isNew` pops in the newest row or the result. |
| `DiscoveryOverlay.tsx` | The stage-up moment: confetti, flash, table pop-in, headline / stage name / fact. |
| `PixelIcon.tsx` | Renders an icon from `icons.ts` as SVG. |
| `icons.ts` | Pixel-art data for every ingredient and result. |
| `recipes.ts` | Pure logic: recipes, stage thresholds, `getStageIndex`, `getStageProgress`, `getVisibleRows`, `getNextIcons`. No UI. |
| `questions.ts` | `generateQuestion()` builds one random `A × B` question (factors 2-12) and its answer. `getStreakMultiplier()` for scoring. |
| `translations.ts` | EN/FR strings, recipe names, clues and the four facts per recipe. |
| `recipes.test.ts` | Checks icon data, real ingredient counts and stage logic. |
| `questions.test.ts` | Checks factors stay within 2-12, answers, no immediate repeats and streak multipliers. |

## Key State

- `Activity.tsx`: `screen`, `recipeId`, `result { score, correctCount, bestStreak }`
- `GameScreen.tsx`: `question`, `score`, `streak`, `bestStreak`, `correctCount`, `lives`, `answer`, `feedback { wasCorrect }`, `mood`, `discovery { fromStageIndex, toStageIndex }`
