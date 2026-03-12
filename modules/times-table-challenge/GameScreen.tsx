'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/lib/language';
import translations from './translations';
import {
  type Question,
  type DifficultyConfig,
  getStreakMultiplier,
  QUESTIONS_PER_ROUND,
} from './questions';
import styles from './Activity.module.css';

interface GameScreenProps {
  questions: Question[];
  difficulty: DifficultyConfig;
  onFinish: (score: number, correctCount: number) => void;
}

interface Feedback {
  chosenIndex: number;
  wasCorrect: boolean;
}

export default function GameScreen({
  questions,
  difficulty,
  onFinish,
}: GameScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const question = questions[currentIndex];
  const multiplier = getStreakMultiplier(streak);

  const advance = useCallback(() => {
    const next = currentIndex + 1;
    if (next >= QUESTIONS_PER_ROUND) {
      onFinish(score, correctCount);
    } else {
      setCurrentIndex(next);
      setFeedback(null);
    }
  }, [currentIndex, score, correctCount, onFinish]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(advance, 900);
    return () => clearTimeout(timer);
  }, [feedback, advance]);

  const handleAnswer = useCallback(
    (chosenIndex: number) => {
      if (feedback) return;

      const chosen = question.options[chosenIndex];
      const wasCorrect = chosen === question.correctAnswer;

      if (wasCorrect) {
        const points = difficulty.pointsPerQuestion * multiplier;
        setScore((s) => s + points);
        setStreak((s) => s + 1);
        setCorrectCount((c) => c + 1);
      } else {
        setStreak(0);
      }

      setFeedback({ chosenIndex, wasCorrect });
    },
    [feedback, question, difficulty, multiplier],
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
            <span className={styles.streakFire}>x{multiplier}</span>
          </div>
        )}

        <div className={styles.progressDisplay}>
          {currentIndex + 1} / {QUESTIONS_PER_ROUND}
        </div>
      </div>

      <div className={styles.questionArea}>
        <span className={styles.questionText}>
          {question.factorA} × {question.factorB} = ?
        </span>
      </div>

      {feedback && (
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
              +{difficulty.pointsPerQuestion * multiplier} {t.pts}
            </span>
          )}
        </div>
      )}

      <div className={styles.optionsGrid}>
        {question.options.map((option, i) => (
          <button
            key={`${currentIndex}-${i}`}
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
