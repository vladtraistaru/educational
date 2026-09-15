'use client';

import { useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import type { Quirk, SpeciesId } from './creatures';
import MenuScreen from './MenuScreen';
import GameScreen from './GameScreen';
import ResultScreen from './ResultScreen';
import styles from './Activity.module.css';

type Screen = 'menu' | 'playing' | 'results';

interface RoundResult {
  score: number;
  correctCount: number;
  bestStreak: number;
  quirks: Quirk[];
}

export default function Activity({}: ActivityProps) {
  const [screen, setScreen] = useState<Screen>('menu');
  const [speciesId, setSpeciesId] = useState<SpeciesId>('unicorn');
  const [result, setResult] = useState<RoundResult | null>(null);

  const handleStart = (chosen: SpeciesId) => {
    setSpeciesId(chosen);
    setScreen('playing');
  };

  const handleFinish = (
    score: number,
    correctCount: number,
    bestStreak: number,
    quirks: Quirk[],
  ) => {
    setResult({ score, correctCount, bestStreak, quirks });
    setScreen('results');
  };

  const handlePlayAgain = () => {
    setResult(null);
    setScreen('menu');
  };

  return (
    <div className={styles.wrapper}>
      {screen === 'menu' && <MenuScreen onStart={handleStart} />}
      {screen === 'playing' && (
        <GameScreen speciesId={speciesId} onFinish={handleFinish} />
      )}
      {screen === 'results' && result && (
        <ResultScreen
          speciesId={speciesId}
          score={result.score}
          correctCount={result.correctCount}
          bestStreak={result.bestStreak}
          quirks={result.quirks}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
