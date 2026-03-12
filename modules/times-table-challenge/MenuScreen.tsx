'use client';

import { useLanguage } from '@/lib/language';
import translations from './translations';
import { DIFFICULTIES, type DifficultyConfig } from './questions';
import styles from './Activity.module.css';

interface MenuScreenProps {
  onStart: (difficulty: DifficultyConfig) => void;
}

const LEVEL_COLORS: Record<string, string> = {
  easy: '#00b894',
  medium: '#fdcb6e',
  hard: '#e17055',
};

export default function MenuScreen({ onStart }: MenuScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.menuContainer}>
      <h3 className={styles.menuTitle}>{t.pickDifficulty}</h3>

      <div className={styles.levelCards}>
        {DIFFICULTIES.map((d) => {
          const dt = t.difficulties[d.id];
          return (
            <button
              key={d.id}
              className={styles.levelCard}
              style={{ borderColor: LEVEL_COLORS[d.id] }}
              onClick={() => onStart(d)}
            >
              <span
                className={styles.levelLabel}
                style={{ color: LEVEL_COLORS[d.id] }}
              >
                {dt?.label ?? d.id}
              </span>
              <span className={styles.levelRange}>
                {dt?.description}
              </span>
              <span className={styles.levelPoints}>
                {d.pointsPerQuestion} {t.pointsPerQuestion}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
