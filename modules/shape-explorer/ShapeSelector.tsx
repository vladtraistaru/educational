import type { Shape } from './shapes';
import { useLanguage } from '@/lib/language';
import translations from './translations';
import styles from './Activity.module.css';

interface ShapeSelectorProps {
  shapes: Shape[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function ShapeThumbnail({ shape }: { shape: Shape }) {
  const pointsStr = shape.vertices.map((v) => v.join(',')).join(' ');

  return (
    <svg viewBox="0 0 200 200" className={styles.selectorThumbnail}>
      {shape.vertices.length > 0 ? (
        <polygon
          points={pointsStr}
          fill={shape.color}
          stroke={shape.color}
          strokeWidth="6"
          strokeLinejoin="round"
        />
      ) : shape.id === 'circle' ? (
        <circle cx="100" cy="100" r="80" fill={shape.color} />
      ) : (
        <ellipse cx="100" cy="100" rx="90" ry="60" fill={shape.color} />
      )}
    </svg>
  );
}

export default function ShapeSelector({
  shapes,
  selectedId,
  onSelect,
}: ShapeSelectorProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.selectorGrid}>
      {shapes.map((shape) => (
        <button
          key={shape.id}
          className={
            shape.id === selectedId
              ? styles.selectorItemSelected
              : styles.selectorItem
          }
          onClick={() => onSelect(shape.id)}
        >
          <ShapeThumbnail shape={shape} />
          <span className={styles.selectorName}>{t.shapes[shape.id]?.name ?? shape.name}</span>
        </button>
      ))}
    </div>
  );
}
