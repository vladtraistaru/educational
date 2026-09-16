import { useLanguage } from '@/lib/language';
import { ELEMENT_ORDER, type ElementSymbol } from '@/lib/science/chemistry';
import AtomToken from './AtomToken';
import { MAX_BOWL_ATOMS } from './lab';
import translations from './translations';
import styles from './Activity.module.css';

interface WorkbenchProps {
  atoms: ElementSymbol[];
  shake: boolean;
  onAdd: (symbol: ElementSymbol) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
  onCombine: () => void;
}

export default function Workbench({ atoms, shake, onAdd, onRemove, onClear, onCombine }: WorkbenchProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const full = atoms.length >= MAX_BOWL_ATOMS;

  return (
    <div className={styles.workbench}>
      <section className={styles.shelf} aria-label={t.shelf}>
        <p className={styles.shelfLabel}>{t.shelf}</p>
        <div className={styles.shelfRow}>
          {ELEMENT_ORDER.map((symbol) => (
            <button
              key={symbol}
              type="button"
              className={styles.shelfButton}
              onClick={() => onAdd(symbol)}
              disabled={full}
              aria-label={t.elements[symbol]}
            >
              <AtomToken symbol={symbol} size="large" />
              <span className={styles.shelfName}>{t.elements[symbol]}</span>
            </button>
          ))}
        </div>
        <p className={styles.tip}>{t.handsTip}</p>
      </section>

      <section className={shake ? styles.bowlShake : styles.bowl} aria-label={t.bowl} aria-live="polite">
        <span className={styles.bowlLabel}>{t.bowl}</span>
        {atoms.length === 0 ? (
          <p className={styles.bowlEmpty}>{t.bowlEmpty}</p>
        ) : (
          <div className={styles.bowlAtoms}>
            {atoms.map((symbol, i) => (
              <button
                key={i}
                type="button"
                className={styles.bowlAtom}
                onClick={() => onRemove(i)}
                aria-label={`${t.elements[symbol]} ✕`}
              >
                <AtomToken symbol={symbol} size="small" />
              </button>
            ))}
          </div>
        )}
        <p className={styles.bowlHint}>{full ? t.bowlFull : atoms.length > 0 ? t.removeHint : ' '}</p>
      </section>

      <div className={styles.benchButtons}>
        <button type="button" className={styles.combineBtn} onClick={onCombine} disabled={atoms.length === 0}>
          ✨ {t.combine}
        </button>
        <button type="button" className={styles.clearBtn} onClick={onClear} disabled={atoms.length === 0}>
          {t.clear}
        </button>
      </div>
    </div>
  );
}
