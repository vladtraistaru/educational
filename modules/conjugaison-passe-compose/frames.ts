export interface FrameTemplate {
  prefix: string;
  suffix: string;
}

export function pickFrame(frames: FrameTemplate[], verbIndex: number): FrameTemplate {
  return frames[verbIndex % frames.length];
}

export function objectFor(objects: Record<string, string>, infinitive: string): string {
  return objects[infinitive] ?? '';
}
