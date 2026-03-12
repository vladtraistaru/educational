'use client';

import { useState, useCallback } from 'react';
import type { ActivityProps } from '@/lib/types';
import {
  type DifficultyConfig,
  type Question,
  generateRound,
} from './questions';
import MenuScreen from './MenuScreen';
import GameScreen from './GameScreen';
import ResultScreen from './ResultScreen';
import styles from './Activity.module.css';

type Screen = 'menu' | 'playing' | 'results';

interface GameResult {
  score: number;
  correctCount: number;
}

export default function TimesTableChallenge(_props: ActivityProps) {
  const [screen, setScreen] = useState<Screen>('menu');
  const [difficulty, setDifficulty] = useState<DifficultyConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<GameResult>({ score: 0, correctCount: 0 });

  const handleStart = useCallback((diff: DifficultyConfig) => {
    setDifficulty(diff);
    setQuestions(generateRound(diff));
    setScreen('playing');
  }, []);

  const handleFinish = useCallback((score: number, correctCount: number) => {
    setResult({ score, correctCount });
    setScreen('results');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setScreen('menu');
  }, []);

  return (
    <div className={styles.wrapper}>
      {screen === 'menu' && <MenuScreen onStart={handleStart} />}
      {screen === 'playing' && difficulty && (
        <GameScreen
          key={questions[0]?.factorA}
          questions={questions}
          difficulty={difficulty}
          onFinish={handleFinish}
        />
      )}
      {screen === 'results' && (
        <ResultScreen
          score={result.score}
          correctCount={result.correctCount}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
