export type SpeciesId = 'dragon' | 'sea' | 'forest';

export interface MonsterSpecies {
  id: SpeciesId;
  stages: string[]; // emoji per stage, index 0 = egg, last = fully evolved
}

export const MONSTER_SPECIES: MonsterSpecies[] = [
  { id: 'dragon', stages: ['🥚', '🐣', '🦎', '🐲', '🐉'] },
  { id: 'sea', stages: ['🥚', '🐣', '🐠', '🐙', '🦈'] },
  { id: 'forest', stages: ['🥚', '🐣', '🦊', '🐺', '🦁'] },
];

export function getSpecies(id: SpeciesId): MonsterSpecies {
  return MONSTER_SPECIES.find((s) => s.id === id) ?? MONSTER_SPECIES[0];
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
}

export function getStageProgress(correctCount: number): StageProgress {
  const stage = getStageIndex(correctCount);
  if (stage >= STAGE_THRESHOLDS.length - 1) {
    return { stage, progress: 1 };
  }
  const prevThreshold = STAGE_THRESHOLDS[stage];
  const nextThreshold = STAGE_THRESHOLDS[stage + 1];
  const progress = (correctCount - prevThreshold) / (nextThreshold - prevThreshold);
  return { stage, progress };
}
