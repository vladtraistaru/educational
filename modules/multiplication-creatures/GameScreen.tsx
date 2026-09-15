'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/lib/language';
import translations from './translations';
import {
  type Question,
  generateQuestion,
  getStreakMultiplier,
  POINTS_PER_QUESTION,
  STARTING_LIVES,
} from './questions';
import { getSpecies, getStageIndex, getStageProgress, type SpeciesId } from './monsters';
import Monster, { type Mood } from './Monster';
import styles from './Activity.module.css';

interface GameScreenProps {
  speciesId: SpeciesId;
  onFinish: (score: number, correctCount: number, bestStreak: number) => void;
}

interface Feedback {
  chosenIndex: number;
  wasCorrect: boolean;
}

function factorKey(a: number, b: number): string {
  return `${Math.min(a, b)}-${Math.max(a, b)}`;
}

export default function GameScreen({ speciesId, onFinish }: GameScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const species = getSpecies(speciesId);

  const [question, setQuestion] = useState<Question>(() => generateQuestion());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [mood, setMood] = useState<Mood>('idle');
  const [justEvolved, setJustEvolved] = useState(false);

  const multiplier = getStreakMultiplier(streak);
  const stageIndex = getStageIndex(correctCount);
  const { progress } = getStageProgress(correctCount);
  const monsterEmoji = species.stages[stageIndex];

  const advance = useCallback(() => {
    if (lives <= 0) {
      onFinish(score, correctCount, bestStreak);
      return;
    }
    setQuestion(generateQuestion(factorKey(question.factorA, question.factorB)));
    setFeedback(null);
    setMood('idle');
    setJustEvolved(false);
  }, [lives, score, correctCount, bestStreak, question, onFinish]);

  useEffect(() => {
    if (!feedback) return;
    const delay = justEvolved ? 1400 : 900;
    const timer = setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [feedback, advance, justEvolved]);

  const handleAnswer = useCallback(
    (chosenIndex: number) => {
      if (feedback) return;

      const chosen = question.options[chosenIndex];
      const wasCorrect = chosen === question.correctAnswer;

      if (wasCorrect) {
        const points = POINTS_PER_QUESTION * multiplier;
        const newCorrect = correctCount + 1;
        const evolved = getStageIndex(newCorrect) > getStageIndex(correctCount);
        const newStreak = streak + 1;

        setScore((s) => s + points);
        setStreak(newStreak);
        setBestStreak((b) => Math.max(b, newStreak));
        setCorrectCount(newCorrect);
        setMood(evolved ? 'evolve' : 'happy');
        setJustEvolved(evolved);
      } else {
        setLives((l) => l - 1);
        setStreak(0);
        setMood('sad');
      }

      setFeedback({ chosenIndex, wasCorrect });
    },
    [feedback, question, multiplier, correctCount, streak],
  );

  const getOptionClass = (index: number): string => {
    if (!feedback) return styles.optionBtn;

    const isChosen = index === feedback.chosenIndex;
    const isCorrect = question.options[index] === question.correctAnswer;

    if (isCorrect) return `${styles.optionBtn} ${styles.optionCorrect}`;
    if (isChosen && !feedback.wasCorrect)
      return `${styles.optionBtn} ${styles.optionWrong}`;
    return `${styles.optionBtn} ${styles.optionDimmed}`;
  };

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

      <Monster emoji={monsterEmoji} mood={mood} />

      <div className={styles.xpBarTrack}>
        <div className={styles.xpBarFill} style={{ width: `${progress * 100}%` }} />
      </div>

      {justEvolved && <div className={styles.evolvedBanner}>{t.evolved}</div>}

      <div className={styles.questionArea}>
        <span className={styles.questionText}>
          {question.factorA} × {question.factorB} = ?
        </span>
      </div>

      {feedback && !justEvolved && (
        <div
          className={
            feedback.wasCorrect
              ? styles.feedbackBadgeCorrect
              : styles.feedbackBadgeWrong
          }
        >
          {feedback.wasCorrect ? t.correct : t.wrong}
          {feedback.wasCorrect && multiplier > 1 && (
            <span className={styles.bonusText}>
              +{POINTS_PER_QUESTION * multiplier} {t.pts}
            </span>
          )}
        </div>
      )}

      <div className={styles.optionsGrid}>
        {question.options.map((option, i) => (
          <button
            key={`${question.factorA}-${question.factorB}-${i}`}
            tabIndex={feedback ? -1 : 0}
            className={getOptionClass(i)}
            onClick={() => handleAnswer(i)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
