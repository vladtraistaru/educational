'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import translations from './translations';
import styles from './Activity.module.css';
import Palette from './Palette';
import CircuitCanvas from './CircuitCanvas';
import { simulate } from './simulation';
import {
  PlacedComponent,
  Rotation,
  TerminalRef,
  WireLink,
  sameTerminal,
} from './state';

const INITIAL_PLACED: PlacedComponent[] = [
  { id: 'battery', kind: 'battery', x: 400, y: 250, rotation: 0 },
];

export default function SimpleCircuits(_props: ActivityProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [placed, setPlaced] = useState<PlacedComponent[]>(INITIAL_PLACED);
  const [wires, setWires] = useState<WireLink[]>([]);
  const [pendingWireStart, setPendingWireStart] = useState<TerminalRef | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const nextId = useRef(1);

  const simResult = useMemo(() => simulate(placed, wires), [placed, wires]);

  const handleAddPlaced = useCallback((kind: 'bulb' | 'switch', x: number, y: number) => {
    const id = `${kind}-${nextId.current++}`;
    setPlaced((prev) => [
      ...prev,
      { id, kind, x, y, rotation: 0, ...(kind === 'switch' ? { closed: false } : {}) },
    ]);
  }, []);

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const handleRotate = useCallback((id: string) => {
    setPlaced((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, rotation: ((c.rotation + 90) % 360) as Rotation } : c,
      ),
    );
  }, []);

  const handleMovePlaced = useCallback((id: string, x: number, y: number) => {
    setPlaced((prev) => prev.map((c) => (c.id === id ? { ...c, x, y } : c)));
  }, []);

  const handleSwitchToggle = useCallback((id: string) => {
    setPlaced((prev) =>
      prev.map((c) => (c.id === id && c.kind === 'switch' ? { ...c, closed: !c.closed } : c)),
    );
  }, []);

  const handleTerminalClick = useCallback((ref: TerminalRef) => {
    setPendingWireStart((prev) => {
      if (!prev) return ref;
      if (sameTerminal(prev, ref)) return null;
      const id = `w-${nextId.current++}`;
      setWires((ws) => [...ws, { id, from: prev, to: ref }]);
      return null;
    });
  }, []);

  const handleWireClick = useCallback((id: string) => {
    setWires((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const handleCanvasClick = useCallback(() => {
    setPendingWireStart(null);
    setSelectedId(null);
  }, []);

  const handleReset = useCallback(() => {
    setPlaced(INITIAL_PLACED);
    setWires([]);
    setPendingWireStart(null);
    setSelectedId(null);
    nextId.current = 1;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPendingWireStart(null);
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={shared.activityArea}>
      <p className={styles.tip}>{t.tip}</p>
      <div className={styles.workspace}>
        <Palette
          labels={{ paletteTitle: t.paletteTitle, bulb: t.bulb, switchLabel: t.switchLabel }}
        />
        <div className={styles.canvasWrap}>
          <CircuitCanvas
            placed={placed}
            wires={wires}
            pendingWireStart={pendingWireStart}
            selectedId={selectedId}
            simResult={simResult}
            onAddPlaced={handleAddPlaced}
            onMovePlaced={handleMovePlaced}
            onSelect={handleSelect}
            onRotate={handleRotate}
            onTerminalClick={handleTerminalClick}
            onSwitchToggle={handleSwitchToggle}
            onWireClick={handleWireClick}
            onCanvasClick={handleCanvasClick}
          />
          <div className={styles.toolbar}>
            <button className={`${shared.btn} ${shared.btnSecondary}`} onClick={handleReset}>
              {t.resetButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
