import type { Shape } from './shapes';
import styles from './Activity.module.css';

interface ShapePropertiesProps {
  shape: Shape;
}

export default function ShapeProperties({ shape }: ShapePropertiesProps) {
  return (
    <div className={styles.propertiesPanel}>
      <div className={styles.propertyGrid}>
        <div className={styles.propertyItem}>
          <span className={styles.propertyValue}>{shape.sides}</span>
          <span className={styles.propertyLabel}>
            {shape.sides === 1 ? 'Side' : 'Sides'}
          </span>
        </div>
        <div className={styles.propertyItem}>
          <span className={styles.propertyValue}>{shape.corners}</span>
          <span className={styles.propertyLabel}>
            {shape.corners === 1 ? 'Corner' : 'Corners'}
          </span>
        </div>
        <div className={styles.propertyItem}>
          <span className={styles.propertyValue}>
            {shape.regular ? 'Yes' : 'No'}
          </span>
          <span className={styles.propertyLabel}>All sides equal?</span>
        </div>
      </div>

      <div className={styles.realWorld}>
        <span className={styles.realWorldEmoji}>{shape.realWorldEmoji}</span>
        <div>
          <div className={styles.realWorldTextLabel}>Real-world example</div>
          <div className={styles.realWorldText}>{shape.realWorldExample}</div>
        </div>
      </div>

      <div className={styles.funFact}>
        <span className={styles.funFactLabel}>Fun fact:</span>
        {shape.funFact}
      </div>
    </div>
  );
}
