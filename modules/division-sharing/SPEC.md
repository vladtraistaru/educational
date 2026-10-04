# Division Crafting

Slug: `division-sharing` (kept from the earlier fair-sharing version so existing links still work).

## Purpose

An arcade-style survival game that drills **division facts**, the reverse of the times tables. It is the companion to `multiplication-crafting` and uses the same game loop and look. Every question is `dividend ÷ divisor = ?`, built from a times-table fact, so it never has a remainder. The divisor and the answer are both between 3 and 12, and never 10 (dividing by 1, 2 or 10 is too easy). Aligns with MER *Opérations* (~8–10 years).

The learner picks one of three **mystery recipes** and fills a 3×3 crafting table by answering. Every few correct answers a new row appears and a **discovery card** reveals a division fact hidden in that recipe ("one log gives 4 planks, so 12 planks ÷ 4 = 3 logs"). A wrong answer costs a life; the game ends when all lives are lost.

## Recipes

Every fact was checked against the Minecraft Wiki.

| Recipe | Grid (rows) | Division hooks |
|--------|-------------|----------------|
| Chest | 3 planks / plank + empty + plank / 3 planks | log → 4 planks (12 ÷ 4, 8 ÷ 4), 8 planks per chest (24 ÷ 8), 27 slots in rows of 9, double chest 54 ÷ 9 |
| Block of Iron | 9 iron ingots | 9 nuggets per ingot (27 ÷ 9), coal smelts 8 items (24 ÷ 8), 45 ÷ 9 blocks, iron golem = 4 blocks (12 ÷ 4) |
| Bookshelf | 3 planks / 3 books / 3 planks | 6 planks per shelf (24 ÷ 6), 3 paper per book (12 ÷ 3), 15 shelves for max enchanting (45 ÷ 3) |

Recipe grids may contain empty slots (`null`), like the middle of the chest.

## User Experience

Same as `multiplication-crafting` (see its SPEC): five stages (thresholds 0 / 3 / 8 / 15 / 25 correct answers), discovery overlay, silhouette teaser of the next row, 3 lives, typed answers (no multiple choice), streak multipliers x2 / x3 / x4 at 3 / 6 / 10, results screen with the facts discovered. On a wrong answer the correct division is shown.

## Graphics

Original 8×8 pixel icons in `icons.ts` (planks, iron ingot, book, chest, block of iron, bookshelf), no Mojang textures. Every screen shows the "not an official Minecraft product" disclaimer.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Screen flow (`menu` / `playing` / `results`), chosen recipe, final result, disclaimer. |
| `MenuScreen.tsx` | Mystery recipe cards. |
| `GameScreen.tsx` | Score, streak, lives, current question, discoveries; calls `onFinish` when lives run out. |
| `ResultScreen.tsx` | Final table, stats, unlocked facts, play again. |
| `CraftingTable.tsx` | 3×3 grid + result slot for a stage. |
| `DiscoveryOverlay.tsx` | The stage-up moment. |
| `PixelIcon.tsx`, `icons.ts` | Pixel-art rendering and data. |
| `recipes.ts` | Pure logic: recipes, stage thresholds and progress. |
| `questions.ts` | `generateQuestion()` builds one exact division; `getStreakMultiplier()`. |
| `translations.ts` | EN/FR strings, recipe names, clues and four facts per recipe. |
| `recipes.test.ts`, `questions.test.ts` | Icon data, real ingredient counts, stage logic, question bounds and exactness. |

## Key State

- `Activity.tsx`: `screen`, `recipeId`, `result { score, correctCount, bestStreak }`
- `GameScreen.tsx`: `question { dividend, divisor, correctAnswer }`, `score`, `streak`, `bestStreak`, `correctCount`, `lives`, `answer`, `feedback { wasCorrect }`, `mood`, `discovery { fromStageIndex, toStageIndex }`
