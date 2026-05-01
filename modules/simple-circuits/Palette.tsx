'use client';

import styles from './Activity.module.css';

interface PaletteProps {
  labels: { paletteTitle: string; bulb: string; switchLabel: string };
}

export default function Palette({ labels }: PaletteProps) {
  const handleDragStart = (kind: 'bulb' | 'switch') => (e: React.DragEvent) => {
    e.dataTransfer.setData('application/x-circuit-component', kind);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className={styles.palette}>
      <h3 className={styles.paletteTitle}>{labels.paletteTitle}</h3>

      <div
        className={styles.paletteItem}
        draggable
        onDragStart={handleDragStart('bulb')}
      >
        <svg viewBox="0 0 60 60" width="48" height="48" aria-hidden="true">
          <circle cx="30" cy="26" r="14" fill="#fff5cc" stroke="#2d3436" strokeWidth="2" />
          <line x1="22" y1="38" x2="38" y2="38" stroke="#2d3436" strokeWidth="2" />
          <line x1="24" y1="42" x2="36" y2="42" stroke="#2d3436" strokeWidth="2" />
        </svg>
        <span>{labels.bulb}</span>
      </div>

      <div
        className={styles.paletteItem}
        draggable
        onDragStart={handleDragStart('switch')}
      >
        <svg viewBox="0 0 60 60" width="48" height="48" aria-hidden="true">
          <circle cx="14" cy="30" r="3" fill="#2d3436" />
          <circle cx="46" cy="30" r="3" fill="#2d3436" />
          <line x1="14" y1="30" x2="40" y2="14" stroke="#2d3436" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span>{labels.switchLabel}</span>
      </div>
    </aside>
  );
}
