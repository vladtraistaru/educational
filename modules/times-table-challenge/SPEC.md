# Times Table Challenge

## Purpose

A quiz game to practice multiplication recall. Learners choose a difficulty, answer 10 multiple-choice questions, and earn points with streak bonuses.

## User Experience

Three screens in sequence:

### Menu
- Three difficulty cards: Easy (tables 2-5, 10 pts), Medium (tables 3-9, 20 pts), Hard (tables 6-12, 30 pts).
- Tap a card to start.

### Game
- Shows `A x B = ?` with four answer options (one correct, three plausible distractors).
- Tap an option. Correct answers highlight green, wrong answers highlight red with the correct one also shown.
- Score and current streak displayed. Streaks of 3+ give x2 multiplier, 5+ give x3, 8+ give x4. Wrong answers reset the streak.
- After ~900ms feedback, the next question loads. After 10 questions, moves to results.

### Results
- 1-3 stars based on correct count (any = 1 star, 5+ = 2 stars, 8+ = 3 stars).
- Final score and "X out of 10" correct.
- "Play Again" returns to the menu.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Owns screen flow (`'menu' | 'playing' | 'results'`), difficulty, questions, and result. |
| `MenuScreen.tsx` | Difficulty selection cards. Calls `onStart` with chosen config. |
| `GameScreen.tsx` | Question display, answer options, score, streak, feedback. Advances automatically after each answer. |
| `ResultScreen.tsx` | Stars, score, correct count, play again button. |
| `questions.ts` | `generateRound()` creates 10 unique questions. `generateWrongAnswers()` produces plausible distractors. `getStreakMultiplier()` and `getStars()` for scoring logic. |

## Key State

- `Activity.tsx`: `screen`, `difficulty`, `questions[]`, `result { score, correctCount }`
- `GameScreen.tsx`: `currentIndex` (0-9), `score`, `streak`, `correctCount`, `feedback { chosenIndex, wasCorrect }`
