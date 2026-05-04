'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import translations from './translations';
import styles from './Activity.module.css';
import Palette from './Palette';
import CircuitCanvas from './CircuitCanvas';
import { simulate } from './simulation';
import {
  DEFAULT_CAPACITOR_UF,
  DEFAULT_RESISTOR_OHMS,
  PlacedComponent,
  Rotation,
  SimResult,
  TerminalRef,
  WireLink,
  sameTerminal,
} from './state';

const INITIAL_PLACED: PlacedComponent[] = [
  { id: 'battery', kind: 'battery', x: 400, y: 250, rotation: 0 },
];

const EMPTY_SIM_RESULT: SimResult = {
  componentCurrent: new Map(),
  wireCurrent: new Map(),
  bulbLit: new Map(),
  bulbBurnt: new Map(),
  wireReversed: new Map(),
  capacitorCharge: new Map(),
  shortCircuit: false,
};

export default function SimpleCircuits(_props: ActivityProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [placed, setPlaced] = useState<PlacedComponent[]>(INITIAL_PLACED);
  const [wires, setWires] = useState<WireLink[]>([]);
  const [pendingWireStart, setPendingWireStart] = useState<TerminalRef | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [powerOn, setPowerOn] = useState(false);
  const [simResult, setSimResult] = useState<SimResult>(EMPTY_SIM_RESULT);
  const nextId = useRef(1);
  const chargeStateRef = useRef<Map<string, number>>(new Map());
  const placedRef = useRef(placed);
  const wiresRef = useRef(wires);
  const powerOnRef = useRef(powerOn);

  useEffect(() => {
    placedRef.current = placed;
  }, [placed]);
  useEffect(() => {
    wiresRef.current = wires;
  }, [wires]);
  useEffect(() => {
    powerOnRef.current = powerOn;
  }, [powerOn]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const out = simulate({
        placed: placedRef.current,
        wires: wiresRef.current,
        powerOn: powerOnRef.current,
        chargeState: chargeStateRef.current,
        dt,
      });
      chargeStateRef.current = out.newChargeState;
      setSimResult({
        componentCurrent: out.componentCurrent,
        wireCurrent: out.wireCurrent,
        bulbLit: out.bulbLit,
        bulbBurnt: out.bulbBurnt,
        wireReversed: out.wireReversed,
        capacitorCharge: out.capacitorCharge,
        shortCircuit: out.shortCircuit,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleAddPlaced = useCallback(
    (kind: 'bulb' | 'switch' | 'resistor' | 'capacitor', x: number, y: number) => {
      const id = `${kind}-${nextId.current++}`;
      const extras =
        kind === 'switch'
          ? { closed: false }
          : kind === 'resistor'
          ? { ohms: DEFAULT_RESISTOR_OHMS }
          : kind === 'capacitor'
          ? { microFarads: DEFAULT_CAPACITOR_UF }
          : {};
      setPlaced((prev) => [...prev, { id, kind, x, y, rotation: 0, ...extras }]);
    },
    [],
  );

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

  const handleRemovePlaced = useCallback((id: string) => {
    setPlaced((prev) => prev.filter((c) => c.id !== id || c.kind === 'battery'));
    setWires((prev) =>
      prev.filter((w) => w.from.componentId !== id && w.to.componentId !== id),
    );
    chargeStateRef.current.delete(id);
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const handleSetOhms = useCallback((id: string, ohms: number) => {
    setPlaced((prev) =>
      prev.map((c) => (c.id === id && c.kind === 'resistor' ? { ...c, ohms } : c)),
    );
  }, []);

  const handleSetMicroFarads = useCallback((id: string, microFarads: number) => {
    setPlaced((prev) =>
      prev.map((c) => (c.id === id && c.kind === 'capacitor' ? { ...c, microFarads } : c)),
    );
    chargeStateRef.current.set(id, 0);
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
    setPowerOn(false);
    chargeStateRef.current = new Map();
    nextId.current = 1;
  }, []);

  const handleTogglePower = useCallback(() => setPowerOn((p) => !p), []);

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
          labels={{
            paletteTitle: t.paletteTitle,
            bulb: t.bulb,
            switchLabel: t.switchLabel,
            resistor: t.resistor,
            capacitor: t.capacitor,
          }}
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
            onSetOhms={handleSetOhms}
            onSetMicroFarads={handleSetMicroFarads}
            onRemovePlaced={handleRemovePlaced}
            onWireClick={handleWireClick}
            onCanvasClick={handleCanvasClick}
          />
          <div className={styles.toolbar}>
            <button
              type="button"
              role="switch"
              aria-checked={powerOn}
              aria-label={t.powerLabel}
              className={`${styles.powerToggle} ${powerOn ? styles.powerToggleOn : ''}`}
              onClick={handleTogglePower}
            >
              <span
                className={`${styles.powerToggleText} ${powerOn ? styles.powerToggleTextOn : styles.powerToggleTextOff}`}
              >
                {powerOn ? t.powerStateOn : t.powerStateOff}
              </span>
              <span className={styles.powerKnob}>⏻</span>
            </button>
            <button className={`${shared.btn} ${shared.btnSecondary}`} onClick={handleReset}>
              {t.resetButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
