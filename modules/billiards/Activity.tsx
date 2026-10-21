'use client';

import { useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import { LEVELS } from './levels';
import MenuScreen from './MenuScreen';
import MissionScreen from './MissionScreen';
import FreePlay from './FreePlay';
import ResultScreen from './ResultScreen';
import styles from './Activity.module.css';

type Screen = 'menu' | 'missions' | 'results' | 'free';

interface Totals {
  stars: number;
  solved: number;
}

const EMPTY_TOTALS: Totals = { stars: 0, solved: 0 };

export default function Activity({}: ActivityProps) {
  const [screen, setScreen] = useState<Screen>('menu');
  const [levelIndex, setLevelIndex] = useState(0);
  const [totals, setTotals] = useState<Totals>(EMPTY_TOTALS);

  const startMissions = () => {
    setLevelIndex(0);
    setTotals(EMPTY_TOTALS);
    setScreen('missions');
  };

  const handleSolved = (stars: number) => {
    setTotals((t) => ({ stars: t.stars + stars, solved: t.solved + 1 }));
    if (levelIndex + 1 >= LEVELS.length) setScreen('results');
    else setLevelIndex((i) => i + 1);
  };

  return (
    <div className={styles.wrapper}>
      {screen === 'menu' && (
        <MenuScreen onMissions={startMissions} onFreePlay={() => setScreen('free')} />
      )}

      {screen === 'missions' && (
        <MissionScreen
          key={LEVELS[levelIndex].id}
          level={LEVELS[levelIndex]}
          levelNumber={levelIndex + 1}
          levelCount={LEVELS.length}
          onSolved={handleSolved}
          onMenu={() => setScreen('menu')}
        />
      )}

      {screen === 'free' && <FreePlay onMenu={() => setScreen('menu')} />}

      {screen === 'results' && (
        <ResultScreen
          stars={totals.stars}
          maxStars={LEVELS.length * 3}
          solved={totals.solved}
          levelCount={LEVELS.length}
          onPlayAgain={startMissions}
          onMenu={() => setScreen('menu')}
        />
      )}
    </div>
  );
}
