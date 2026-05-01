import { describe, it, expect } from 'vitest';
import { Circuit } from './circuit';
import { Resistor } from './resistor';
import { VoltageSource } from './source';
import { Switch } from './switch';
import { Wire } from './wire';

describe('single resistor across battery', () => {
  it('I = V / R', () => {
    const c = new Circuit();
    const a = c.node('a');
    const b = c.node('b');
    const battery = c.addComponent(new VoltageSource('v', 9, a, b));
    const r = c.addComponent(new Resistor('r', 100, a, b));
    c.solve();
    expect(r.voltage).toBe(9);
    expect(r.current).toBeCloseTo(0.09);
    expect(battery.current).toBeCloseTo(0.09);
  });
});

describe('two resistors in series', () => {
  it('combines resistance and divides voltage', () => {
    const c = new Circuit();
    const a = c.node('a');
    const mid = c.node('mid');
    const b = c.node('b');
    c.addComponent(new VoltageSource('v', 12, a, b));
    const r1 = c.addComponent(new Resistor('r1', 100, a, mid));
    const r2 = c.addComponent(new Resistor('r2', 200, mid, b));
    c.solve();
    expect(r1.current).toBeCloseTo(0.04);
    expect(r2.current).toBeCloseTo(0.04);
    expect(r1.voltage).toBeCloseTo(4);
    expect(r2.voltage).toBeCloseTo(8);
  });
});

describe('two resistors in parallel', () => {
  it('combined R and current splits inversely with resistance', () => {
    const c = new Circuit();
    const a = c.node('a');
    const b = c.node('b');
    c.addComponent(new VoltageSource('v', 6, a, b));
    const r1 = c.addComponent(new Resistor('r1', 100, a, b));
    const r2 = c.addComponent(new Resistor('r2', 300, a, b));
    c.solve();
    expect(r1.voltage).toBeCloseTo(6);
    expect(r2.voltage).toBeCloseTo(6);
    expect(r1.current).toBeCloseTo(0.06);
    expect(r2.current).toBeCloseTo(0.02);
  });
});

describe('switch', () => {
  it('open switch in series stops current', () => {
    const c = new Circuit();
    const a = c.node('a');
    const mid = c.node('mid');
    const b = c.node('b');
    c.addComponent(new VoltageSource('v', 9, a, b));
    const r = c.addComponent(new Resistor('r', 100, a, mid));
    c.addComponent(new Switch('sw', false, mid, b));
    c.solve();
    expect(r.current).toBe(0);
  });

  it('closed switch in series allows current', () => {
    const c = new Circuit();
    const a = c.node('a');
    const mid = c.node('mid');
    const b = c.node('b');
    c.addComponent(new VoltageSource('v', 9, a, b));
    const r = c.addComponent(new Resistor('r', 100, a, mid));
    c.addComponent(new Switch('sw', true, mid, b));
    c.solve();
    expect(r.current).toBeCloseTo(0.09);
  });
});

describe('wire', () => {
  it('wire merges nodes so a resistor between them carries no role', () => {
    const c = new Circuit();
    const a = c.node('a');
    const mid = c.node('mid');
    const b = c.node('b');
    c.addComponent(new VoltageSource('v', 9, a, b));
    c.addComponent(new Wire('w', a, mid));
    const r = c.addComponent(new Resistor('r', 100, mid, b));
    c.solve();
    expect(r.voltage).toBeCloseTo(9);
    expect(r.current).toBeCloseTo(0.09);
  });
});

describe('bridge topology', () => {
  it('throws because it is not series/parallel reducible', () => {
    const c = new Circuit();
    const a = c.node('a');
    const b = c.node('b');
    const top = c.node('top');
    const bot = c.node('bot');
    c.addComponent(new VoltageSource('v', 9, a, b));
    c.addComponent(new Resistor('r1', 100, a, top));
    c.addComponent(new Resistor('r2', 100, a, bot));
    c.addComponent(new Resistor('r3', 100, top, b));
    c.addComponent(new Resistor('r4', 100, bot, b));
    c.addComponent(new Resistor('r5', 100, top, bot));
    expect(() => c.solve()).toThrow(/not reducible/);
  });
});
