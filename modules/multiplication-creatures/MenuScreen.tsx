import { useLanguage } from '@/lib/language';
import translations from './translations';
import { CREATURE_SPECIES, type SpeciesId } from './creatures';
import styles from './Activity.module.css';

interface MenuScreenProps {
  onStart: (speciesId: SpeciesId) => void;
}

export default function MenuScreen({ onStart }: MenuScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.menuContainer}>
      <h3 className={styles.menuTitle}>{t.chooseCreature}</h3>
      <p className={styles.menuHint}>{t.chooseCreatureHint}</p>

      <div className={styles.speciesCards}>
        {CREATURE_SPECIES.map((species) => (
          <button
            key={species.id}
            className={styles.speciesCard}
            onClick={() => onStart(species.id)}
          >
            <span className={styles.speciesEgg}>{species.stages[0].emoji}</span>
            <span className={styles.speciesName}>{t.species[species.id]}</span>
            <span className={styles.speciesPreview} aria-hidden="true">
              {species.stages.slice(1).map((s, i) => (
                <span key={i} className={styles.previewSilhouette}>
                  {s.emoji}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
