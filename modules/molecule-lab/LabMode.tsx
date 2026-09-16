import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/language';
import type { CompositionDiff } from '@/lib/science/chemistry';
import HintMessage from './HintMessage';
import LabBook from './LabBook';
import { closestHint, findMolecule } from './lab';
import { getMolecule } from './molecules';
import ResultCard from './ResultCard';
import translations from './translations';
import { useBowl } from './useBowl';
import Workbench from './Workbench';
import styles from './Activity.module.css';

type Feedback =
  | { kind: 'idle' }
  | { kind: 'match'; id: string; isNew: boolean }
  | { kind: 'open'; id: string }
  | { kind: 'almost'; diff: CompositionDiff }
  | { kind: 'none' };

interface LabModeProps {
  discovered: Set<string>;
  onDiscover: (id: string) => void;
}

export default function LabMode({ discovered, onDiscover }: LabModeProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const bowl = useBowl();
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'idle' });
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedback.kind === 'idle') return;
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [feedback]);

  const handleCombine = () => {
    const atoms = bowl.atoms;
    setFeedback({ kind: 'idle' });
    bowl.shakeThen(() => {
      const molecule = findMolecule(atoms);
      if (molecule) {
        setFeedback({ kind: 'match', id: molecule.id, isNew: !discovered.has(molecule.id) });
        onDiscover(molecule.id);
        bowl.clear();
        return;
      }
      const diff = closestHint(atoms);
      setFeedback(diff ? { kind: 'almost', diff } : { kind: 'none' });
    });
  };

  const handleOpen = (id: string) => setFeedback({ kind: 'open', id });

  const close = () => setFeedback({ kind: 'idle' });

  return (
    <div className={styles.mode}>
      <Workbench
        atoms={bowl.atoms}
        shake={bowl.shake}
        onAdd={bowl.add}
        onRemove={bowl.remove}
        onClear={bowl.clear}
        onCombine={handleCombine}
      />

      <div ref={resultRef} className={styles.feedbackArea}>
        {feedback.kind === 'match' && (
          <ResultCard molecule={getMolecule(feedback.id)} isNew={feedback.isNew} onClose={close} />
        )}
        {feedback.kind === 'open' && <ResultCard molecule={getMolecule(feedback.id)} onClose={close} />}
        {feedback.kind === 'almost' && <HintMessage title={`🤏 ${t.almost}`} diff={feedback.diff} />}
        {feedback.kind === 'none' && (
          <div className={styles.hint}>
            <p className={styles.hintTitle}>🤔 {t.noMatch}</p>
            <p className={styles.tip}>{t.handsTip}</p>
          </div>
        )}
      </div>

      <LabBook discovered={discovered} onOpen={handleOpen} />
    </div>
  );
}
