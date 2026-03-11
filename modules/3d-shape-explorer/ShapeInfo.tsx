import type { Shape3D } from './shapes';
import { useLanguage } from '@/lib/language';
import translations from './translations';
import styles from './Activity.module.css';

interface ShapeInfoProps {
  shape: Shape3D;
}

export default function ShapeInfo({ shape }: ShapeInfoProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const st = t.shapes[shape.id];

  const facesLabel =
    shape.curvedSurfaces > 0
      ? `${shape.flatFaces} ${t.flat}, ${shape.curvedSurfaces} ${t.curved}`
      : `${shape.flatFaces}`;

  return (
    <div className={styles.infoPanel}>
      <h3 className={styles.infoTitle}>{st?.name ?? shape.name}</h3>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{facesLabel}</span>
          <span className={styles.statLabel}>{t.faces}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{shape.edges}</span>
          <span className={styles.statLabel}>{t.edges}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{shape.vertices}</span>
          <span className={styles.statLabel}>{t.vertices}</span>
        </div>
      </div>

      <p className={styles.example}>{st?.example ?? shape.example}</p>
    </div>
  );
}
