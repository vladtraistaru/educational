export type SpeciesId = 'unicorn' | 'dragon' | 'phoenix';

export interface CreatureStage {
  emoji: string;
  /** Size multiplier applied to the creature's base font size. */
  scale: number;
  /** Decorations that orbit the creature, accumulating stage by stage. */
  charms: string[];
  /** Colour of the glow behind the creature. */
  glow: string;
}

export interface CreatureSpecies {
  id: SpeciesId;
  stages: CreatureStage[];
}

export const CREATURE_SPECIES: CreatureSpecies[] = [
  {
    id: 'unicorn',
    stages: [
      { emoji: '🥚', scale: 1, charms: [], glow: '#b39ddb' },
      { emoji: '🐴', scale: 1.3, charms: ['✨'], glow: '#ce93d8' },
      { emoji: '🦄', scale: 1.7, charms: ['✨', '🌸'], glow: '#f48fb1' },
      { emoji: '🦄', scale: 2.15, charms: ['✨', '🌸', '🪽', '🪽'], glow: '#9575cd' },
      { emoji: '🦄', scale: 2.7, charms: ['✨', '🌸', '🪽', '🪽', '👑', '🌈'], glow: '#7c4dff' },
    ],
  },
  {
    id: 'dragon',
    stages: [
      { emoji: '🥚', scale: 1, charms: [], glow: '#ef9a9a' },
      { emoji: '🦎', scale: 1.3, charms: ['💨'], glow: '#ffab91' },
      { emoji: '🐲', scale: 1.7, charms: ['💨', '🔥'], glow: '#ff8a65' },
      { emoji: '🐉', scale: 2.15, charms: ['💨', '🔥', '🪨', '🔥'], glow: '#ff7043' },
      { emoji: '🐉', scale: 2.7, charms: ['💨', '🔥', '🪨', '🔥', '👑', '🌋'], glow: '#e64a19' },
    ],
  },
  {
    id: 'phoenix',
    stages: [
      { emoji: '🥚', scale: 1, charms: [], glow: '#ffe082' },
      { emoji: '🐤', scale: 1.3, charms: ['☀️'], glow: '#ffd54f' },
      { emoji: '🐦', scale: 1.7, charms: ['☀️', '🪶'], glow: '#ffca28' },
      { emoji: '🦅', scale: 2.15, charms: ['☀️', '🪶', '🔥', '🪶'], glow: '#ffb300' },
      { emoji: '🦅', scale: 2.7, charms: ['☀️', '🪶', '🔥', '🪶', '👑', '💫'], glow: '#ff8f00' },
    ],
  },
];

export function getSpecies(id: SpeciesId): CreatureSpecies {
  return CREATURE_SPECIES.find((s) => s.id === id) ?? CREATURE_SPECIES[0];
}

/** Silly accessories the creature picks up at random when it grows. */
export const QUIRKS = ['🎩', '🕶️', '🧦', '🍕', '🪄', '🎈', '🐌', '🧢'] as const;
export type Quirk = (typeof QUIRKS)[number];

export function rollQuirk(owned: Quirk[]): Quirk | null {
  const available = QUIRKS.filter((q) => !owned.includes(q));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// Correct answers needed to reach each stage index.
export const STAGE_THRESHOLDS = [0, 3, 8, 15, 25];

export function getStageIndex(correctCount: number): number {
  let stage = 0;
  for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
    if (correctCount >= STAGE_THRESHOLDS[i]) {
      stage = i;
      break;
    }
  }
  return stage;
}

export interface StageProgress {
  stage: number;
  progress: number; // 0-1 toward next stage, 1 if maxed out
  remaining: number; // correct answers still needed to grow
}

export function getStageProgress(correctCount: number): StageProgress {
  const stage = getStageIndex(correctCount);
  if (stage >= STAGE_THRESHOLDS.length - 1) {
    return { stage, progress: 1, remaining: 0 };
  }
  const prevThreshold = STAGE_THRESHOLDS[stage];
  const nextThreshold = STAGE_THRESHOLDS[stage + 1];
  const progress = (correctCount - prevThreshold) / (nextThreshold - prevThreshold);
  return { stage, progress, remaining: nextThreshold - correctCount };
}
