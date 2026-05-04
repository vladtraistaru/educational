'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { simulate } from '@/modules/simple-circuits/simulation';
import { DEBUG_PRESETS, Preset } from '@/modules/simple-circuits/debugPresets';
import { PlacedComponent, SimResult, WireLink } from '@/modules/simple-circuits/state';

const CircuitCanvas = dynamic(() => import('@/modules/simple-circuits/CircuitCanvas'), {
  ssr: false,
});

const EMPTY_SIM: SimResult = {
  componentCurrent: new Map(),
  wireCurrent: new Map(),
  bulbLit: new Map(),
  bulbBurnt: new Map(),
  wireReversed: new Map(),
  capacitorCharge: new Map(),
  shortCircuit: false,
};

const TOLERANCE_A = 1e-3;

export default function DebugCircuits() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [placed, setPlaced] = useState<PlacedComponent[]>(DEBUG_PRESETS[0].placed);
  const [wires, setWires] = useState<WireLink[]>(DEBUG_PRESETS[0].wires);
  const [powerOn, setPowerOn] = useState(true);
  const [simResult, setSimResult] = useState<SimResult>(EMPTY_SIM);

  const placedRef = useRef(placed);
  const wiresRef = useRef(wires);
  const powerRef = useRef(powerOn);
  const chargeStateRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    placedRef.current = placed;
  }, [placed]);
  useEffect(() => {
    wiresRef.current = wires;
  }, [wires]);
  useEffect(() => {
    powerRef.current = powerOn;
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
        powerOn: powerRef.current,
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

  const loadPreset = (i: number) => {
    setPresetIdx(i);
    setPlaced(DEBUG_PRESETS[i].placed.map((c) => ({ ...c })));
    setWires(DEBUG_PRESETS[i].wires.map((w) => ({ ...w })));
    chargeStateRef.current = new Map();
  };

  const preset = DEBUG_PRESETS[presetIdx];
  const expectations = preset.expectations ?? [];

  const noop = () => {};
  const handleSwitchToggle = (id: string) => {
    setPlaced((prev) =>
      prev.map((c) => (c.id === id && c.kind === 'switch' ? { ...c, closed: !c.closed } : c)),
    );
  };
  const handleMove = (id: string, x: number, y: number) => {
    setPlaced((prev) => prev.map((c) => (c.id === id ? { ...c, x, y } : c)));
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>Simple Circuits — debug</h1>
      <p style={{ color: '#636e72', marginTop: 0 }}>
        Each preset corresponds to a topology in <code>modules/simple-circuits/debugPresets.ts</code>{' '}
        and a test in <code>modules/simple-circuits/simulation.test.ts</code>. The right-hand
        panel shows live wire currents and a pass/fail check against the expected values.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {DEBUG_PRESETS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => loadPreset(i)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #b2bec3',
              borderRadius: 6,
              background: i === presetIdx ? '#0984e3' : '#fff',
              color: i === presetIdx ? '#fff' : '#2d3436',
              cursor: 'pointer',
              fontWeight: i === presetIdx ? 600 : 400,
            }}
          >
            {p.title}
          </button>
        ))}
        <button
          onClick={() => setPowerOn((p) => !p)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #b2bec3',
            borderRadius: 6,
            marginLeft: 'auto',
            background: powerOn ? '#00b894' : '#dfe6e9',
            color: powerOn ? '#fff' : '#2d3436',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Power: {powerOn ? 'ON' : 'OFF'}
        </button>
      </div>

      <p style={{ color: '#2d3436', marginBottom: 16 }}>{preset.description}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        <div style={{ border: '1px solid #dfe6e9', borderRadius: 8, overflow: 'hidden' }}>
          <CircuitCanvas
            placed={placed}
            wires={wires}
            pendingWireStart={null}
            selectedId={null}
            simResult={simResult}
            onAddPlaced={noop}
            onMovePlaced={handleMove}
            onSelect={noop}
            onRotate={noop}
            onTerminalClick={noop}
            onSwitchToggle={handleSwitchToggle}
            onSetOhms={noop}
            onSetMicroFarads={noop}
            onRemovePlaced={noop}
            onWireClick={noop}
            onCanvasClick={noop}
          />
        </div>

        <aside
          style={{
            border: '1px solid #dfe6e9',
            borderRadius: 8,
            padding: 12,
            background: '#f7f9fa',
            fontSize: 13,
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: 14 }}>Per-wire flow</h3>
          {simResult.shortCircuit && (
            <p style={{ color: '#d63031', fontWeight: 600 }}>⚡ short circuit detected</p>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#636e72' }}>
                <th style={{ padding: '4px 6px' }}>wire</th>
                <th style={{ padding: '4px 6px', textAlign: 'right' }}>mA</th>
                <th style={{ padding: '4px 6px', textAlign: 'center' }}>dir</th>
                <th style={{ padding: '4px 6px', textAlign: 'center' }}>✓</th>
              </tr>
            </thead>
            <tbody>
              {wires.map((w) => {
                const i = simResult.wireCurrent.get(w.id) ?? 0;
                const reversed = simResult.wireReversed.get(w.id) ?? false;
                const exp = expectations.find((e) => e.wireId === w.id);
                let status: 'pass' | 'fail' | 'na' = 'na';
                if (exp) {
                  const tol = exp.tolerance ?? TOLERANCE_A;
                  const currentOk =
                    exp.current === null ? i > tol : Math.abs(i - exp.current) < tol;
                  const dirOk =
                    exp.reversed === undefined || i < 1e-4 || reversed === exp.reversed;
                  status = currentOk && dirOk ? 'pass' : 'fail';
                }
                const fromLabel = `${w.from.componentId}.${w.from.terminal}`;
                const toLabel = `${w.to.componentId}.${w.to.terminal}`;
                return (
                  <tr
                    key={w.id}
                    style={{
                      borderTop: '1px solid #ecf0f1',
                      background: status === 'fail' ? '#ffe4e1' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '4px 6px' }}>
                      <div style={{ fontWeight: 600 }}>{w.id}</div>
                      <div style={{ fontSize: 11, color: '#636e72' }}>
                        {fromLabel} → {toLabel}
                      </div>
                    </td>
                    <td style={{ padding: '4px 6px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {(i * 1000).toFixed(1)}
                    </td>
                    <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                      {i < 1e-4 ? '·' : reversed ? '←' : '→'}
                    </td>
                    <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                      {status === 'pass' ? '✅' : status === 'fail' ? '❌' : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h3 style={{ fontSize: 14, marginTop: 16 }}>Components</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {placed.map((c) => {
                const i = simResult.componentCurrent.get(c.id) ?? 0;
                const lit = simResult.bulbLit.get(c.id);
                return (
                  <tr key={c.id} style={{ borderTop: '1px solid #ecf0f1' }}>
                    <td style={{ padding: '4px 6px' }}>
                      <div style={{ fontWeight: 600 }}>{c.id}</div>
                      <div style={{ fontSize: 11, color: '#636e72' }}>{c.kind}</div>
                    </td>
                    <td style={{ padding: '4px 6px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {(i * 1000).toFixed(1)} mA
                      {c.kind === 'bulb' && lit !== undefined && (
                        <span style={{ marginLeft: 6 }}>{lit ? '💡' : ''}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </aside>
      </div>
    </div>
  );
}
