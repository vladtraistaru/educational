'use client';

import { useCallback, useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import type { Verb } from '@/lib/linguistics/french/conjugation';
import translations from './translations';
import {
  type PoolId,
  ROUND_LENGTH,
  pickRoundVerbs,
} from '../conjugaison-present/pools';
import PoolSelector, { type PoolOption } from '../conjugaison-present/PoolSelector';
import EndOfRoundRecap, { type RecapRow } from '../conjugaison-present/EndOfRoundRecap';
import { buildRecapRows } from './recap-pc';
import { pickFrame, objectFor } from './frames';
import SentenceFrame from './SentenceFrame';
import AuxiliaryChips from './AuxiliaryChips';
import ParticipeChips from './ParticipeChips';
import AllerIntro from './AllerIntro';
import { useVerbStage } from './useVerbStage';
import styles from './Activity.module.css';

type Screen = 'pool' | 'aller-intro' | 'playing' | 'recap';

function selectRoundVerbs(pool: PoolId, allowAller: boolean): Verb[] {
  const round = pickRoundVerbs(pool);
  if (allowAller) return round;
  const filtered = round.filter((v) => v.infinitive !== 'aller');
  if (filtered.length === ROUND_LENGTH) return filtered;
  let attempt = filtered;
  for (let i = 0; i < 6; i++) {
    attempt = pickRoundVerbs(pool).filter((v) => v.infinitive !== 'aller');
    if (attempt.length === ROUND_LENGTH) return attempt;
  }
  return attempt.length > 0 ? attempt : round;
}

export default function ConjugaisonPasseComposeActivity(_props: ActivityProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [screen, setScreen] = useState<Screen>('pool');
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [verbIndex, setVerbIndex] = useState(0);
  const [trickyVerbs, setTrickyVerbs] = useState<Set<string>>(new Set());
  const [recapRows, setRecapRows] = useState<RecapRow[]>([]);
  const [hasSeenAllerIntro, setHasSeenAllerIntro] = useState(false);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  const finishRound = useCallback((tricky: Set<string>) => {
    setRecapRows(buildRecapRows(verbs, tricky));
    setRoundsPlayed((n) => n + 1);
    setScreen('recap');
  }, [verbs]);

  const onVerbComplete = useCallback((hadMistake: boolean) => {
    const nextTricky = new Set(trickyVerbs);
    if (hadMistake) nextTricky.add(verbs[verbIndex].infinitive);
    setTrickyVerbs(nextTricky);
    const next = verbIndex + 1;
    if (next >= verbs.length) {
      finishRound(nextTricky);
      return;
    }
    setVerbIndex(next);
  }, [trickyVerbs, verbs, verbIndex, finishRound]);

  const stage = useVerbStage({
    verb: screen === 'playing' ? verbs[verbIndex] : undefined,
    onComplete: onVerbComplete,
  });

  const beginPlaying = useCallback((round: Verb[]) => {
    setVerbs(round);
    setVerbIndex(0);
    setTrickyVerbs(new Set());
    setScreen('playing');
  }, []);

  const startRound = useCallback((pool: PoolId) => {
    const allowAller = roundsPlayed > 0;
    const round = selectRoundVerbs(pool, allowAller);
    const willShowAller = round.some((v) => v.infinitive === 'aller');
    if (willShowAller && !hasSeenAllerIntro) {
      setVerbs(round);
      setScreen('aller-intro');
      return;
    }
    beginPlaying(round);
  }, [roundsPlayed, hasSeenAllerIntro, beginPlaying]);

  const onAllerContinue = useCallback(() => {
    setHasSeenAllerIntro(true);
    beginPlaying(verbs);
  }, [verbs, beginPlaying]);

  const onRestart = useCallback(() => setScreen('pool'), []);

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

  if (screen === 'aller-intro') {
    return (
      <div className={shared.activityArea}>
        <AllerIntro
          badge={t.allerIntroTitle}
          body={t.allerIntroBody}
          continueLabel={t.allerContinue}
          onContinue={onAllerContinue}
        />
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
  const frame = pickFrame(t.frames, verbIndex);
  const object = objectFor(t.objects, verb.infinitive);

  return (
    <div className={shared.activityArea}>
      <div className={styles.progress}>{t.verbProgress(verbIndex + 1, ROUND_LENGTH)}</div>
      <p className={styles.prompt}>{t.prompt}</p>
      <SentenceFrame
        frame={frame}
        pronoun={stage.pronoun}
        object={object}
        pickedAux={stage.pickedAux}
        pickedPp={stage.pickedPp}
        flashAux={stage.flashAux}
        flashPp={stage.flashPp}
      />
      <AuxiliaryChips
        chips={stage.auxChips}
        shakingChip={stage.shakingAux}
        hint={stage.hintAuxOn ? t.hintAux : null}
        disabled={stage.stage !== 'aux'}
        onPick={stage.onPickAux}
      />
      <ParticipeChips
        chips={stage.ppChips}
        shakingChip={stage.shakingPp}
        hint={stage.hintPpOn ? t.hintParticipe : null}
        locked={stage.stage === 'aux'}
        disabled={stage.stage === 'done'}
        onPick={stage.onPickPp}
      />
    </div>
  );
}
