import { useMemo, useState } from 'react';
import { useLanguage } from '@/lib/language';
import translations from './translations';
import { buildWorld, rack } from './levels';
import Table, { type ShotResult } from './Table';
import styles from './Activity.module.css';

interface FreePlayProps {
  onMenu: () => void;
}

const CUE_SPOT = { x: 250, y: 250 };

export default function FreePlay({ onMenu }: FreePlayProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [rackCount, setRackCount] = useState(0);
  const [guide, setGuide] = useState(true);
  const [shots, setShots] = useState(0);
  const [sunk, setSunk] = useState(0);

  const world = useMemo(() => buildWorld(CUE_SPOT, rack({ x: 700, y: 250 }, 4)), []);

  const newRack = () => {
    setRackCount((r) => r + 1);
    setShots(0);
    setSunk(0);
  };

  const handleShotEnd = ({ potted }: ShotResult) => {
    setShots((s) => s + 1);
    setSunk((n) => n + potted.filter((b) => b.kind === 'target').length);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.topBar}>
        <button type="button" className={styles.linkBtn} onClick={onMenu}>
          ← {t.menu}
        </button>
        <span className={styles.levelCount}>{t.freePlay}</span>
        <button type="button" className={styles.linkBtn} onClick={newRack}>
          ↺ {t.newRack}
        </button>
      </div>

      <Table
        key={rackCount}
        initial={world}
        cueSpot={CUE_SPOT}
        guide={guide}
        locked={false}
        label={t.tableLabel}
        onShotEnd={handleShotEnd}
      />

      <div className={styles.freeControls}>
        <button
          type="button"
          className={`${styles.pill} ${guide ? styles.pillActive : ''}`}
          aria-pressed={guide}
          onClick={() => setGuide((g) => !g)}
        >
          {t.guide}
        </button>
        <span className={styles.counter}>
          {t.shots}: <strong>{shots}</strong>
        </span>
        <span className={styles.counter}>
          {t.sunk}: <strong>{sunk}</strong>
        </span>
      </div>
    </div>
  );
}
