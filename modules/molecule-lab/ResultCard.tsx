import { useLanguage } from '@/lib/language';
import FormulaText from './FormulaText';
import MoleculeDiagram from './MoleculeDiagram';
import moleculeFacts from './moleculeFacts';
import type { Molecule } from './molecules';
import translations from './translations';
import styles from './Activity.module.css';

interface ResultCardProps {
  molecule: Molecule;
  isNew?: boolean;
  banner?: string;
  onClose?: () => void;
}

export default function ResultCard({ molecule, isNew, banner, onClose }: ResultCardProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const facts = moleculeFacts[language][molecule.id];

  return (
    <article className={styles.resultCard} aria-live="polite">
      {(banner || isNew) && (
        <p className={styles.resultBanner}>{banner ?? `🎉 ${t.newDiscovery}`}</p>
      )}
      <div className={styles.resultHeader}>
        <span className={styles.resultEmoji} aria-hidden="true">
          {molecule.emoji}
        </span>
        <div>
          <h3 className={styles.resultName}>{facts.name}</h3>
          <p className={styles.resultFormula}>
            <FormulaText formula={molecule.formula} />
          </p>
        </div>
      </div>
      <div className={styles.diagramWrap}>
        <MoleculeDiagram molecule={molecule} label={facts.name} />
      </div>
      <p className={styles.resultText}>
        <strong>🌍 {t.whereInNature}:</strong> {facts.nature}
      </p>
      <p className={styles.resultText}>
        <strong>💡 {t.funFact}:</strong> {facts.fact}
      </p>
      {onClose && (
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          {t.close}
        </button>
      )}
    </article>
  );
}
