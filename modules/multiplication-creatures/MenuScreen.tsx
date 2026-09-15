import { useLanguage } from '@/lib/language';
import translations from './translations';
import { MONSTER_SPECIES, type SpeciesId } from './monsters';
import styles from './Activity.module.css';

interface MenuScreenProps {
  onStart: (speciesId: SpeciesId) => void;
}

export default function MenuScreen({ onStart }: MenuScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.menuContainer}>
      <h3 className={styles.menuTitle}>{t.chooseMonster}</h3>
      <p className={styles.menuHint}>{t.chooseMonsterHint}</p>

      <div className={styles.speciesCards}>
        {MONSTER_SPECIES.map((species) => (
          <button
            key={species.id}
            className={styles.speciesCard}
            onClick={() => onStart(species.id)}
          >
            <span className={styles.speciesEgg}>{species.stages[0]}</span>
            <span className={styles.speciesName}>{t.species[species.id]}</span>
            <span className={styles.speciesPreview}>
              {species.stages.slice(1).join(' ')}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
