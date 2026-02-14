'use client';

import styles from './Activity.module.css';

export default function WordBuilder() {
  return (
    <div className={styles.placeholder}>
      <span className={styles.icon}>Coming Soon</span>
      <p className={styles.text}>
        Build words by dragging letters together and practice spelling.
      </p>
    </div>
  );
}
