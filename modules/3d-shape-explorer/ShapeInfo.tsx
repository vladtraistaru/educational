import type { Shape3D } from './shapes';
import styles from './Activity.module.css';

interface ShapeInfoProps {
  shape: Shape3D;
}

export default function ShapeInfo({ shape }: ShapeInfoProps) {
  const facesLabel =
    shape.curvedSurfaces > 0
      ? `${shape.flatFaces} flat, ${shape.curvedSurfaces} curved`
      : `${shape.flatFaces}`;

  return (
    <div className={styles.infoPanel}>
      <h3 className={styles.infoTitle}>{shape.name}</h3>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{facesLabel}</span>
          <span className={styles.statLabel}>Faces</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{shape.edges}</span>
          <span className={styles.statLabel}>Edges</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{shape.vertices}</span>
          <span className={styles.statLabel}>Vertices</span>
        </div>
      </div>

      <p className={styles.example}>{shape.example}</p>
    </div>
  );
}
