'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import { type Pronoun, type Verb } from '@/lib/linguistics/french/conjugation';
import translations from './translations';
import { type PoolId, ROUND_LENGTH, pickRoundVerbs, pickSurfacePronouns } from './pools';
import { SLOT_PRONOUNS, bareForm } from './forms';
import { pickChips } from './distractors';
import { buildRecapRows } from './recap';
import PoolSelector, { type PoolOption } from './PoolSelector';
import ConjugationTable from './ConjugationTable';
import ChipRow from './ChipRow';
import EndOfRoundRecap, { type RecapRow } from './EndOfRoundRecap';
import styles from './Activity.module.css';

type Screen = 'pool' | 'playing' | 'recap';

const FILL_ORDER = [1, 2, 4, 5] as const;
const INITIAL_FILLED = [true, false, false, true, false, false];

const FLASH_MS = 1000;
const SHAKE_MS = 400;
const VERB_DONE_MS = 1500;

export default function ConjugaisonPresentActivity(_props: ActivityProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [screen, setScreen] = useState<Screen>('pool');
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [verbIndex, setVerbIndex] = useState(0);
  const [surfacePronouns, setSurfacePronouns] = useState<Pronoun[]>(['je', 'tu', 'il', 'nous', 'vous', 'ils']);
  const [filledSlots, setFilledSlots] = useState<boolean[]>(INITIAL_FILLED);
  const [currentSlot, setCurrentSlot] = useState<number | null>(1);
  const [chips, setChips] = useState<string[]>([]);
  const [shakingChip, setShakingChip] = useState<number | null>(null);
  const [flashSlot, setFlashSlot] = useState<number | null>(null);
  const [trickyVerbs, setTrickyVerbs] = useState<Set<string>>(new Set());
  const [recapRows, setRecapRows] = useState<RecapRow[]>([]);

  const currentVerbHadMistake = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const startVerb = useCallback((verb: Verb) => {
    const surface = pickSurfacePronouns();
    setSurfacePronouns(surface);
    setFilledSlots(INITIAL_FILLED);
    setCurrentSlot(1);
    setChips(pickChips(verb, 1));
    setShakingChip(null);
    setFlashSlot(null);
    currentVerbHadMistake.current = false;
  }, []);

  const startRound = useCallback((pool: PoolId) => {
    clearTimers();
    const round = pickRoundVerbs(pool);
    setVerbs(round);
    setVerbIndex(0);
    setTrickyVerbs(new Set());
    startVerb(round[0]);
    setScreen('playing');
  }, [clearTimers, startVerb]);

  const finishRound = useCallback((tricky: Set<string>) => {
    setRecapRows(buildRecapRows(verbs, tricky));
    setScreen('recap');
  }, [verbs]);

  const advanceAfterVerbDone = useCallback(() => {
    const nextTricky = new Set(trickyVerbs);
    if (currentVerbHadMistake.current) {
      nextTricky.add(verbs[verbIndex].infinitive);
    }
    setTrickyVerbs(nextTricky);
    const nextIndex = verbIndex + 1;
    if (nextIndex >= verbs.length) {
      finishRound(nextTricky);
      return;
    }
    setVerbIndex(nextIndex);
    startVerb(verbs[nextIndex]);
  }, [trickyVerbs, verbs, verbIndex, finishRound, startVerb]);

  const onPickChip = useCallback((chip: string, index: number) => {
    if (currentSlot === null || flashSlot !== null) return;
    const verb = verbs[verbIndex];
    const correct = bareForm(verb, SLOT_PRONOUNS[currentSlot]);
    if (chip !== correct) {
      currentVerbHadMistake.current = true;
      setShakingChip(index);
      const id = window.setTimeout(() => setShakingChip(null), SHAKE_MS);
      timers.current.push(id);
      return;
    }
    const filledSlot = currentSlot;
    const nextFilled = filledSlots.slice();
    nextFilled[filledSlot] = true;
    setFilledSlots(nextFilled);
    setFlashSlot(filledSlot);
    setCurrentSlot(null);

    const nextSlot = FILL_ORDER.find((s) => !nextFilled[s]);
    const id = window.setTimeout(() => {
      setFlashSlot(null);
      if (nextSlot === undefined) {
        const id2 = window.setTimeout(advanceAfterVerbDone, VERB_DONE_MS);
        timers.current.push(id2);
        return;
      }
      setCurrentSlot(nextSlot);
      setChips(pickChips(verb, nextSlot));
    }, FLASH_MS);
    timers.current.push(id);
  }, [currentSlot, flashSlot, verbs, verbIndex, filledSlots, advanceAfterVerbDone]);

  const onRestart = useCallback(() => {
    clearTimers();
    setScreen('pool');
  }, [clearTimers]);

  if (screen === 'pool') {
    const pools: PoolOption<PoolId>[] = [
      { id: 'group1', label: t.pools.group1, variant: 'primary' },
      { id: 'group2', label: t.pools.group2, variant: 'secondary' },
      { id: 'irregular', label: t.pools.irregular, variant: 'danger' },
      { id: 'mix', label: t.pools.mix, variant: 'warm' },
    ];
    return (
      <div className={shared.activityArea}>
        <PoolSelector intro={t.intro} pools={pools} onPick={startRound} />
      </div>
    );
  }

  if (screen === 'recap') {
    return (
      <div className={shared.activityArea}>
        <EndOfRoundRecap
          title={t.recapTitle}
          hint={t.recapHint}
          rows={recapRows}
          restartLabel={t.restart}
          backLabel={t.back}
          onRestart={onRestart}
        />
      </div>
    );
  }

  const verb = verbs[verbIndex];
  const isVerbComplete = filledSlots.every(Boolean);

  return (
    <div className={shared.activityArea}>
      <div className={styles.progress}>{t.verbProgress(verbIndex + 1, ROUND_LENGTH)}</div>
      <ConjugationTable
        verb={verb}
        surfacePronouns={surfacePronouns}
        filledSlots={filledSlots}
        currentSlot={currentSlot}
        flashSlot={flashSlot}
      />
      {!isVerbComplete && currentSlot !== null && (
        <ChipRow
          chips={chips}
          shakingChip={shakingChip}
          disabled={flashSlot !== null}
          onPick={onPickChip}
        />
      )}
    </div>
  );
}
