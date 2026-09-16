'use client';

import { useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import translations from './translations';
import { generateScenario, isGroupingComplete, shareProblem, type Difficulty, type Scenario } from './division';
import { noun, themes } from './themes';
import ShareScene from './ShareScene';
import GroupScene from './GroupScene';
import EquationStrip from './EquationStrip';
import styles from './Activity.module.css';

type Mode = 'share' | 'group';
type Status = 'idle' | 'correct' | 'wrong';
type WrongReason = 'unequal' | 'giveMore' | 'moreBag';

const FIRST_SCENARIO: Scenario = { n: 12, divisor: 3, themeIndex: 0 };

function Tabs<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
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

export default function Activity(_props: ActivityProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [mode, setMode] = useState<Mode>('share');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [scenario, setScenario] = useState<Scenario>(FIRST_SCENARIO);
  const [status, setStatus] = useState<Status>('idle');
  const [wrongReason, setWrongReason] = useState<WrongReason>('unequal');
  const [streak, setStreak] = useState<Record<Mode, number>>({ share: 0, group: 0 });
  const [plates, setPlates] = useState<number[]>(() => Array(FIRST_SCENARIO.divisor).fill(0));
  const [groups, setGroups] = useState<number[][]>([]);
  const [selection, setSelection] = useState<number[]>([]);

  const { n, divisor } = scenario;
  const theme = themes[scenario.themeIndex];
  const pile = n - plates.reduce((a, b) => a + b, 0);
  const locked = status === 'correct';

  function load(s: Scenario) {
    setScenario(s);
    setPlates(Array(s.divisor).fill(0));
    setGroups([]);
    setSelection([]);
    setStatus('idle');
  }

  function edit() {
    if (status === 'wrong') setStatus('idle');
  }

  function addToPlate(p: number) {
    if (pile <= 0) return;
    setPlates((prev) => prev.map((c, i) => (i === p ? c + 1 : c)));
    edit();
  }

  function removeFromPlate(p: number) {
    setPlates((prev) => prev.map((c, i) => (i === p ? Math.max(0, c - 1) : c)));
    edit();
  }

  function deal() {
    if (pile < divisor) return;
    setPlates((prev) => prev.map((c) => c + 1));
    edit();
  }

  function toggleToken(token: number) {
    if (selection.includes(token)) {
      setSelection(selection.filter((i) => i !== token));
    } else if (selection.length + 1 === divisor) {
      setGroups([...groups, [...selection, token]]);
      setSelection([]);
    } else {
      setSelection([...selection, token]);
    }
    edit();
  }

  function openBag(b: number) {
    setGroups(groups.filter((_, i) => i !== b));
    edit();
  }

  function check() {
    let reason: WrongReason | null;
    if (mode === 'share') reason = shareProblem(plates, pile);
    else reason = isGroupingComplete(n - groups.length * divisor, divisor) ? null : 'moreBag';
    const ok = reason === null;
    if (reason) setWrongReason(reason);
    else setSelection([]);
    setStatus(ok ? 'correct' : 'wrong');
    setStreak((s) => ({ ...s, [mode]: ok ? s[mode] + 1 : 0 }));
  }

  const vars: Record<string, string> = { n: String(n), d: String(divisor), items: `${theme.emoji} ${noun(theme, language, n)}` };
  const template = mode === 'share' ? t.sharePrompt : t.groupPrompt;

  return (
    <div className={shared.activityArea}>
      <div className={styles.wrapper}>
        <div className={styles.topRow}>
          <Tabs value={mode} options={[['share', t.modeShare], ['group', t.modeGroup]]} onChange={(m) => { setMode(m); load(scenario); }} />
          <Tabs value={difficulty} options={[['easy', t.easy], ['harder', t.harder]]} onChange={(d) => { setDifficulty(d); load(generateScenario(d, scenario)); }} />
        </div>

        <p className={styles.streak}>
          ✓ {t.streak} {streak[mode]}
        </p>

        <p className={styles.prompt}>
          {template.split(/\{(\w+)\}/).map((part, i) => {
            if (i % 2 === 0) return part;
            return part === 'items' ? vars.items : <strong key={i}>{vars[part]}</strong>;
          })}
        </p>
        <p className={styles.hint}>{mode === 'share' ? t.shareHint : t.groupHint}</p>

        {mode === 'share' ? (
          <ShareScene plates={plates} pile={pile} emoji={theme.emoji} locked={locked} t={t} onAdd={addToPlate} onRemove={removeFromPlate} onDeal={deal} />
        ) : (
          <GroupScene n={n} groups={groups} selection={selection} emoji={theme.emoji} locked={locked} t={t} onToggle={toggleToken} onOpen={openBag} />
        )}

        <div className={styles.feedbackRow} aria-live="polite">
          {status === 'correct' && <p className={shared.feedbackCorrect}>{mode === 'share' ? t.correct : t.groupCorrect}</p>}
          {status === 'wrong' && <p className={shared.feedbackIncorrect}>{t[wrongReason]}</p>}
        </div>

        {locked && <EquationStrip n={n} divisor={divisor} remainderWord={t.remainder} />}

        <div className={`${shared.controlButtons} ${styles.actions}`}>
          <button type="button" className={`${shared.btn} ${shared.btnPrimary}`} disabled={locked} onClick={check}>
            {t.check}
          </button>
          <button type="button" className={`${shared.btn} ${shared.btnSecondary}`} onClick={() => load(generateScenario(difficulty, scenario))}>
            {t.next}
          </button>
        </div>
      </div>
    </div>
  );
}
