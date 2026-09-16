import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/language';
import { shuffle } from '@/lib/science/math/random';
import type { CompositionDiff } from '@/lib/science/chemistry';
import HintMessage from './HintMessage';
import { findMolecule, hintFor } from './lab';
import moleculeFacts from './moleculeFacts';
import { getMolecule, MOLECULES } from './molecules';
import MissionResults from './MissionResults';
import ResultCard from './ResultCard';
import translations from './translations';
import { useBowl } from './useBowl';
import Workbench from './Workbench';
import styles from './Activity.module.css';

export const MISSIONS_PER_ROUND = 8;

type Feedback =
  | { kind: 'idle' }
  | { kind: 'solved' }
  | { kind: 'other'; id: string; diff: CompositionDiff }
  | { kind: 'hint'; diff: CompositionDiff };

function newRound(): string[] {
  return shuffle(MOLECULES.map((m) => m.id)).slice(0, MISSIONS_PER_ROUND);
}

interface MissionModeProps {
  onDiscover: (id: string) => void;
}

export default function MissionMode({ onDiscover }: MissionModeProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const bowl = useBowl();
  const [missionIds, setMissionIds] = useState<string[]>(() => newRound());
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'idle' });
  const [finished, setFinished] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedback.kind === 'idle') return;
    feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [feedback]);

  const targetId = missionIds[index];
  const target = getMolecule(targetId);
  const isLast = index + 1 >= missionIds.length;

  const handleCombine = () => {
    const atoms = bowl.atoms;
    setFeedback({ kind: 'idle' });
    bowl.shakeThen(() => {
      const made = findMolecule(atoms);
      if (made) onDiscover(made.id);
      if (made?.id === targetId) {
        setSolved((s) => s + 1);
        setFeedback({ kind: 'solved' });
        bowl.clear();
      } else if (made) {
        setFeedback({ kind: 'other', id: made.id, diff: hintFor(targetId, atoms) });
      } else {
        setFeedback({ kind: 'hint', diff: hintFor(targetId, atoms) });
      }
    });
  };

  const goNext = () => {
    bowl.clear();
    setFeedback({ kind: 'idle' });
    if (isLast) setFinished(true);
    else setIndex((i) => i + 1);
  };

  const restart = () => {
    setMissionIds(newRound());
    setIndex(0);
    setSolved(0);
    setFinished(false);
  };

  if (finished) {
    return <MissionResults solved={solved} total={missionIds.length} onPlayAgain={restart} />;
  }

  const isSolved = feedback.kind === 'solved';

  return (
    <div className={styles.mode}>
      <div className={styles.missionCard}>
        <span className={styles.missionProgress}>
          {t.mission} {index + 1} {t.of} {missionIds.length} · ⭐ {solved}
        </span>
        <span className={styles.missionEmoji} aria-hidden="true">
          {target.emoji}
        </span>
        <p className={styles.missionRiddle}>“{moleculeFacts[language][targetId].riddle}”</p>
        <p className={styles.missionAsk}>{t.whoAmI}</p>
      </div>

      {isSolved ? (
        <ResultCard molecule={target} banner={`🏆 ${t.missionDone}`} />
      ) : (
        <Workbench
          atoms={bowl.atoms}
          shake={bowl.shake}
          onAdd={bowl.add}
          onRemove={bowl.remove}
          onClear={bowl.clear}
          onCombine={handleCombine}
        />
      )}

      <div ref={feedbackRef} className={styles.mode}>
        {feedback.kind === 'other' && (
          <div className={styles.hint} aria-live="polite">
            <p className={styles.hintTitle}>
              🔎 {t.otherMolecule} <strong>{moleculeFacts[language][feedback.id].name}</strong>{' '}
              {getMolecule(feedback.id).emoji} {t.otherMoleculeEnd}
            </p>
          </div>
        )}
        {(feedback.kind === 'other' || feedback.kind === 'hint') && (
          <HintMessage title={`🤏 ${t.notYet}`} diff={feedback.diff} />
        )}
      </div>

      <div className={styles.benchButtons}>
        <button type="button" className={isSolved ? styles.combineBtn : styles.clearBtn} onClick={goNext}>
          {isSolved ? (isLast ? t.finish : t.next) : t.skip} →
        </button>
      </div>
    </div>
  );
}
