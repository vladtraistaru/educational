import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { MAX_SHOT_SPEED, cloneWorld, isMoving, step, type Ball, type Vec, type World } from './physics';
import { aimFromPointer, isShot, predictPath } from './aim';
import { CANVAS_H, CANVAS_W, RAIL, drawScene } from './draw';
import styles from './Activity.module.css';

export interface ShotResult {
  potted: Ball[];
  scratch: boolean;
}

interface TableProps {
  initial: World;
  cueSpot: Vec;
  guide: boolean;
  locked: boolean;
  label: string;
  onShotEnd: (result: ShotResult) => void;
}

const cueOf = (world: World) => world.balls.find((b) => b.kind === 'cue')!;

/* Puts a sunk cue ball back on its spot, sliding left until the spot is free. */
function respot(world: World, spot: Vec) {
  const cue = cueOf(world);
  const free = (x: number) =>
    world.balls.every((b) => b === cue || b.potted || Math.hypot(b.x - x, b.y - spot.y) > b.r + cue.r + 1) &&
    world.posts.every((p) => Math.hypot(p.x - x, p.y - spot.y) > p.r + cue.r + 1);
  let x = spot.x;
  while (!free(x) && x > cue.r * 3) x -= 4;
  Object.assign(cue, { x, y: spot.y, vx: 0, vy: 0, potted: false });
}

export default function Table({ initial, cueSpot, guide, locked, label, onShotEnd }: TableProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [world] = useState(() => cloneWorld(initial));
  const aimRef = useRef<Vec | null>(null);
  const shotRef = useRef<Ball[] | null>(null);
  const trailsRef = useRef(new Map<string, Vec[]>());
  const live = useRef({ guide, locked, cueSpot, onShotEnd });

  useEffect(() => {
    live.current = { guide, locked, cueSpot, onShotEnd };
  });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    ctx.scale(dpr, dpr);

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      if (shotRef.current) advance(dt);
      const cue = cueOf(world);
      const shot = aimRef.current && !cue.potted ? aimFromPointer(cue, aimRef.current) : null;
      drawScene(ctx, {
        world,
        trails: trailsRef.current,
        aim: shot
          ? { cue, shot, guide: live.current.guide && isShot(shot) ? predictPath(world, cue, shot.dir) : null }
          : null,
      });
      frame = requestAnimationFrame(tick);
    };

    const advance = (dt: number) => {
      shotRef.current!.push(...step(world, dt));
      for (const b of world.balls) {
        const trail = trailsRef.current.get(b.id);
        const end = trail?.[trail.length - 1];
        if (b.potted || !end || Math.hypot(b.x - end.x, b.y - end.y) < 4) continue;
        trail.push({ x: b.x, y: b.y });
      }
      if (isMoving(world)) return;
      const potted = shotRef.current!;
      shotRef.current = null;
      const scratch = potted.some((b) => b.kind === 'cue');
      if (scratch) respot(world, live.current.cueSpot);
      live.current.onShotEnd({ potted, scratch });
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [world]);

  const toTable = (e: PointerEvent<HTMLCanvasElement>): Vec => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_W - RAIL,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_H - RAIL,
    };
  };

  const handleDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (live.current.locked || shotRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    aimRef.current = toTable(e);
  };

  const handleMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (aimRef.current) aimRef.current = toTable(e);
  };

  const handleUp = () => {
    const pointer = aimRef.current;
    aimRef.current = null;
    if (!pointer || live.current.locked || shotRef.current) return;
    const cue = cueOf(world);
    const shot = aimFromPointer(cue, pointer);
    if (!isShot(shot)) return;
    cue.vx = shot.dir.x * shot.power * MAX_SHOT_SPEED;
    cue.vy = shot.dir.y * shot.power * MAX_SHOT_SPEED;
    trailsRef.current = new Map(world.balls.filter((b) => !b.potted).map((b) => [b.id, [{ x: b.x, y: b.y }]]));
    shotRef.current = [];
  };

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.table} ${locked ? styles.tableLocked : ''}`}
      role="img"
      aria-label={label}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={() => (aimRef.current = null)}
    />
  );
}
