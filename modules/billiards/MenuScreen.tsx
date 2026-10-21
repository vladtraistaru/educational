import { useLanguage } from '@/lib/language';
import translations from './translations';
import { LEVELS } from './levels';
import styles from './Activity.module.css';

interface MenuScreenProps {
  onMissions: () => void;
  onFreePlay: () => void;
}

export default function MenuScreen({ onMissions, onFreePlay }: MenuScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.menu}>
      <div className={styles.menuBalls} aria-hidden="true">
        <span className={styles.menuCue} />
        <span className={styles.menuEight}>8</span>
      </div>
      <p className={styles.bigIdea}>{t.bigIdea}</p>
      <p className={styles.menuDetail}>{t.bigIdeaDetail}</p>
      <p className={styles.howTo}>{t.howTo}</p>
      <div className={styles.menuButtons}>
        <button type="button" className={styles.startBtn} onClick={onMissions}>
          {t.missions}
        </button>
        <button type="button" className={styles.freeBtn} onClick={onFreePlay}>
          {t.freePlay}
        </button>
      </div>
      <span className={styles.menuLevels}>
        {LEVELS.length} {t.missions.toLowerCase()}
      </span>
    </div>
  );
}
