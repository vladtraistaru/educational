import type { Direction, Move } from './grid';
import styles from './Activity.module.css';

const ARROWS: Record<Direction, string> = { up: '↑', down: '↓', left: '←', right: '→' };

export default function PathPrompt({ moves, words }: { moves: Move[]; words: Record<Direction, string> }) {
  return (
    <ol className={styles.moves}>
      {moves.map((move, i) => (
        <li key={i} className={styles.moveChip}>
          <strong>{move.steps}</strong> <span aria-hidden="true">{ARROWS[move.dir]}</span> {words[move.dir]}
        </li>
      ))}
    </ol>
  );
}
