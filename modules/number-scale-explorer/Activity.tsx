'use client';

import styles from './Activity.module.css';

export default function NumberScaleExplorer() {
  return (
    <iframe
      src="/modules/number-scale-explorer/index.html"
      className={styles.frame}
      title="Number Scale Explorer"
    />
  );
}
