import { useLanguage } from '@/lib/language';
import { parseFormula, totalAtoms } from '@/lib/science/chemistry';
import FormulaText from './FormulaText';
import moleculeFacts from './moleculeFacts';
import { MOLECULES } from './molecules';
import translations from './translations';
import styles from './Activity.module.css';

interface LabBookProps {
  discovered: Set<string>;
  onOpen: (id: string) => void;
}

export default function LabBook({ discovered, onOpen }: LabBookProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className={styles.labBook}>
      <h3 className={styles.labBookTitle}>
        📒 {t.labBook}
        <span className={styles.labBookCount}>
          {discovered.size} / {MOLECULES.length} {t.discovered}
        </span>
      </h3>
      <div className={styles.labBookGrid}>
        {MOLECULES.map((m) => {
          const found = discovered.has(m.id);
          if (!found) {
            return (
              <div key={m.id} className={styles.bookTileLocked}>
                <span className={styles.bookEmoji}>❓</span>
                <span className={styles.bookName}>
                  {totalAtoms(parseFormula(m.formula))} {t.atomsNeeded}
                </span>
              </div>
            );
          }
          return (
            <button key={m.id} type="button" className={styles.bookTile} onClick={() => onOpen(m.id)}>
              <span className={styles.bookEmoji}>{m.emoji}</span>
              <span className={styles.bookFormula}>
                <FormulaText formula={m.formula} />
              </span>
              <span className={styles.bookName}>{moleculeFacts[language][m.id].name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
