import { useLanguage } from '@/lib/language';
import translations from './translations';
import { LEVELS } from './levels';
import styles from './Activity.module.css';

interface MenuScreenProps {
  onStart: () => void;
}

export default function MenuScreen({ onStart }: MenuScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.menu}>
      <div className={styles.seesawIcon} aria-hidden="true">
        <span className={styles.seesawWeight}>🪨</span>
        <span className={styles.seesawBeam} />
        <span className={styles.seesawWeightSmall}>🧊</span>
      </div>
      <p className={styles.formula}>{t.bigIdea}</p>
      <p className={styles.menuDetail}>{t.bigIdeaDetail}</p>
      <button type="button" className={styles.startBtn} onClick={onStart}>
        {t.start}
      </button>
      <span className={styles.menuLevels}>
        {LEVELS.length} {t.level.toLowerCase()}s
      </span>
    </div>
  );
}
