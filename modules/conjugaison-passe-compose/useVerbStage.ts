import { useCallback, useEffect, useRef, useState } from 'react';
import type { Pronoun, Verb } from '@/lib/linguistics/french/conjugation';
import {
  correctAuxChip,
  correctParticipeChip,
  pickAuxChips,
  pickParticipeChips,
} from './forms-pc';
import { pickSurfacePronouns } from '../conjugaison-present/pools';

export type Stage = 'aux' | 'pp' | 'done';

const SHAKE_MS = 400;
const HINT_MS = 2000;
const FLASH_MS = 1000;
const SENTENCE_HOLD_MS = 1500;

function pickPronoun(): Pronoun {
  const all = pickSurfacePronouns();
  return all[Math.floor(Math.random() * all.length)];
}

interface UseVerbStageArgs {
  verb: Verb | undefined;
  onComplete: (hadMistake: boolean) => void;
}

export interface VerbStageState {
  pronoun: Pronoun;
  stage: Stage;
  auxChips: string[];
  ppChips: string[];
  pickedAux: string | null;
  pickedPp: string | null;
  shakingAux: number | null;
  shakingPp: number | null;
  hintAuxOn: boolean;
  hintPpOn: boolean;
  flashAux: boolean;
  flashPp: boolean;
  onPickAux: (chip: string, index: number) => void;
  onPickPp: (chip: string, index: number) => void;
  reset: () => void;
}

export function useVerbStage({ verb, onComplete }: UseVerbStageArgs): VerbStageState {
  const [pronoun, setPronoun] = useState<Pronoun>('je');
  const [stage, setStage] = useState<Stage>('aux');
  const [auxChips, setAuxChips] = useState<string[]>([]);
  const [ppChips, setPpChips] = useState<string[]>([]);
  const [pickedAux, setPickedAux] = useState<string | null>(null);
  const [pickedPp, setPickedPp] = useState<string | null>(null);
  const [shakingAux, setShakingAux] = useState<number | null>(null);
  const [shakingPp, setShakingPp] = useState<number | null>(null);
  const [hintAuxOn, setHintAuxOn] = useState(false);
  const [hintPpOn, setHintPpOn] = useState(false);
  const [flashAux, setFlashAux] = useState(false);
  const [flashPp, setFlashPp] = useState(false);

  const hadMistake = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const reset = useCallback(() => {
    if (!verb) return;
    clearTimers();
    const p = pickPronoun();
    setPronoun(p);
    setStage('aux');
    setAuxChips(pickAuxChips(verb, p));
    setPpChips(pickParticipeChips(verb));
    setPickedAux(null);
    setPickedPp(null);
    setShakingAux(null);
    setShakingPp(null);
    setHintAuxOn(false);
    setHintPpOn(false);
    setFlashAux(false);
    setFlashPp(false);
    hadMistake.current = false;
  }, [verb, clearTimers]);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const flashHint = useCallback((which: 'aux' | 'pp') => {
    if (which === 'aux') setHintAuxOn(true); else setHintPpOn(true);
    const id = window.setTimeout(() => {
      if (which === 'aux') setHintAuxOn(false); else setHintPpOn(false);
    }, HINT_MS);
    timers.current.push(id);
  }, []);

  const onPickAux = useCallback((chip: string, index: number) => {
    if (!verb || stage !== 'aux') return;
    if (chip !== correctAuxChip(verb, pronoun)) {
      hadMistake.current = true;
      setShakingAux(index);
      const id = window.setTimeout(() => setShakingAux(null), SHAKE_MS);
      timers.current.push(id);
      flashHint('aux');
      return;
    }
    setPickedAux(chip);
    setFlashAux(true);
    setStage('pp');
    const id = window.setTimeout(() => setFlashAux(false), FLASH_MS);
    timers.current.push(id);
  }, [verb, stage, pronoun, flashHint]);

  const onPickPp = useCallback((chip: string, index: number) => {
    if (!verb || stage !== 'pp') return;
    if (chip !== correctParticipeChip(verb)) {
      hadMistake.current = true;
      setShakingPp(index);
      const id = window.setTimeout(() => setShakingPp(null), SHAKE_MS);
      timers.current.push(id);
      flashHint('pp');
      return;
    }
    setPickedPp(chip);
    setFlashPp(true);
    setStage('done');
    const id = window.setTimeout(() => setFlashPp(false), FLASH_MS);
    timers.current.push(id);
    const id2 = window.setTimeout(() => onComplete(hadMistake.current), SENTENCE_HOLD_MS);
    timers.current.push(id2);
  }, [verb, stage, flashHint, onComplete]);

  return {
    pronoun, stage, auxChips, ppChips,
    pickedAux, pickedPp, shakingAux, shakingPp,
    hintAuxOn, hintPpOn, flashAux, flashPp,
    onPickAux, onPickPp, reset,
  };
}
