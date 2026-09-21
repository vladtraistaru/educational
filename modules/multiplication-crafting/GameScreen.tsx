'use client';

import { useState, useCallback, useEffect, useRef, type FormEvent } from 'react';
import { useLanguage } from '@/lib/language';
import translations from './translations';
import {
  type Question,
  generateQuestion,
  getStreakMultiplier,
  POINTS_PER_QUESTION,
  STARTING_LIVES,
} from './questions';
import {
  CRAFTED_STAGE,
  getNextIcons,
  getRecipe,
  getStageIndex,
  getStageProgress,
  type RecipeId,
} from './recipes';
import CraftingTable, { type Mood } from './CraftingTable';
import DiscoveryOverlay from './DiscoveryOverlay';
import PixelIcon from './PixelIcon';
import styles from './Activity.module.css';

const FEEDBACK_MS = 900;
const WRONG_MS = 2200;
const DISCOVERY_MS = 4500;

interface GameScreenProps {
  recipeId: RecipeId;
  onFinish: (score: number, correctCount: number, bestStreak: number) => void;
}

interface Feedback {
  wasCorrect: boolean;
}

interface Discovery {
  fromStageIndex: number;
  toStageIndex: number;
}

function factorKey(a: number, b: number): string {
  return `${Math.min(a, b)}-${Math.max(a, b)}`;
}

export default function GameScreen({ recipeId, onFinish }: GameScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const recipe = getRecipe(recipeId);
  const text = t.recipes[recipeId];

  const [question, setQuestion] = useState<Question>(() => generateQuestion());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [mood, setMood] = useState<Mood>('idle');
  const [discovery, setDiscovery] = useState<Discovery | null>(null);

  const multiplier = getStreakMultiplier(streak);
  const stageIndex = getStageIndex(correctCount);
  const { progress, remaining } = getStageProgress(correctCount);
  const isCrafted = stageIndex >= CRAFTED_STAGE;
  const nextIcons = getNextIcons(recipe, stageIndex);
  const inputRef = useRef<HTMLInputElement>(null);

  const advance = useCallback(() => {
    if (lives <= 0) {
      onFinish(score, correctCount, bestStreak);
      return;
    }
    setQuestion(generateQuestion(factorKey(question.factorA, question.factorB)));
    setAnswer('');
    setFeedback(null);
    setMood('idle');
    setDiscovery(null);
  }, [lives, score, correctCount, bestStreak, question, onFinish]);

  useEffect(() => {
    if (!feedback) return;
    const delay = discovery ? DISCOVERY_MS : feedback.wasCorrect ? FEEDBACK_MS : WRONG_MS;
    const timer = setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [feedback, advance, discovery]);

  useEffect(() => {
    if (!feedback) inputRef.current?.focus();
  }, [feedback, question]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (feedback || answer === '') return;

      const wasCorrect = Number(answer) === question.correctAnswer;

      if (wasCorrect) {
        const newCorrect = correctCount + 1;
        const fromStageIndex = getStageIndex(correctCount);
        const toStageIndex = getStageIndex(newCorrect);
        const newStreak = streak + 1;

        setScore((s) => s + POINTS_PER_QUESTION * multiplier);
        setStreak(newStreak);
        setBestStreak((b) => Math.max(b, newStreak));
        setCorrectCount(newCorrect);

        if (toStageIndex > fromStageIndex) {
          setMood('evolve');
          setDiscovery({ fromStageIndex, toStageIndex });
        } else {
          setMood('happy');
        }
      } else {
        setLives((l) => l - 1);
        setStreak(0);
        setMood('sad');
      }

      setFeedback({ wasCorrect });
    },
    [feedback, answer, question, multiplier, correctCount, streak],
  );

  return (
    <div className={styles.gameContainer}>
      <div className={styles.topBar}>
        <div className={styles.scoreDisplay}>
          <span className={styles.scoreLabel}>{t.score}</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>

        {streak >= 3 && (
          <div className={styles.streakDisplay}>
            <span className={styles.streakFire}>🔥 x{multiplier}</span>
          </div>
        )}

        <div className={styles.livesDisplay}>
          {Array.from({ length: STARTING_LIVES }, (_, i) => (
            <span key={i} className={styles.heart}>
              {i < lives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.tableArena}>
        <CraftingTable
          recipe={recipe}
          stageIndex={discovery ? discovery.fromStageIndex : stageIndex}
          mood={mood}
        />

        {discovery && (
          <DiscoveryOverlay
            recipe={recipe}
            stageIndex={discovery.toStageIndex}
            headline={discovery.toStageIndex >= CRAFTED_STAGE ? t.crafted : t.discovered}
            stageName={
              discovery.toStageIndex >= CRAFTED_STAGE
                ? text.name
                : t.stageNames[discovery.toStageIndex]
            }
            fact={text.facts[discovery.toStageIndex - 1]}
          />
        )}
      </div>

      <div className={styles.growthRow}>
        <span className={styles.growthStageName}>
          {discovery ? '' : t.stageNames[stageIndex]}
        </span>

        <div className={styles.xpBarTrack}>
          <div className={styles.xpBarFill} style={{ width: `${progress * 100}%` }} />
        </div>

        {isCrafted ? (
          <span className={styles.growthNext}>{t.maxStage}</span>
        ) : (
          <span className={styles.growthNext}>
            <span className={styles.nextSilhouettes} aria-hidden="true">
              {nextIcons.map((icon, i) => (
                <PixelIcon key={i} id={icon} className={styles.nextSilhouette} />
              ))}
            </span>
            {t.growthHint.replace('{n}', String(remaining))}
          </span>
        )}
      </div>

      <div className={styles.questionArea}>
        <span className={styles.questionText}>
          {question.factorA} × {question.factorB} = ?
        </span>
      </div>

      {feedback && !discovery && (
        <div
          className={feedback.wasCorrect ? styles.feedbackBadgeCorrect : styles.feedbackBadgeWrong}
        >
          {feedback.wasCorrect ? t.correct : t.wrong}
          {feedback.wasCorrect && multiplier > 1 && (
            <span className={styles.bonusText}>
              +{POINTS_PER_QUESTION * multiplier} {t.pts}
            </span>
          )}
          {!feedback.wasCorrect && (
            <span className={styles.bonusText}>
              {question.factorA} × {question.factorB} = {question.correctAnswer}
            </span>
          )}
        </div>
      )}

      <form className={styles.answerForm} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className={`${styles.answerInput} ${
            feedback ? (feedback.wasCorrect ? styles.answerCorrect : styles.answerWrong) : ''
          }`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={3}
          autoComplete="off"
          aria-label={t.yourAnswer}
          placeholder="?"
          value={answer}
          readOnly={feedback !== null}
          onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ''))}
        />
        <button
          type="submit"
          className={styles.answerSubmit}
          disabled={feedback !== null || answer === ''}
        >
          {t.check}
        </button>
      </form>
    </div>
  );
}
