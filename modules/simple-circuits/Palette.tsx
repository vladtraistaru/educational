'use client';

import styles from './Activity.module.css';

interface PaletteProps {
  labels: {
    paletteTitle: string;
    bulb: string;
    switchLabel: string;
    resistor: string;
    capacitor: string;
  };
}

export default function Palette({ labels }: PaletteProps) {
  const handleDragStart =
    (kind: 'bulb' | 'switch' | 'resistor' | 'capacitor') => (e: React.DragEvent) => {
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
        <svg viewBox="0 0 60 60" width="32" height="32" aria-hidden="true">
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
        <svg viewBox="0 0 60 60" width="32" height="32" aria-hidden="true">
          <circle cx="14" cy="30" r="3" fill="#2d3436" />
          <circle cx="46" cy="30" r="3" fill="#2d3436" />
          <line x1="14" y1="30" x2="40" y2="14" stroke="#2d3436" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span>{labels.switchLabel}</span>
      </div>

      <div
        className={styles.paletteItem}
        draggable
        onDragStart={handleDragStart('resistor')}
      >
        <svg viewBox="0 0 60 60" width="32" height="32" aria-hidden="true">
          <line x1="6" y1="30" x2="14" y2="30" stroke="#2d3436" strokeWidth="2" />
          <polyline
            points="14,30 18,22 24,38 30,22 36,38 42,22 46,30"
            fill="none"
            stroke="#2d3436"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line x1="46" y1="30" x2="54" y2="30" stroke="#2d3436" strokeWidth="2" />
        </svg>
        <span>{labels.resistor}</span>
      </div>

      <div
        className={styles.paletteItem}
        draggable
        onDragStart={handleDragStart('capacitor')}
      >
        <svg viewBox="0 0 60 60" width="32" height="32" aria-hidden="true">
          <line x1="6" y1="30" x2="26" y2="30" stroke="#2d3436" strokeWidth="2" />
          <line x1="26" y1="16" x2="26" y2="44" stroke="#2d3436" strokeWidth="3" />
          <line x1="34" y1="16" x2="34" y2="44" stroke="#2d3436" strokeWidth="3" />
          <line x1="34" y1="30" x2="54" y2="30" stroke="#2d3436" strokeWidth="2" />
        </svg>
        <span>{labels.capacitor}</span>
      </div>
    </aside>
  );
}
