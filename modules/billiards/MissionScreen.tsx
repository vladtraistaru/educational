import { useMemo, useState } from 'react';
import { useLanguage } from '@/lib/language';
import translations, { type NoteKey } from './translations';
import { levelWorld, maxShots, starsFor, type Level } from './levels';
import Table, { type ShotResult } from './Table';
import styles from './Activity.module.css';

interface MissionScreenProps {
  level: Level;
  levelNumber: number;
  levelCount: number;
  onSolved: (stars: number) => void;
  onMenu: () => void;
}

type Status = 'playing' | 'won' | 'lost';

export default function MissionScreen({ level, levelNumber, levelCount, onSolved, onMenu }: MissionScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const text = t.levels[level.id];

  const [attempt, setAttempt] = useState(0);
  const [shots, setShots] = useState(0);
  const [sunk, setSunk] = useState(0);
  const [status, setStatus] = useState<Status>('playing');
  const [note, setNote] = useState<NoteKey | null>(null);

  const world = useMemo(() => levelWorld(level), [level]);
  const limit = maxShots(level);
  const hasBomb = level.balls.some((b) => b.kind === 'bomb');
  const stars = starsFor(shots, level.par);
  const isLast = levelNumber === levelCount;

  const restart = () => {
    setAttempt((a) => a + 1);
    setShots(0);
    setSunk(0);
    setStatus('playing');
    setNote(null);
  };

  const handleShotEnd = ({ potted, scratch }: ShotResult) => {
    const shotsNow = shots + 1;
    const sunkNow = sunk + potted.filter((b) => b.kind === 'target').length;
    setShots(shotsNow);
    setSunk(sunkNow);

    if (potted.some((b) => b.kind === 'bomb')) {
      setStatus('lost');
      setNote('bomb');
    } else if (sunkNow >= level.goal) {
      setStatus('won');
      setNote(null);
    } else if (shotsNow >= limit) {
      setStatus('lost');
      setNote('outOfShots');
    } else {
      setNote(scratch ? 'scratch' : sunkNow > sunk ? 'nice' : 'miss');
    }
  };

  const goal = level.goal === 1 ? t.goalOne : t.goalMany.replace('{n}', String(level.goal));

  return (
    <div className={styles.screen}>
      <div className={styles.topBar}>
        <button type="button" className={styles.linkBtn} onClick={onMenu}>
          ← {t.menu}
        </button>
        <span className={styles.levelCount}>
          {t.level} {levelNumber} {t.of} {levelCount}
        </span>
        <button type="button" className={styles.linkBtn} onClick={restart}>
          ↺ {t.restart}
        </button>
      </div>

      <div className={styles.levelBar}>
        <span className={styles.levelTitle}>{text.title}</span>
        <span className={styles.goal}>
          {goal} {hasBomb && <strong className={styles.bombWarning}>{t.avoidBomb}</strong>}
        </span>
      </div>

      <Table
        key={attempt}
        initial={world}
        cueSpot={level.cue}
        guide
        locked={status !== 'playing'}
        label={t.tableLabel}
        onShotEnd={handleShotEnd}
      />

      <div className={styles.statusRow}>
        <span className={styles.shotsLeft} aria-label={`${t.shotsLeft}: ${limit - shots}`}>
          {t.shotsLeft}{' '}
          {Array.from({ length: limit }, (_, i) => (
            <span key={i} className={i < limit - shots ? styles.shotDot : styles.shotDotUsed} />
          ))}
        </span>
        {note && status === 'playing' && <span className={styles.note}>{t.notes[note]}</span>}
      </div>

      {status === 'won' && (
        <div className={styles.feedbackGood}>
          <strong>{t.solved}</strong>
          <span className={styles.stars}>{'⭐'.repeat(stars)}</span>
          <button type="button" className={styles.nextBtn} onClick={() => onSolved(stars)}>
            {isLast ? t.finish : t.next}
          </button>
        </div>
      )}

      {status === 'lost' && (
        <div className={styles.feedbackBad}>
          <strong>{note && t.notes[note]}</strong>
          <button type="button" className={styles.retryBtn} onClick={restart}>
            {t.tryAgain}
          </button>
        </div>
      )}

      <div className={styles.ideaCard}>
        <span className={styles.ideaLabel}>💡 {t.physicsIdea}</span>
        <p>{text.idea}</p>
      </div>
    </div>
  );
}
