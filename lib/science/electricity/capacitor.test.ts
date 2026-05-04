import { describe, it, expect } from 'vitest';
import { Capacitor } from './capacitor';
import { Circuit } from './circuit';
import { Node } from './node';
import { Resistor } from './resistor';
import { VoltageSource } from './source';

describe('Capacitor as effective resistance', () => {
  const dummy = () => ({ a: new Node('a'), b: new Node('b') });

  it('empty cap looks like a small resistor', () => {
    const { a, b } = dummy();
    const cap = new Capacitor('c', 1000, 0, a, b);
    expect(cap.resistance()).toBeCloseTo(1, 5);
  });

  it('full cap blocks current (infinite resistance)', () => {
    const { a, b } = dummy();
    const cap = new Capacitor('c', 1000, 1, a, b);
    expect(cap.resistance()).toBe(Infinity);
  });

  it('half-charged cap has finite, larger-than-empty resistance', () => {
    const { a, b } = dummy();
    const cap = new Capacitor('c', 1000, 0.5, a, b);
    const r = cap.resistance();
    expect(r).toBeGreaterThan(1);
    expect(r).toBeLessThan(Infinity);
  });
});

describe('Capacitor in a circuit with the existing solver', () => {
  it('empty cap in series with a resistor lets current flow', () => {
    const c = new Circuit();
    const a = c.node('a');
    const mid = c.node('mid');
    const b = c.node('b');
    c.addComponent(new VoltageSource('v', 5, a, b));
    const r = c.addComponent(new Resistor('r', 100, a, mid));
    const cap = c.addComponent(new Capacitor('cap', 1000, 0, mid, b));
    c.solve();
    expect(r.current).toBeGreaterThan(0);
    expect(cap.current).toBeCloseTo(r.current, 6);
  });

  it('fully-charged cap in series with a resistor blocks current', () => {
    const c = new Circuit();
    const a = c.node('a');
    const mid = c.node('mid');
    const b = c.node('b');
    c.addComponent(new VoltageSource('v', 5, a, b));
    const r = c.addComponent(new Resistor('r', 100, a, mid));
    c.addComponent(new Capacitor('cap', 1000, 1, mid, b));
    c.solve();
    expect(r.current).toBe(0);
  });
});
