import { describe, expect, it } from 'vitest';
import { simulate } from './simulation';
import { DEBUG_PRESETS, Preset } from './debugPresets';

/**
 * End-to-end test: drives the REAL solver (lib/science/electricity) and the
 * wire-flow allocator together for each topology defined in `debugPresets`.
 * Catches mismatches that pure-allocator unit tests can't, e.g. issues
 * caused by the way bulbs are modeled as ideal wires in the solver.
 *
 * The same presets are rendered live in `/debug-circuits` so a regression
 * surfaces both here and visually.
 */

function runOneTick(preset: Preset) {
  return simulate({
    placed: preset.placed,
    wires: preset.wires,
    powerOn: true,
    chargeState: new Map(),
    dt: 1 / 60,
  });
}

describe('simulation end-to-end against debug presets', () => {
  for (const preset of DEBUG_PRESETS) {
    if (!preset.expectations) continue;
    describe(preset.title, () => {
      const result = runOneTick(preset);

      it('does not flag short circuit', () => {
        expect(result.shortCircuit).toBe(false);
      });

      for (const exp of preset.expectations!) {
        const wireId = exp.wireId;
        if (exp.current !== null) {
          it(`wire ${wireId} carries ≈ ${(exp.current * 1000).toFixed(1)} mA`, () => {
            const got = result.wireCurrent.get(wireId);
            expect(got, `wire ${wireId} not found`).toBeDefined();
            expect(got).toBeCloseTo(exp.current!, 3);
          });
        } else {
          it(`wire ${wireId} carries some current`, () => {
            const got = result.wireCurrent.get(wireId) ?? 0;
            expect(got).toBeGreaterThan(0.001);
          });
        }
        if (exp.reversed !== undefined) {
          it(`wire ${wireId} animates ${exp.reversed ? 'reversed' : 'in from→to direction'}`, () => {
            const i = result.wireCurrent.get(wireId) ?? 0;
            if (i < 1e-4) return;
            const got = result.wireReversed.get(wireId) ?? false;
            expect(got).toBe(exp.reversed);
          });
        }
      }
    });
  }
});
