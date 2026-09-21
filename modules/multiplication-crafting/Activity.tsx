'use client';

import { useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import type { RecipeId } from './recipes';
import MenuScreen from './MenuScreen';
import GameScreen from './GameScreen';
import ResultScreen from './ResultScreen';
import styles from './Activity.module.css';

type Screen = 'menu' | 'playing' | 'results';

interface RoundResult {
  score: number;
  correctCount: number;
  bestStreak: number;
}

export default function Activity({}: ActivityProps) {
  const [screen, setScreen] = useState<Screen>('menu');
  const [recipeId, setRecipeId] = useState<RecipeId>('cake');
  const [result, setResult] = useState<RoundResult | null>(null);

  const handleStart = (chosen: RecipeId) => {
    setRecipeId(chosen);
    setScreen('playing');
  };

  const handleFinish = (score: number, correctCount: number, bestStreak: number) => {
    setResult({ score, correctCount, bestStreak });
    setScreen('results');
  };

  const handlePlayAgain = () => {
    setResult(null);
    setScreen('menu');
  };

  return (
    <div className={styles.wrapper}>
      {screen === 'menu' && <MenuScreen onStart={handleStart} />}
      {screen === 'playing' && <GameScreen recipeId={recipeId} onFinish={handleFinish} />}
      {screen === 'results' && result && (
        <ResultScreen
          recipeId={recipeId}
          score={result.score}
          correctCount={result.correctCount}
          bestStreak={result.bestStreak}
          onPlayAgain={handlePlayAgain}
        />
      )}
      <p className={styles.disclaimer}>
        NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
      </p>
    </div>
  );
}
