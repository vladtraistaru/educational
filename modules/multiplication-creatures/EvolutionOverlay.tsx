import type { CSSProperties } from 'react';
import type { CreatureStage, Quirk } from './creatures';
import styles from './Activity.module.css';

const CONFETTI = ['✨', '⭐', '💫', '🎉', '🌟', '💥'];
const PARTICLE_COUNT = 16;

interface EvolutionOverlayProps {
  fromStage: CreatureStage;
  toStage: CreatureStage;
  headline: string;
  stageName: string;
  quirk: Quirk | null;
  quirkLine: string | null;
}

export default function EvolutionOverlay({
  fromStage,
  toStage,
  headline,
  stageName,
  quirk,
  quirkLine,
}: EvolutionOverlayProps) {
  return (
    <div className={styles.evolveOverlay}>
      <div className={styles.evolveParticles} aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <span
            key={i}
            className={styles.particle}
            style={
              {
                '--spin': `rotate(${(i * 360) / PARTICLE_COUNT}deg)`,
                animationDelay: `${0.45 + (i % 4) * 0.07}s`,
              } as CSSProperties
            }
          >
            {CONFETTI[i % CONFETTI.length]}
          </span>
        ))}
      </div>

      <div className={styles.evolveFlash} aria-hidden="true" />

      <div className={styles.evolveSwap}>
        <span
          className={styles.evolveOld}
          style={{ fontSize: `${fromStage.scale}em` }}
          aria-hidden="true"
        >
          {fromStage.emoji}
        </span>
        <span className={styles.evolveNew} style={{ fontSize: `${toStage.scale}em` }}>
          {toStage.emoji}
        </span>
      </div>

      <div className={styles.evolveText}>
        <span className={styles.evolveHeadline}>{headline}</span>
        <span className={styles.evolveStageName}>{stageName}</span>
        {quirk && quirkLine && (
          <span className={styles.evolveQuirk}>
            <span className={styles.evolveQuirkIcon}>{quirk}</span>
            {quirkLine}
          </span>
        )}
      </div>
    </div>
  );
}
