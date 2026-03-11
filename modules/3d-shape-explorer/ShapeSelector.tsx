import { shapes, type Shape3D } from './shapes';
import { useLanguage } from '@/lib/language';
import translations from './translations';
import styles from './Activity.module.css';

interface ShapeSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const SHAPE_ICONS: Record<string, string> = {
  cube: '🎲',
  cuboid: '📦',
  sphere: '⚽',
  cylinder: '🥫',
  cone: '🎉',
  'triangular-prism': '⛺',
  'square-pyramid': '🔺',
};

export default function ShapeSelector({
  selectedId,
  onSelect,
}: ShapeSelectorProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.selector}>
      <div className={styles.selectorScroll}>
        {shapes.map((shape: Shape3D) => (
          <button
            key={shape.id}
            className={`${styles.shapeBtn} ${selectedId === shape.id ? styles.shapeBtnActive : ''}`}
            onClick={() => onSelect(shape.id)}
            style={
              selectedId === shape.id
                ? { borderColor: shape.color, background: `${shape.color}20` }
                : undefined
            }
          >
            <span className={styles.shapeBtnIcon}>
              {SHAPE_ICONS[shape.id]}
            </span>
            <span className={styles.shapeBtnLabel}>{t.shapes[shape.id]?.name ?? shape.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
