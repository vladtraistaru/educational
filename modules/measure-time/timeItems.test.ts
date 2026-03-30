import { describe, expect, it } from 'vitest';
import type { MinuteStep } from './timeItems';
import {
  anglesFromTime,
  formatDigitalTime,
  formatDurationMinutes,
  generateAnalogToDigital,
  generateBeforeAfter,
  generateDuration,
  generateQuestion,
  isValidTime,
  minutesFromAngleDeg,
  snapClockTime,
  snapMinutes,
  timeFromHourHandAngle,
  timesEqual,
  timeKey,
} from './timeItems';

describe('snapMinutes / snapClockTime', () => {
  it('snaps to step', () => {
    expect(snapMinutes(7, 5)).toBe(5);
    expect(snapMinutes(8, 5)).toBe(10);
    expect(snapMinutes(44, 15)).toBe(45);
  });

  it('snapClockTime keeps hours', () => {
    expect(snapClockTime({ hours: 14, minutes: 7 }, 5)).toEqual({
      hours: 14,
      minutes: 5,
    });
  });
});

describe('isValidTime', () => {
  it('accepts aligned minutes', () => {
    expect(isValidTime({ hours: 3, minutes: 30 }, 30)).toBe(true);
    expect(isValidTime({ hours: 3, minutes: 25 }, 30)).toBe(false);
  });
});

describe('anglesFromTime', () => {
  it('12:00 has minute at 0 and hour at 0', () => {
    expect(anglesFromTime({ hours: 0, minutes: 0 })).toEqual({
      hourDeg: 0,
      minuteDeg: 0,
    });
  });

  it('3:00 hour at 90', () => {
    expect(anglesFromTime({ hours: 3, minutes: 0 }).hourDeg).toBe(90);
  });
});

describe('minutesFromAngleDeg', () => {
  it('top of dial maps minutes to 0', () => {
    expect(minutesFromAngleDeg(0, 5)).toBe(0);
  });
});

describe('timeFromHourHandAngle', () => {
  it('preserves minutes and adjusts hour in PM', () => {
    const t = timeFromHourHandAngle(90, { hours: 15, minutes: 30 });
    expect(t.minutes).toBe(30);
    expect(t.hours).toBe(15);
  });
});

describe('formatDigitalTime', () => {
  it('formats EN 12h', () => {
    expect(formatDigitalTime({ hours: 13, minutes: 5 }, 'en')).toBe('1:05 PM');
  });

  it('formats FR 24h', () => {
    expect(formatDigitalTime({ hours: 9, minutes: 0 }, 'fr')).toBe('09h00');
  });
});

describe('formatDurationMinutes', () => {
  it('formats hours and minutes', () => {
    expect(formatDurationMinutes(90, 'en')).toContain('1');
    expect(formatDurationMinutes(45, 'fr')).toContain('45');
  });
});

describe('generateAnalogToDigital', () => {
  it('returns four unique options including correct', () => {
    const steps: MinuteStep[] = [60, 30, 15, 5];
    for (const step of steps) {
      for (let i = 0; i < 15; i++) {
        const q = generateAnalogToDigital(step);
        expect(q.kind).toBe('analog_to_digital');
        expect(q.options).toHaveLength(4);
        const keys = new Set(q.options.map(timeKey));
        expect(keys.size).toBe(4);
        expect(keys.has(timeKey(q.correct))).toBe(true);
        for (const opt of q.options) {
          expect(isValidTime(opt, step)).toBe(true);
        }
      }
    }
  });
});

describe('generateDuration', () => {
  it('includes exact duration in options', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateDuration(15);
      expect(q.kind).toBe('duration');
      expect(q.options).toHaveLength(4);
      expect(q.options).toContain(q.durationMinutes);
    }
  });
});

describe('generateBeforeAfter', () => {
  it('later is strictly after earlier the same day', () => {
    for (let i = 0; i < 30; i++) {
      const q = generateBeforeAfter(5, 'en');
      const e = q.earlier.hours * 60 + q.earlier.minutes;
      const l = q.later.hours * 60 + q.later.minutes;
      expect(l).toBeGreaterThan(e);
    }
  });
});

describe('generateQuestion', () => {
  it('dispatches by kind', () => {
    expect(generateQuestion('set_clock', 60, 'en').kind).toBe('set_clock');
    expect(generateQuestion('digital_to_analog', 30, 'fr').kind).toBe(
      'digital_to_analog',
    );
  });
});

describe('timesEqual', () => {
  it('compares hours and minutes', () => {
    expect(timesEqual({ hours: 1, minutes: 0 }, { hours: 1, minutes: 0 })).toBe(
      true,
    );
    expect(timesEqual({ hours: 1, minutes: 0 }, { hours: 13, minutes: 0 })).toBe(
      false,
    );
  });
});
