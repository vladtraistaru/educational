'use client';

import { useState, useCallback } from 'react';
import type { ActivityProps } from '@/lib/types';
import { getPattern } from './patterns';
import ArrayBuilder from './ArrayBuilder';
import MultiplicationGrid from './MultiplicationGrid';
import PatternPanel from './PatternPanel';
import styles from './Activity.module.css';

export default function MultiplicationPatterns(_props: ActivityProps) {
  const [factorA, setFactorA] = useState(3);
  const [factorB, setFactorB] = useState(4);
  const [activePatternId, setActivePatternId] = useState<string | null>(null);
  const [selectedTimesTable, setSelectedTimesTable] = useState(5);
  const [mirrorCell, setMirrorCell] = useState<number | undefined>(undefined);
  const [selectedChain, setSelectedChain] = useState(1);
  const [overlapA, setOverlapA] = useState(2);
  const [overlapB, setOverlapB] = useState(3);

  const handleFlip = useCallback(() => {
    setFactorA(factorB);
    setFactorB(factorA);
  }, [factorA, factorB]);

  const handleSelectPattern = useCallback((id: string | null) => {
    setActivePatternId(id);
    setMirrorCell(undefined);
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (activePatternId === 'commutativity') {
        setMirrorCell(row * 100 + col);
      }
    },
    [activePatternId],
  );

  const activePattern = activePatternId ? getPattern(activePatternId) ?? null : null;

  let selectedValue: number | undefined;
  if (activePatternId === 'times-table' || activePatternId === 'ones-digit') {
    selectedValue = selectedTimesTable;
  } else if (activePatternId === 'commutativity') {
    selectedValue = mirrorCell;
  } else if (activePatternId === 'doubling') {
    selectedValue = selectedChain;
  } else if (activePatternId === 'multiples-overlap') {
    selectedValue = overlapA * 100 + overlapB;
  }

  return (
    <div className={styles.layout}>
      <ArrayBuilder
        factorA={factorA}
        factorB={factorB}
        onChangeA={setFactorA}
        onChangeB={setFactorB}
        onFlip={handleFlip}
      />

      <div className={styles.explorerSection}>
        <PatternPanel
          activePatternId={activePatternId}
          onSelectPattern={handleSelectPattern}
          selectedTimesTable={selectedTimesTable}
          onSelectTimesTable={setSelectedTimesTable}
          selectedChain={selectedChain}
          onSelectChain={setSelectedChain}
          overlapA={overlapA}
          overlapB={overlapB}
          onSelectOverlapA={setOverlapA}
          onSelectOverlapB={setOverlapB}
        />

        <MultiplicationGrid
          activePattern={activePattern}
          selectedValue={selectedValue}
          onCellClick={handleCellClick}
        />
      </div>
    </div>
  );
}
