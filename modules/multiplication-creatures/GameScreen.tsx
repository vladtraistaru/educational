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
import {
  getSpecies,
  getStageIndex,
  getStageProgress,
  rollQuirk,
  STAGE_THRESHOLDS,
  type Quirk,
  type SpeciesId,
} from './creatures';
import Creature, { type Mood } from './Creature';
import EvolutionOverlay from './EvolutionOverlay';
import styles from './Activity.module.css';

interface GameScreenProps {
  speciesId: SpeciesId;
  onFinish: (
    score: number,
    correctCount: number,
    bestStreak: number,
    quirks: Quirk[],
  ) => void;
}

interface Feedback {
  chosenIndex: number;
  wasCorrect: boolean;
}

interface Evolution {
  fromStageIndex: number;
  toStageIndex: number;
  quirk: Quirk | null;
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
  const [quirks, setQuirks] = useState<Quirk[]>([]);
  const [evolution, setEvolution] = useState<Evolution | null>(null);

  const multiplier = getStreakMultiplier(streak);
  const stageIndex = getStageIndex(correctCount);
  const { progress, remaining } = getStageProgress(correctCount);
  const stage = species.stages[stageIndex];
  const isMaxStage = stageIndex >= STAGE_THRESHOLDS.length - 1;

  const advance = useCallback(() => {
    if (lives <= 0) {
      onFinish(score, correctCount, bestStreak, quirks);
      return;
    }
    setQuestion(generateQuestion(factorKey(question.factorA, question.factorB)));
    setFeedback(null);
    setMood('idle');
    setEvolution(null);
  }, [lives, score, correctCount, bestStreak, quirks, question, onFinish]);

  useEffect(() => {
    if (!feedback) return;
    const delay = evolution ? 3000 : 900;
    const timer = setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [feedback, advance, evolution]);

  const handleAnswer = useCallback(
    (chosenIndex: number) => {
      if (feedback) return;

      const chosen = question.options[chosenIndex];
      const wasCorrect = chosen === question.correctAnswer;

      if (wasCorrect) {
        const points = POINTS_PER_QUESTION * multiplier;
        const newCorrect = correctCount + 1;
        const fromStageIndex = getStageIndex(correctCount);
        const toStageIndex = getStageIndex(newCorrect);
        const grew = toStageIndex > fromStageIndex;
        const newStreak = streak + 1;

        setScore((s) => s + points);
        setStreak(newStreak);
        setBestStreak((b) => Math.max(b, newStreak));
        setCorrectCount(newCorrect);
        setMood(grew ? 'evolve' : 'happy');

        if (grew) {
          const quirk = rollQuirk(quirks);
          if (quirk) setQuirks((q) => [...q, quirk]);
          setEvolution({ fromStageIndex, toStageIndex, quirk });
        }
      } else {
        setLives((l) => l - 1);
        setStreak(0);
        setMood('sad');
      }

      setFeedback({ chosenIndex, wasCorrect });
    },
    [feedback, question, multiplier, correctCount, streak, quirks],
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

      <div className={styles.creatureArena}>
        <Creature
          stage={evolution ? species.stages[evolution.fromStageIndex] : stage}
          mood={mood}
          quirks={evolution?.quirk ? quirks.slice(0, -1) : quirks}
        />

        {evolution && (
          <EvolutionOverlay
            fromStage={species.stages[evolution.fromStageIndex]}
            toStage={species.stages[evolution.toStageIndex]}
            headline={t.grewUp}
            stageName={t.stageNames[speciesId][evolution.toStageIndex]}
            quirk={evolution.quirk}
            quirkLine={evolution.quirk ? t.quirkLines[evolution.quirk] : null}
          />
        )}
      </div>

      <div className={styles.growthRow}>
        <span className={styles.growthStageName}>
          {evolution ? '' : t.stageNames[speciesId][stageIndex]}
        </span>

        <div className={styles.xpBarTrack}>
          <div className={styles.xpBarFill} style={{ width: `${progress * 100}%` }} />
        </div>

        {isMaxStage ? (
          <span className={styles.growthNext}>{t.maxStage}</span>
        ) : (
          <span className={styles.growthNext}>
            <span className={styles.nextSilhouette} aria-hidden="true">
              {species.stages[stageIndex + 1].emoji}
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

      {feedback && !evolution && (
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
