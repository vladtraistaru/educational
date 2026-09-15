# Multiplication Creatures

## Purpose

An arcade-style survival game that drills multiplication facts for all tables 1-12. Learners hatch a fantasy creature (unicorn, dragon or phoenix) and "feed" it by answering `A × B = ?` questions. The hook is growth: every few correct answers the creature visibly gets bigger, gains orbiting decorations, and picks up a random silly accessory. Wrong answers cost a life; the game ends when all lives are lost and the creature's final form is the trophy.

## Growth design

Growth is the centrepiece, not a side effect:

- **Five stages** (thresholds at 0 / 3 / 8 / 15 / 25 correct answers) with per-species names, e.g. Glimmer Egg → Wobbly Foal → Unicorn → Winged Alicorn → Starlit Celestial.
- **Literal size**: each stage carries a `scale` (1 → 2.7) applied to the creature's font size, its glow, and its ground shadow, all CSS-transitioned so the creature swells as it levels up.
- **Accumulating charms**: each stage adds decorations that orbit the creature (sparkles, wings, crown, rainbow), so later forms are visibly busier and more elaborate.
- **Surprise quirks**: on every growth the creature picks up one random accessory from a pool of eight (top hat, sunglasses, a single sock, a pet snail...) with a funny one-line explanation. Quirks persist for the round, orbit the creature, and are listed on the results screen.
- **Evolution moment** (`EvolutionOverlay`): a ~3s sequence that takes over the creature area — the old form shrinks and spins away, a white flash bursts, 16 confetti particles fly outward, the new bigger form pops in, then the headline, new stage name, and quirk line reveal in sequence.
- **Teaser**: the growth meter shows a greyed-out silhouette of the next stage plus how many more correct answers are needed, so the next form stays a mystery worth chasing.

## User Experience

Three screens in sequence:

### Menu (`MenuScreen`)
- Three mystery-egg cards (Sparkhoof, Emberclaw, Sunfeather), each showing its egg and a row of grey silhouettes of increasing size hinting at the growth path.
- Tap a card to start the game with that species.

### Game (`GameScreen`)
- Creature displayed large in a fixed-height arena, reacting to answers (bounce when fed correctly, shake when wrong, vanish-into-the-evolution-overlay when it grows).
- Growth meter under the creature: current stage name, progress bar, next-stage silhouette and remaining count.
- 3 hearts show remaining lives; a wrong answer removes one heart.
- Question shown as `A × B = ?` with four tappable answer bubbles (one correct, three plausible distractors), factors drawn from 1-12.
- Score and streak multiplier shown in the top bar. Streaks of 3+ give x2 points, 6+ give x3, 10+ give x4. A wrong answer resets the streak.
- After ~900ms of feedback (3000ms for a growth) the next question loads automatically. If lives reach 0, the round ends and results are shown.

### Results (`ResultScreen`)
- The fully rendered final creature, at its final size, with all its charms and collected quirks still orbiting.
- Final stage name, score, total correct, best streak, and a row of quirk badges for the weird things it picked up.
- "Play Again" returns to the egg-selection menu.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Owns screen flow (`'menu' \| 'playing' \| 'results'`), chosen species, and final result (including quirks) passed to `ResultScreen`. |
| `MenuScreen.tsx` | Species selection cards with silhouette growth teaser. Calls `onStart` with the chosen species id. |
| `GameScreen.tsx` | Owns score, streak, lives, correct count, current question, mood, collected quirks, and the active evolution. Advances automatically after each answer; calls `onFinish` when lives run out. |
| `ResultScreen.tsx` | Final creature, stage name, score, stats, quirk collection, play again button. |
| `Creature.tsx` | Renders the creature at its stage scale, with glow, orbiting charms, collected quirks, ground shadow, and a mood-driven animation class (idle / happy / sad / evolve). |
| `EvolutionOverlay.tsx` | The growth moment: confetti particles, flash, old→new form swap, staged headline / stage name / quirk reveal. |
| `creatures.ts` | Pure logic: species stage definitions (emoji, scale, charms, glow), quirk pool and `rollQuirk`, stage-threshold helpers (`getStageIndex`, `getStageProgress`). No UI. |
| `questions.ts` | `generateQuestion()` builds one random `A × B` question (factors 1-12) with 3 plausible wrong options. `getStreakMultiplier()` for scoring. |

## Key State

- `Activity.tsx`: `screen`, `speciesId`, `result { score, correctCount, bestStreak, quirks }`
- `GameScreen.tsx`: `question`, `score`, `streak`, `bestStreak`, `correctCount`, `lives`, `feedback { chosenIndex, wasCorrect }`, `mood`, `quirks`, `evolution { fromStageIndex, toStageIndex, quirk }`
