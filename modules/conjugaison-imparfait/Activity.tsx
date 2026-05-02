'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import { type Pronoun, type Verb } from '@/lib/linguistics/french/conjugation';
import translations from './translations';
import {
  type PoolId,
  ROUND_LENGTH,
  pickRoundVerbs,
  pickSurfacePronouns,
} from '../conjugaison-present/pools';
import PoolSelector, { type PoolOption } from '../conjugaison-present/PoolSelector';
import EndOfRoundRecap, { type RecapRow } from '../conjugaison-present/EndOfRoundRecap';
import { SLOT_PRONOUNS, imparfaitEnding, pickEndingChips } from './forms-imp';
import { buildRecapRows } from './recap-imp';
import PresentRule from './PresentRule';
import EndingChips from './EndingChips';
import EndOfVerbReveal from './EndOfVerbReveal';
import QuestionLine from './QuestionLine';
import styles from './Activity.module.css';

type Screen = 'pool' | 'playing' | 'recap';

const FLASH_MS = 1000;
const SHAKE_MS = 400;
const REVEAL_MS = 1800;

function filterPoolVerbs(pool: PoolId, verbs: Verb[]): Verb[] {
  if (pool === 'group1' || pool === 'group2') {
    return verbs.filter((v) => v.infinitive !== 'être');
  }
  return verbs;
}

export default function ConjugaisonImparfaitActivity(_props: ActivityProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [screen, setScreen] = useState<Screen>('pool');
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [verbIndex, setVerbIndex] = useState(0);
  const [surfacePronouns, setSurfacePronouns] = useState<Pronoun[]>(
    ['je', 'tu', 'il', 'nous', 'vous', 'ils'],
  );
  const [pronounIndex, setPronounIndex] = useState(0);
  const [chips, setChips] = useState<string[]>([]);
  const [shakingChip, setShakingChip] = useState<number | null>(null);
  const [flashEnding, setFlashEnding] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [trickyVerbs, setTrickyVerbs] = useState<Set<string>>(new Set());
  const [recapRows, setRecapRows] = useState<RecapRow[]>([]);

  const currentVerbHadMistake = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const startVerb = useCallback(() => {
    setSurfacePronouns(pickSurfacePronouns());
    setPronounIndex(0);
    setChips(pickEndingChips(0));
    setShakingChip(null);
    setFlashEnding(null);
    setRevealing(false);
    currentVerbHadMistake.current = false;
  }, []);

  const startRound = useCallback((pool: PoolId) => {
    clearTimers();
    const round = filterPoolVerbs(pool, pickRoundVerbs(pool));
    const safeRound = round.length > 0 ? round : pickRoundVerbs(pool);
    setVerbs(safeRound);
    setVerbIndex(0);
    setTrickyVerbs(new Set());
    startVerb();
    setScreen('playing');
  }, [clearTimers, startVerb]);

  const finishRound = useCallback((tricky: Set<string>) => {
    setRecapRows(buildRecapRows(verbs, tricky));
    setScreen('recap');
  }, [verbs]);

  const advanceVerb = useCallback(() => {
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
    startVerb();
  }, [trickyVerbs, verbs, verbIndex, finishRound, startVerb]);

  const onPickEnding = useCallback((ending: string, index: number) => {
    if (flashEnding !== null || revealing) return;
    const correct = imparfaitEnding(pronounIndex);
    if (ending !== correct) {
      currentVerbHadMistake.current = true;
      setShakingChip(index);
      const id = window.setTimeout(() => setShakingChip(null), SHAKE_MS);
      timers.current.push(id);
      return;
    }
    setFlashEnding(correct);

    const id = window.setTimeout(() => {
      setFlashEnding(null);
      const nextPronoun = pronounIndex + 1;
      if (nextPronoun >= SLOT_PRONOUNS.length) {
        setRevealing(true);
        const id2 = window.setTimeout(advanceVerb, REVEAL_MS);
        timers.current.push(id2);
        return;
      }
      setPronounIndex(nextPronoun);
      setChips(pickEndingChips(nextPronoun));
    }, FLASH_MS);
    timers.current.push(id);
  }, [flashEnding, revealing, pronounIndex, advanceVerb]);

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
  const surfacePronoun = surfacePronouns[pronounIndex];

  return (
    <div className={shared.activityArea}>
      <div className={styles.progress}>{t.verbProgress(verbIndex + 1, ROUND_LENGTH)}</div>
      {revealing ? (
        <EndOfVerbReveal verb={verb} />
      ) : (
        <>
          <PresentRule verb={verb} label={t.presentLabel} etreNote={t.etreNote} />
          <p className={styles.prompt}>{t.prompt}</p>
          <QuestionLine verb={verb} pronoun={surfacePronoun} flashEnding={flashEnding} />
          <EndingChips
            chips={chips}
            shakingChip={shakingChip}
            disabled={flashEnding !== null}
            onPick={onPickEnding}
          />
        </>
      )}
    </div>
  );
}
