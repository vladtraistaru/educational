'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import translations from './translations';
import { cellName, columnLetter, generateTask, pathCells, randomScenery, sameCell, type Cell, type GridSize, type Mode, type Task } from './grid';
import CoordinateGrid, { type CellHighlight } from './CoordinateGrid';
import NameChoices from './NameChoices';
import PathPrompt from './PathPrompt';
import styles from './Activity.module.css';

type Feedback = 'idle' | 'correct' | 'wrong';

const FIRST_TASK: Task = { kind: 'find', target: { col: 3, row: 2 } };
const FIRST_SCENERY: Record<string, string> = { A4: '🌳', B1: '🏠', E5: '⛰️' };
const STEP_MS = 320;

function Tabs<T extends string | number>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className={styles.modeTabs}>
      {options.map(([key, label]) => (
        <button
          key={key}
          type="button"
          className={`${styles.modeTab} ${value === key ? styles.modeTabActive : ''}`}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function fill(template: string, vars: Record<string, string>): ReactNode[] {
  return template.split(/\{(\w+)\}/).map((part, i) => (i % 2 === 0 ? part : <strong key={i}>{vars[part]}</strong>));
}

export default function Activity(_props: ActivityProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [mode, setMode] = useState<Mode>('find');
  const [size, setSize] = useState<GridSize>(5);
  const [task, setTask] = useState<Task>(FIRST_TASK);
  const [scenery, setScenery] = useState(FIRST_SCENERY);
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [lastPick, setLastPick] = useState<string | null>(null);
  const [wrongTries, setWrongTries] = useState(0);
  const [streak, setStreak] = useState<Record<Mode, number>>({ find: 0, name: 0, path: 0 });
  const [step, setStep] = useState(0);

  const path = task.kind === 'path' ? pathCells(task.start, task.moves) : [];
  const locked = feedback === 'correct' || (task.kind === 'name' && feedback === 'wrong');

  useEffect(() => {
    if (feedback !== 'correct' || step >= path.length - 1) return;
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [feedback, step, path.length]);

  function load(nextMode: Mode, nextSize: GridSize) {
    const next = generateTask(nextMode, nextSize);
    setTask(next);
    setScenery(randomScenery(nextSize, next.kind === 'path' ? [next.start, next.target] : [next.target]));
    setFeedback('idle');
    setLastPick(null);
    setWrongTries(0);
    setStep(0);
  }

  function answer(ok: boolean, pick: string) {
    setLastPick(pick);
    setFeedback(ok ? 'correct' : 'wrong');
    if (!ok) setWrongTries((n) => n + 1);
    setStreak((s) => ({ ...s, [mode]: ok ? s[mode] + 1 : 0 }));
  }

  function clickCell(cell: Cell) {
    if (locked || task.kind === 'name') return;
    answer(sameCell(cell, task.target), cellName(cell));
  }

  const target = task.target;
  const vars = { cell: cellName(target), col: columnLetter(target.col), row: String(target.row + 1), pick: lastPick ?? '' };
  const markers = { ...scenery };
  const highlight: Record<string, CellHighlight> = {};
  if (task.kind === 'path' && wrongTries >= 2) path.slice(1).forEach((c) => (highlight[cellName(c)] = 'path'));
  if (task.kind === 'name' || feedback === 'correct') markers[vars.cell] = '💎';
  if (feedback === 'correct') highlight[vars.cell] = 'correct';
  if (feedback === 'wrong' && task.kind !== 'name' && lastPick) highlight[lastPick] = 'wrong';

  let message = '';
  if (task.kind === 'find') message = feedback === 'correct' ? t.findCorrect : lastPick?.[0] === vars.col ? t.findWrongRow : t.findWrongCol;
  if (task.kind === 'name') message = feedback === 'correct' ? t.nameCorrect : t.nameWrong;
  if (task.kind === 'path') message = feedback === 'correct' ? t.pathCorrect : wrongTries >= 2 ? t.pathShown : t.pathWrong;

  return (
    <div className={shared.activityArea}>
      <div className={styles.wrapper}>
        <div className={styles.topRow}>
          <Tabs
            value={mode}
            options={[['find', t.modeFind], ['name', t.modeName], ['path', t.modePath]]}
            onChange={(m) => { setMode(m); load(m, size); }}
          />
          <Tabs
            value={size}
            options={[[5, t.small], [8, t.large]]}
            onChange={(s) => { setSize(s); load(mode, s); }}
          />
        </div>

        <p className={styles.streak}>✓ {streak[mode]} {t.streak}</p>

        <p className={styles.prompt}>
          {task.kind === 'find' && fill(t.findPrompt, vars)}
          {task.kind === 'name' && t.namePrompt}
          {task.kind === 'path' && t.pathPrompt}
        </p>
        {task.kind === 'path' && <PathPrompt moves={task.moves} words={t} />}

        <CoordinateGrid
          size={size}
          label={t.mapLabel}
          markers={markers}
          highlight={highlight}
          pulse={task.kind === 'name' && feedback === 'wrong' ? target : undefined}
          pirate={task.kind === 'path' ? path[step] : undefined}
          readOnly={locked || task.kind === 'name'}
          onCellClick={clickCell}
        />

        {task.kind === 'name' && (
          <NameChoices
            choices={task.choices}
            answer={vars.cell}
            picked={feedback === 'idle' ? null : lastPick}
            onPick={(choice) => answer(choice === vars.cell, choice)}
          />
        )}

        <div className={styles.feedbackRow} aria-live="polite">
          {feedback === 'idle' && <p className={styles.hint}>{t.hint}</p>}
          {feedback !== 'idle' && (
            <p className={feedback === 'correct' ? shared.feedbackCorrect : shared.feedbackIncorrect}>{fill(message, vars)}</p>
          )}
        </div>

        <div className={`${shared.controlButtons} ${styles.actions}`}>
          <button type="button" className={`${shared.btn} ${shared.btnSecondary}`} onClick={() => load(mode, size)}>
            {t.next}
          </button>
        </div>
      </div>
    </div>
  );
}
