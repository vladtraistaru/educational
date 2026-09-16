import type { CSSProperties } from 'react';
import { ELEMENTS, type ElementSymbol } from '@/lib/science/chemistry';
import styles from './Activity.module.css';

interface AtomTokenProps {
  symbol: ElementSymbol;
  size: 'large' | 'small';
  showHands?: boolean;
}

export default function AtomToken({ symbol, size, showHands = true }: AtomTokenProps) {
  const el = ELEMENTS[symbol];
  const style = {
    '--atom-color': el.color,
    '--atom-text': el.textColor,
  } as CSSProperties;

  return (
    <span className={size === 'large' ? styles.atomLarge : styles.atomSmall} style={style}>
      {showHands &&
        Array.from({ length: el.hands }, (_, i) => (
          <span
            key={i}
            className={styles.hand}
            style={{ '--hand-angle': `${(360 / el.hands) * i - 90}deg` } as CSSProperties}
          />
        ))}
      <span className={styles.atomSymbol}>{symbol}</span>
    </span>
  );
}
