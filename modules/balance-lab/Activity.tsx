'use client';

import { useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import { LEVELS } from './levels';
import MenuScreen from './MenuScreen';
import ChallengeScreen from './ChallengeScreen';
import ResultScreen from './ResultScreen';
import styles from './Activity.module.css';

type Screen = 'menu' | 'playing' | 'results';

interface Totals {
  stars: number;
  solved: number;
  predicted: number;
}

const EMPTY_TOTALS: Totals = { stars: 0, solved: 0, predicted: 0 };

export default function Activity({}: ActivityProps) {
  const [screen, setScreen] = useState<Screen>('menu');
  const [levelIndex, setLevelIndex] = useState(0);
  const [totals, setTotals] = useState<Totals>(EMPTY_TOTALS);

  const handleStart = () => {
    setLevelIndex(0);
    setTotals(EMPTY_TOTALS);
    setScreen('playing');
  };

  const handleSolved = (stars: number, predictionRight: boolean) => {
    setTotals((t) => ({
      stars: t.stars + stars,
      solved: t.solved + 1,
      predicted: t.predicted + (predictionRight ? 1 : 0),
    }));
    if (levelIndex + 1 >= LEVELS.length) {
      setScreen('results');
    } else {
      setLevelIndex((i) => i + 1);
    }
  };

  return (
    <div className={styles.wrapper}>
      {screen === 'menu' && <MenuScreen onStart={handleStart} />}

      {screen === 'playing' && (
        <ChallengeScreen
          key={LEVELS[levelIndex].id}
          level={LEVELS[levelIndex]}
          levelNumber={levelIndex + 1}
          levelCount={LEVELS.length}
          onSolved={handleSolved}
        />
      )}

      {screen === 'results' && (
        <ResultScreen
          stars={totals.stars}
          maxStars={LEVELS.length * 3}
          solved={totals.solved}
          predicted={totals.predicted}
          levelCount={LEVELS.length}
          onPlayAgain={handleStart}
        />
      )}
    </div>
  );
}
