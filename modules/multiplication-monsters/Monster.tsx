import styles from './Activity.module.css';

export type Mood = 'idle' | 'happy' | 'sad' | 'evolve';

interface MonsterProps {
  emoji: string;
  mood: Mood;
}

const MOOD_CLASS: Record<Mood, string> = {
  idle: styles.monsterIdle,
  happy: styles.monsterHappy,
  sad: styles.monsterSad,
  evolve: styles.monsterEvolve,
};

export default function Monster({ emoji, mood }: MonsterProps) {
  return (
    <div className={styles.monsterStage}>
      <span className={`${styles.monsterEmoji} ${MOOD_CLASS[mood]}`}>{emoji}</span>
      {mood === 'evolve' && (
        <span className={styles.evolveBurst} aria-hidden="true">
          ✨
        </span>
      )}
    </div>
  );
}
