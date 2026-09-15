import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import {
  beamAngle,
  isBalanced,
  sideTorque,
  tilt,
  type Load,
  type Side,
  type Tilt,
} from '@/lib/science/mechanics';
import translations from './translations';
import type { Level, PlacedWeight } from './levels';
import BeamStage from './BeamStage';
import BlockTray from './BlockTray';
import styles from './Activity.module.css';

interface ChallengeScreenProps {
  level: Level;
  levelNumber: number;
  levelCount: number;
  onSolved: (stars: number, predictionRight: boolean) => void;
}

const sideExpression = (loads: Load[], side: Side) => {
  const items = loads.filter((l) => l.side === side);
  if (items.length === 0) return '0';
  const parts = items.map((l) => `${l.mass} × ${l.distance}`).join(' + ');
  return `${parts} = ${sideTorque(loads, side)}`;
};

export default function ChallengeScreen({
  level,
  levelNumber,
  levelCount,
  onSolved,
}: ChallengeScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [placed, setPlaced] = useState<PlacedWeight[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Tilt | null>(null);
  const [released, setReleased] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const trayBlocks = level.blocks
    .map((mass, i) => ({ id: `block-${i}`, mass }))
    .filter((b) => !placed.some((p) => p.id === b.id));

  const loads: Load[] = [...level.crates, ...placed];
  const angle = released ? beamAngle(loads) : 0;
  const balanced = isBalanced(loads);
  const tooMany = level.maxBlocks !== undefined && placed.length > level.maxBlocks;
  const solved = released && balanced && !tooMany;
  const predictionRight = prediction === tilt(loads);
  const isLast = levelNumber === levelCount;

  const handleNotchClick = (side: Side, distance: number) => {
    const block = trayBlocks.find((b) => b.id === selectedId);
    if (!block) return;
    setPlaced((current) => [...current, { ...block, side, distance }]);
    setSelectedId(null);
    setPrediction(null);
  };

  const handlePlacedClick = (id: string) => {
    setPlaced((current) => current.filter((p) => p.id !== id));
    setPrediction(null);
  };

  const handleRelease = () => {
    setReleased(true);
    setAttempts((a) => a + 1);
  };

  const handleTryAgain = () => {
    setReleased(false);
    setPrediction(null);
  };

  const handleNext = () => {
    const stars = attempts > 1 ? 1 : predictionRight ? 3 : 2;
    onSolved(stars, predictionRight);
  };

  const predictions: { value: Tilt; label: string }[] = [
    { value: 'left', label: t.tipsLeft },
    { value: 'balanced', label: t.staysBalanced },
    { value: 'right', label: t.tipsRight },
  ];

  return (
    <div className={styles.challenge}>
      <div className={styles.levelBar}>
        <span className={styles.levelCount}>
          {t.level} {levelNumber} {t.of} {levelCount}
        </span>
        <span className={styles.goal}>
          {t.kindGoal[level.kind]}
          {level.maxBlocks !== undefined && ` ${t.fewestGoal} ${level.maxBlocks}.`}
        </span>
      </div>

      <BeamStage
        crates={level.crates}
        placed={placed}
        angle={angle}
        interactive={!released}
        armed={selectedId !== null}
        onNotchClick={handleNotchClick}
        onPlacedClick={handlePlacedClick}
      />

      {released && (
        <div className={styles.torqueRow}>
          <span className={styles.torqueSide}>
            {t.leftSide}: {sideExpression(loads, 'left')}
          </span>
          <span className={styles.torqueVs}>{balanced ? '=' : '≠'}</span>
          <span className={styles.torqueSide}>
            {t.rightSide}: {sideExpression(loads, 'right')}
          </span>
        </div>
      )}

      {released && (
        <div className={solved ? styles.feedbackGood : styles.feedbackBad}>
          <strong>
            {tooMany
              ? t.tooManyBlocks
              : balanced
                ? t.balanced
                : tilt(loads) === 'left'
                  ? t.tippedLeft
                  : t.tippedRight}
          </strong>
          <span className={styles.predictionNote}>
            {predictionRight ? t.goodPrediction : t.wrongPrediction}
          </span>
        </div>
      )}

      {!released && (
        <>
          <BlockTray
            blocks={trayBlocks}
            selectedId={selectedId}
            disabled={false}
            onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
          />
          {trayBlocks.length > 0 && <p className={styles.hint}>{t.placeHint}</p>}
        </>
      )}

      {!released && placed.length > 0 && (
        <div className={styles.predictRow}>
          <span className={styles.predictPrompt}>{t.predictPrompt}</span>
          <div className={styles.predictButtons}>
            {predictions.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPrediction(p.value)}
                className={`${styles.predictBtn} ${
                  prediction === p.value ? styles.predictBtnActive : ''
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        {!released && (
          <button
            type="button"
            className={styles.releaseBtn}
            disabled={prediction === null || placed.length === 0}
            onClick={handleRelease}
          >
            {t.release}
          </button>
        )}
        {released && !solved && (
          <button type="button" className={styles.retryBtn} onClick={handleTryAgain}>
            {t.tryAgain}
          </button>
        )}
        {solved && (
          <button type="button" className={styles.nextBtn} onClick={handleNext}>
            {isLast ? t.finish : t.next}
          </button>
        )}
      </div>
    </div>
  );
}
