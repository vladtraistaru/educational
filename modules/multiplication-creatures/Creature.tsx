import type { CSSProperties } from 'react';
import type { CreatureStage, Quirk } from './creatures';
import styles from './Activity.module.css';

export type Mood = 'idle' | 'happy' | 'sad' | 'evolve';

interface CreatureProps {
  stage: CreatureStage;
  mood: Mood;
  quirks: Quirk[];
}

const MOOD_CLASS: Record<Mood, string> = {
  idle: styles.creatureIdle,
  happy: styles.creatureHappy,
  sad: styles.creatureSad,
  evolve: styles.creatureEvolve,
};

/** Radius is in the decoration's own em, so the whole ring scales with the creature. */
function ringStyle(
  index: number,
  count: number,
  radius: number,
  delay: number,
): CSSProperties {
  const angle = -90 + (index * 360) / Math.max(count, 1);
  return {
    '--ring': `rotate(${angle}deg) translateY(-${radius}em) rotate(${-angle}deg)`,
    animationDelay: `${delay}s`,
  } as CSSProperties;
}

export default function Creature({ stage, mood, quirks }: CreatureProps) {
  return (
    <div className={styles.creatureStage}>
      <div
        className={styles.creatureGlow}
        style={{ background: stage.glow, transform: `scale(${stage.scale})` }}
        aria-hidden="true"
      />

      <div className={styles.creatureOrbit}>
        {stage.charms.map((charm, i) => (
          <span
            key={`charm-${i}`}
            className={styles.charm}
            style={ringStyle(i, stage.charms.length, 1.55 + stage.scale, i * 0.18)}
            aria-hidden="true"
          >
            {charm}
          </span>
        ))}

        {quirks.map((quirk, i) => (
          <span
            key={quirk}
            className={styles.quirk}
            style={ringStyle(
              i + 1,
              Math.max(quirks.length + 1, 4),
              2.15 + stage.scale * 0.78,
              i * 0.25,
            )}
          >
            {quirk}
          </span>
        ))}

        <span
          className={`${styles.creatureEmoji} ${MOOD_CLASS[mood]}`}
          style={{ fontSize: `${stage.scale}em` }}
        >
          {stage.emoji}
        </span>
      </div>

      <div
        className={styles.creatureShadow}
        style={{ width: `${stage.scale * 0.9}em` }}
        aria-hidden="true"
      />
    </div>
  );
}
