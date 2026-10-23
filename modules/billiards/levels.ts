import { BALL_R, FRICTION, type Ball, type BallKind, type Post, type Vec, type World } from './physics';

export type BallSize = 'normal' | 'heavy' | 'light';

export interface LevelBall extends Vec {
  kind: Exclude<BallKind, 'cue'>;
  size?: BallSize;
}

export interface Level {
  id: string;
  cue: Vec;
  balls: LevelBall[];
  posts?: Post[];
  goal: number;
  par: number;
}

export const EXTRA_SHOTS = 2;

const BALL_COLORS = [
  '#f9c80e', '#1e5bc6', '#d62828', '#6a2c91', '#f77f00',
  '#2a9d4b', '#8d1b1b', '#e76fab', '#00a6a6', '#9c6644',
];

const SIZES: Record<BallSize, { r: number; mass: number; color?: string }> = {
  normal: { r: BALL_R, mass: 1 },
  heavy: { r: 19, mass: 3, color: '#7f8c8d' },
  light: { r: 9, mass: 0.25, color: '#ffe8a3' },
};

/* A triangle of balls pointing left at the apex, as in a real rack. */
export function rack(apex: Vec, rows: number): LevelBall[] {
  const gap = BALL_R * 2 + 0.5;
  const balls: LevelBall[] = [];
  for (let row = 0; row < rows; row++) {
    for (let i = 0; i <= row; i++) {
      balls.push({
        kind: 'target',
        x: apex.x + row * gap * Math.cos(Math.PI / 6),
        y: apex.y + (i - row / 2) * gap,
      });
    }
  }
  return balls;
}

export const LEVELS: Level[] = [
  { id: 'straight', cue: { x: 500, y: 400 }, balls: [{ kind: 'target', x: 500, y: 200 }], goal: 1, par: 1 },
  { id: 'stop', cue: { x: 250, y: 125 }, balls: [{ kind: 'target', x: 500, y: 250 }], goal: 1, par: 1 },
  {
    id: 'bank',
    cue: { x: 120, y: 300 },
    balls: [{ kind: 'target', x: 880, y: 120 }],
    posts: [{ x: 500, y: 218, r: 24 }],
    goal: 1,
    par: 1,
  },
  { id: 'cut', cue: { x: 220, y: 330 }, balls: [{ kind: 'target', x: 500, y: 110 }], goal: 1, par: 1 },
  {
    id: 'heavy',
    cue: { x: 300, y: 150 },
    balls: [{ kind: 'target', x: 800, y: 400, size: 'heavy' }],
    goal: 1,
    par: 1,
  },
  {
    id: 'light',
    cue: { x: 200, y: 100 },
    balls: [{ kind: 'target', x: 600, y: 300, size: 'light' }],
    goal: 1,
    par: 1,
  },
  {
    id: 'double',
    cue: { x: 300, y: 250 },
    balls: [
      { kind: 'target', x: 150, y: 125 },
      { kind: 'target', x: 850, y: 375 },
    ],
    goal: 2,
    par: 2,
  },
  {
    id: 'posts',
    cue: { x: 150, y: 250 },
    balls: [
      { kind: 'target', x: 850, y: 100 },
      { kind: 'target', x: 850, y: 400 },
    ],
    posts: [
      { x: 400, y: 150, r: 20 },
      { x: 400, y: 350, r: 20 },
      { x: 620, y: 250, r: 20 },
    ],
    goal: 2,
    par: 2,
  },
  {
    id: 'bomb',
    cue: { x: 250, y: 250 },
    balls: [
      { kind: 'target', x: 500, y: 90 },
      { kind: 'target', x: 780, y: 330 },
      { kind: 'bomb', x: 880, y: 420 },
    ],
    goal: 2,
    par: 2,
  },
  { id: 'break', cue: { x: 250, y: 250 }, balls: rack({ x: 700, y: 250 }, 3), goal: 3, par: 3 },
];

export const maxShots = (level: Level) => level.par + EXTRA_SHOTS;

export function starsFor(shots: number, par: number): number {
  return Math.max(1, 3 - Math.max(0, shots - par));
}

export function makeBall(id: string, kind: BallKind, at: Vec, index = 0, size: BallSize = 'normal'): Ball {
  const preset = SIZES[size];
  const color =
    kind === 'cue' ? '#f7f3e8' : kind === 'bomb' ? '#1f1f1f' : (preset.color ?? BALL_COLORS[index % BALL_COLORS.length]);
  return {
    id,
    kind,
    x: at.x,
    y: at.y,
    vx: 0,
    vy: 0,
    r: preset.r,
    mass: preset.mass,
    color,
    label: kind === 'target' ? String(index + 1) : undefined,
    potted: false,
  };
}

export function buildWorld(cue: Vec, balls: LevelBall[], posts: Post[] = [], friction: number = FRICTION): World {
  return {
    balls: [
      makeBall('cue', 'cue', cue),
      ...balls.map((b, i) => makeBall(`${b.kind}-${i}`, b.kind, b, i, b.size)),
    ],
    posts: posts.map((p) => ({ ...p })),
    friction,
  };
}

export const levelWorld = (level: Level) => buildWorld(level.cue, level.balls, level.posts);
