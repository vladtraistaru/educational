import { randInt, shuffle } from '@/lib/math/random';
import type { Language } from '@/lib/language-config';

export type MinuteStep = 60 | 30 | 15 | 5;

export interface ClockTime {
  hours: number;
  minutes: number;
}

export type ExerciseKind =
  | 'analog_to_digital'
  | 'digital_to_analog'
  | 'set_clock'
  | 'duration'
  | 'before_after';

export const LEVEL_STEPS: MinuteStep[] = [60, 30, 15, 5];

export function isValidTime(t: ClockTime, step: MinuteStep): boolean {
  if (t.minutes < 0 || t.minutes > 59 || t.hours < 0 || t.hours > 23) return false;
  return t.minutes % step === 0;
}

export function snapMinutes(value: number, step: MinuteStep): number {
  const s = Math.round(value / step) * step;
  const m = ((s % 60) + 60) % 60;
  return m;
}

export function snapClockTime(t: ClockTime, step: MinuteStep): ClockTime {
  return { hours: t.hours, minutes: snapMinutes(t.minutes, step) };
}

export function anglesFromTime(t: ClockTime): { hourDeg: number; minuteDeg: number } {
  const h12 = t.hours % 12;
  const minuteDeg = t.minutes * 6;
  const hourDeg = h12 * 30 + t.minutes * 0.5;
  return { hourDeg, minuteDeg };
}

export function minutesFromAngleDeg(angleDeg: number, step: MinuteStep): number {
  let a = angleDeg % 360;
  if (a < 0) a += 360;
  const raw = (a / 360) * 60;
  return snapMinutes(raw, step);
}

export function timeFromHourHandAngle(angleDeg: number, current: ClockTime): ClockTime {
  let a = angleDeg % 360;
  if (a < 0) a += 360;
  const pos = Math.round(a / 30) % 12;
  const h12 = pos === 0 ? 12 : pos;
  const isPm = current.hours >= 12;
  const newHours = isPm
    ? h12 === 12
      ? 12
      : h12 + 12
    : h12 === 12
      ? 0
      : h12;
  return { hours: newHours, minutes: current.minutes };
}

export function formatDigitalTime(t: ClockTime, lang: Language): string {
  if (lang === 'fr') {
    return `${String(t.hours).padStart(2, '0')}h${String(t.minutes).padStart(2, '0')}`;
  }
  const h12 = t.hours % 12 || 12;
  const am = t.hours < 12;
  return `${h12}:${String(t.minutes).padStart(2, '0')} ${am ? 'AM' : 'PM'}`;
}

function randomValidTime(step: MinuteStep): ClockTime {
  const hours = randInt(0, 23);
  const maxTick = Math.floor(59 / step);
  const tick = randInt(0, maxTick);
  const minutes = tick * step;
  return { hours, minutes };
}

export function timeKey(t: ClockTime): string {
  return `${t.hours}:${t.minutes}`;
}

function addMinutes(t: ClockTime, delta: number): ClockTime {
  let total = t.hours * 60 + t.minutes + delta;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return { hours: Math.floor(total / 60), minutes: total % 60 };
}

function variantDistractors(correct: ClockTime, step: MinuteStep): ClockTime[] {
  const out: ClockTime[] = [];
  const push = (t: ClockTime) => {
    if (!isValidTime(t, step)) return;
    if (timeKey(t) === timeKey(correct)) return;
    if (out.some((x) => timeKey(x) === timeKey(t))) return;
    out.push(t);
  };

  push(addMinutes(correct, step));
  push(addMinutes(correct, -step));
  push(addMinutes(correct, step * 2));
  push({ hours: (correct.hours + 1) % 24, minutes: correct.minutes });
  push({ hours: (correct.hours + 23) % 24, minutes: correct.minutes });
  push({ hours: correct.hours, minutes: correct.minutes === 0 ? step : correct.minutes - step });

  let hAlt = (correct.hours + 2) % 24;
  push({ hours: hAlt, minutes: correct.minutes });

  return out;
}

function pickOptions(correct: ClockTime, step: MinuteStep, count: number): ClockTime[] {
  const seen = new Set<string>([timeKey(correct)]);
  const pool = shuffle(variantDistractors(correct, step));
  const chosen: ClockTime[] = [];
  for (const t of pool) {
    const k = timeKey(t);
    if (!seen.has(k)) {
      seen.add(k);
      chosen.push(t);
      if (chosen.length >= count - 1) break;
    }
  }
  let guard = 0;
  while (chosen.length < count - 1 && guard++ < 100) {
    const t = randomValidTime(step);
    const k = timeKey(t);
    if (!seen.has(k)) {
      seen.add(k);
      chosen.push(t);
    }
  }
  return shuffle([correct, ...chosen]);
}

export interface AnalogToDigitalQuestion {
  kind: 'analog_to_digital';
  correct: ClockTime;
  options: ClockTime[];
}

export interface DigitalToAnalogQuestion {
  kind: 'digital_to_analog';
  correct: ClockTime;
  options: ClockTime[];
}

export interface SetClockQuestion {
  kind: 'set_clock';
  target: ClockTime;
}

export interface DurationQuestion {
  kind: 'duration';
  start: ClockTime;
  end: ClockTime;
  durationMinutes: number;
  options: number[];
}

export interface BeforeAfterQuestion {
  kind: 'before_after';
  earlier: ClockTime;
  later: ClockTime;
  labelEarlier: string;
  labelLater: string;
  /** left card in UI */
  firstIsEarlier: boolean;
}

export type TimeQuestion =
  | AnalogToDigitalQuestion
  | DigitalToAnalogQuestion
  | SetClockQuestion
  | DurationQuestion
  | BeforeAfterQuestion;

export function generateAnalogToDigital(step: MinuteStep): AnalogToDigitalQuestion {
  const correct = randomValidTime(step);
  const options = pickOptions(correct, step, 4);
  return { kind: 'analog_to_digital', correct, options };
}

export function generateDigitalToAnalog(step: MinuteStep): DigitalToAnalogQuestion {
  const correct = randomValidTime(step);
  const options = pickOptions(correct, step, 4);
  return { kind: 'digital_to_analog', correct, options };
}

export function generateSetClock(step: MinuteStep): SetClockQuestion {
  let correct = randomValidTime(step);
  let guard = 0;
  while (guard++ < 50 && correct.minutes === 0 && step === 60) {
    correct = randomValidTime(step);
  }
  return { kind: 'set_clock', target: correct };
}

function durationOptions(correct: number, step: MinuteStep): number[] {
  const pool = new Set<number>([correct]);
  const deltas = [15, 30, 45, 60, 90, 120, -15, -30, -60, 45, 75];
  for (const d of deltas) {
    if (pool.size >= 4) break;
    const v = correct + d;
    if (v > 0 && v <= 24 * 60) pool.add(v);
  }
  let n = 0;
  while (pool.size < 4 && n++ < 40) {
    const v = Math.max(step, correct + randInt(-6, 6) * step);
    if (v > 0 && v <= 24 * 60) pool.add(v);
  }
  return shuffle([...pool]).slice(0, 4);
}

export function generateDuration(step: MinuteStep): DurationQuestion {
  const start = randomValidTime(step);
  const extraHours = randInt(0, 3);
  const extraTicks = randInt(1, Math.max(2, Math.floor((8 * 60) / Math.max(step, 5))));
  const durationMinutes = extraHours * 60 + extraTicks * step;
  const end = addMinutes(start, durationMinutes);
  let options = durationOptions(durationMinutes, step);
  if (!options.includes(durationMinutes)) {
    options[0] = durationMinutes;
  }
  options = shuffle([...new Set(options)]);
  let pad = 0;
  while (options.length < 4 && pad++ < 24) {
    const v = Math.max(step, durationMinutes + randInt(-3, 3) * step);
    if (!options.includes(v) && v > 0) options.push(v);
  }
  return {
    kind: 'duration',
    start,
    end,
    durationMinutes,
    options: shuffle(options).slice(0, 4),
  };
}

const EVENT_LABELS_EN: [string, string][] = [
  ['School starts', 'Recess'],
  ['Breakfast', 'Lunch'],
  ['Practice', 'Dinner'],
  ['Bus leaves', 'Arrives home'],
];

const EVENT_LABELS_FR: [string, string][] = [
  ["Début des cours", 'Récré'],
  ['Petit-déjeuner', 'Déjeuner'],
  ['Entraînement', 'Dîner'],
  ['Le bus part', 'Arrivée à la maison'],
];

export function generateBeforeAfter(step: MinuteStep, lang: Language): BeforeAfterQuestion {
  const pair =
    lang === 'fr'
      ? EVENT_LABELS_FR[randInt(0, EVENT_LABELS_FR.length - 1)]
      : EVENT_LABELS_EN[randInt(0, EVENT_LABELS_EN.length - 1)];
  let earlier: ClockTime = { hours: 9, minutes: 0 };
  let later: ClockTime = { hours: 10, minutes: 0 };
  for (let i = 0; i < 60; i++) {
    const e = randomValidTime(step);
    const startMin = e.hours * 60 + e.minutes;
    const maxTicks = Math.floor((24 * 60 - 1 - startMin) / step);
    if (maxTicks < 1) continue;
    const ticks = randInt(1, Math.min(maxTicks, 24));
    earlier = e;
    later = addMinutes(e, ticks * step);
    break;
  }
  return {
    kind: 'before_after',
    earlier,
    later,
    labelEarlier: pair[0],
    labelLater: pair[1],
    firstIsEarlier: randInt(0, 1) === 1,
  };
}

export function generateQuestion(kind: ExerciseKind, step: MinuteStep, lang: Language): TimeQuestion {
  switch (kind) {
    case 'analog_to_digital':
      return generateAnalogToDigital(step);
    case 'digital_to_analog':
      return generateDigitalToAnalog(step);
    case 'set_clock':
      return generateSetClock(step);
    case 'duration':
      return generateDuration(step);
    case 'before_after':
      return generateBeforeAfter(step, lang);
    default:
      return generateAnalogToDigital(step);
  }
}

export function timesEqual(a: ClockTime, b: ClockTime): boolean {
  return a.hours === b.hours && a.minutes === b.minutes;
}

export function formatDurationMinutes(total: number, lang: Language): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (lang === 'fr') {
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h} h`;
    return `${h} h ${m} min`;
  }
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} ${h === 1 ? 'hour' : 'hours'}`;
  return `${h} h ${m} min`;
}
