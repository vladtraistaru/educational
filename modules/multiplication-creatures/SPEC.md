# Multiplication Monsters

## Purpose

An arcade-style survival game that drills multiplication facts for all tables 1-12. Learners pick a pet monster, then "feed" it by answering `A × B = ?` questions correctly. Every correct answer grows the monster through five evolution stages (Egg → Hatchling → Teen → Mega → Legendary); wrong answers cost a life. The game ends when all lives are lost, and the final evolution stage is the trophy.

## User Experience

Three screens in sequence:

### Menu (`MenuScreen`)
- Three monster species cards (Dragon, Sea Beast, Forest Beast), each shown as an egg with its name.
- Tap a card to start the game with that species.

### Game (`GameScreen`)
- Monster displayed large at the top, reacting to answers (bounce when fed correctly, shake when wrong, a burst animation when it evolves).
- XP bar under the monster shows progress toward the next evolution stage.
- 3 hearts show remaining lives; a wrong answer removes one heart.
- Question shown as `A × B = ?` with four tappable answer bubbles (one correct, three plausible distractors), factors drawn from 1-12.
- Score and streak multiplier shown in the top bar. Streaks of 3+ give x2 points, 6+ give x3, 10+ give x4. A wrong answer resets the streak.
- After ~900ms of feedback, the next question loads automatically. If lives reach 0, the round ends and results are shown.

### Results (`ResultScreen`)
- Big display of the monster's final stage and species.
- Final score, total correct answers, and best streak reached.
- "Play Again" returns to the monster-selection menu.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Owns screen flow (`'menu' \| 'playing' \| 'results'`), chosen species, and final result passed to `ResultScreen`. |
| `MenuScreen.tsx` | Species selection cards. Calls `onStart` with the chosen species id. |
| `GameScreen.tsx` | Owns score, streak, lives, correct count, current question, and feedback/mood state. Advances automatically after each answer; calls `onFinish` when lives run out. |
| `ResultScreen.tsx` | Final monster stage, score, stats, play again button. |
| `Monster.tsx` | Displays the monster's current stage emoji with a mood-driven animation class (idle / happy / sad / evolve). |
| `monsters.ts` | Pure logic: species definitions (stage emoji per species) and stage-threshold helpers (`getStageIndex`, `getStageProgress`). No UI. |
| `questions.ts` | `generateQuestion()` builds one random `A × B` question (factors 1-12) with 3 plausible wrong options. `getStreakMultiplier()` for scoring. |

## Key State

- `Activity.tsx`: `screen`, `speciesId`, `result { score, correctCount, bestStreak }`
- `GameScreen.tsx`: `question`, `score`, `streak`, `bestStreak`, `correctCount`, `lives`, `feedback { chosenIndex, wasCorrect }`, `mood`, `justEvolved`
