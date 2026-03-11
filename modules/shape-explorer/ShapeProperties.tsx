import type { Shape } from './shapes';
import { useLanguage } from '@/lib/language';
import translations from './translations';
import styles from './Activity.module.css';

interface ShapePropertiesProps {
  shape: Shape;
}

export default function ShapeProperties({ shape }: ShapePropertiesProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const st = t.shapes[shape.id];

  return (
    <div className={styles.propertiesPanel}>
      <div className={styles.propertyGrid}>
        <div className={styles.propertyItem}>
          <span className={styles.propertyValue}>{shape.sides}</span>
          <span className={styles.propertyLabel}>
            {shape.sides === 1 ? t.side : t.sides}
          </span>
        </div>
        <div className={styles.propertyItem}>
          <span className={styles.propertyValue}>{shape.corners}</span>
          <span className={styles.propertyLabel}>
            {shape.corners === 1 ? t.corner : t.corners}
          </span>
        </div>
        <div className={styles.propertyItem}>
          <span className={styles.propertyValue}>
            {shape.regular ? t.yes : t.no}
          </span>
          <span className={styles.propertyLabel}>{t.allSidesEqual}</span>
        </div>
      </div>

      <div className={styles.realWorld}>
        <span className={styles.realWorldEmoji}>{shape.realWorldEmoji}</span>
        <div>
          <div className={styles.realWorldTextLabel}>{t.realWorldExample}</div>
          <div className={styles.realWorldText}>{st?.realWorldExample ?? shape.realWorldExample}</div>
        </div>
      </div>

      <div className={styles.funFact}>
        <span className={styles.funFactLabel}>{t.funFact}</span>
        {st?.funFact ?? shape.funFact}
      </div>
    </div>
  );
}
