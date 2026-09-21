import type { CSSProperties } from 'react';
import type { Recipe } from './recipes';
import CraftingTable from './CraftingTable';
import styles from './Activity.module.css';

const CONFETTI = ['✨', '⭐', '💫', '🎉', '🌟', '💥'];
const PARTICLE_COUNT = 16;

interface DiscoveryOverlayProps {
  recipe: Recipe;
  stageIndex: number;
  headline: string;
  stageName: string;
  fact: string;
}

export default function DiscoveryOverlay({
  recipe,
  stageIndex,
  headline,
  stageName,
  fact,
}: DiscoveryOverlayProps) {
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
        <CraftingTable recipe={recipe} stageIndex={stageIndex} mood="idle" isNew />
      </div>

      <div className={styles.evolveText}>
        <span className={styles.evolveHeadline}>{headline}</span>
        <span className={styles.evolveStageName}>{stageName}</span>
        <span className={styles.evolveFact}>{fact}</span>
      </div>
    </div>
  );
}
