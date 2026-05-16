import { describe, it, expect } from 'vitest';
import {
  Point,
  bendRay,
  traceParallelBundle,
  focalLengthOf,
  bulgeFromFocalLength,
  type OpticalElement,
} from './optics';

function makeElement(
  kind: OpticalElement['kind'],
  focalLength = 100,
  pos = new Point(400, 250),
  halfHeight = 60,
): OpticalElement {
  return {
    id: 1,
    kind,
    pos,
    angle: 0,
    halfHeight,
    bulge: bulgeFromFocalLength(halfHeight, focalLength),
  };
}

describe('focalLengthOf', () => {
  it('matches the spherical sagitta formula f = (a^2 + b^2) / (4b)', () => {
    expect(focalLengthOf(80, 11)).toBeCloseTo((80 * 80 + 11 * 11) / (4 * 11));
  });

  it('round-trips with bulgeFromFocalLength', () => {
    const a = 80;
    const f = 150;
    const b = bulgeFromFocalLength(a, f);
    expect(focalLengthOf(a, b)).toBeCloseTo(f, 5);
  });

  it('shorter focal length means a fatter bulge', () => {
    const a = 80;
    expect(bulgeFromFocalLength(a, 80)).toBeGreaterThan(bulgeFromFocalLength(a, 300));
  });
});

describe('bendRay', () => {
  it('converging lens: a parallel ray exits toward the far focal point', () => {
    const el = makeElement('converging-lens', 100);
    const hit = new Point(400, 200);
    const out = bendRay(el, hit, 1, 0);
    const farF = { x: 500, y: 250 };
    const expected = { dx: farF.x - hit.x, dy: farF.y - hit.y };
    const len = Math.hypot(expected.dx, expected.dy);
    expect(out.dx).toBeCloseTo(expected.dx / len);
    expect(out.dy).toBeCloseTo(expected.dy / len);
  });

  it('converging lens: an on-axis ray continues straight', () => {
    const el = makeElement('converging-lens', 100);
    const hit = new Point(400, 250);
    const out = bendRay(el, hit, 1, 0);
    expect(out.dx).toBeCloseTo(1);
    expect(out.dy).toBeCloseTo(0);
  });

  it('diverging lens: a parallel ray exits as if from the near focal point', () => {
    const el = makeElement('diverging-lens', 100);
    const hit = new Point(400, 200);
    const out = bendRay(el, hit, 1, 0);
    const nearF = { x: 300, y: 250 };
    const expected = { dx: hit.x - nearF.x, dy: hit.y - nearF.y };
    const len = Math.hypot(expected.dx, expected.dy);
    expect(out.dx).toBeCloseTo(expected.dx / len);
    expect(out.dy).toBeCloseTo(expected.dy / len);
  });

  it('concave mirror: a parallel ray reflects toward the focal point on the source side', () => {
    const el = makeElement('concave-mirror', 100);
    const hit = new Point(400, 200);
    const out = bendRay(el, hit, 1, 0);
    const nearF = { x: 300, y: 250 };
    const expected = { dx: nearF.x - hit.x, dy: nearF.y - hit.y };
    const len = Math.hypot(expected.dx, expected.dy);
    expect(out.dx).toBeCloseTo(expected.dx / len);
    expect(out.dy).toBeCloseTo(expected.dy / len);
  });

  it('convex mirror: a parallel ray reflects as if from the virtual focal point behind', () => {
    const el = makeElement('convex-mirror', 100);
    const hit = new Point(400, 200);
    const out = bendRay(el, hit, 1, 0);
    const farF = { x: 500, y: 250 };
    const expected = { dx: hit.x - farF.x, dy: hit.y - farF.y };
    const len = Math.hypot(expected.dx, expected.dy);
    expect(out.dx).toBeCloseTo(expected.dx / len);
    expect(out.dy).toBeCloseTo(expected.dy / len);
  });
});

describe('traceParallelBundle', () => {
  it('parallel rays from a converging lens converge at the focal point on the far side', () => {
    const el = makeElement('converging-lens', 100, new Point(400, 250));
    const source = new Point(100, 250);
    const bundles = traceParallelBundle(source, 0, 5, 100, [el], 10000);
    expect(bundles).toHaveLength(5);

    const focalX = 500;
    const focalY = 250;
    for (const ray of bundles) {
      expect(ray.length).toBeGreaterThanOrEqual(2);
      const lensSeg = ray[0];
      const afterLens = ray[1];
      const dirDx = afterLens.to.x - afterLens.from.x;
      const dirDy = afterLens.to.y - afterLens.from.y;
      const len = Math.hypot(dirDx, dirDy);
      const ndx = dirDx / len;
      const ndy = dirDy / len;
      const t = (focalX - afterLens.from.x) / ndx;
      const yAtFocal = afterLens.from.y + ndy * t;
      expect(yAtFocal).toBeCloseTo(focalY, 5);
      expect(lensSeg.to.x).toBeCloseTo(400);
    }
  });

  it('parallel rays from a diverging lens appear to come from the near focal point', () => {
    const el = makeElement('diverging-lens', 100, new Point(400, 250));
    const source = new Point(100, 250);
    const bundles = traceParallelBundle(source, 0, 4, 80, [el], 10000);

    const nearFx = 300;
    const nearFy = 250;
    for (const ray of bundles) {
      const afterLens = ray[1];
      const dirDx = afterLens.to.x - afterLens.from.x;
      const dirDy = afterLens.to.y - afterLens.from.y;
      const len = Math.hypot(dirDx, dirDy);
      const ndx = dirDx / len;
      const ndy = dirDy / len;
      const t = (nearFx - afterLens.from.x) / ndx;
      const yAtNearF = afterLens.from.y + ndy * t;
      expect(yAtNearF).toBeCloseTo(nearFy, 5);
    }
  });

  it('a ray missing the element plane continues straight to the bounds', () => {
    const el: OpticalElement = {
      id: 1,
      kind: 'converging-lens',
      pos: new Point(400, 250),
      angle: 0,
      halfHeight: 10,
      bulge: 5,
    };
    const source = new Point(100, 50);
    const bundles = traceParallelBundle(source, 0, 1, 0, [el], 10000, { w: 800, h: 500 });
    expect(bundles).toHaveLength(1);
    expect(bundles[0]).toHaveLength(1);
    const seg = bundles[0][0];
    expect(seg.to.x).toBeCloseTo(800);
    expect(seg.to.y).toBeCloseTo(50);
  });
});
