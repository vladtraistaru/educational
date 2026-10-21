import { POCKETS, TABLE_H, TABLE_W, type Ball, type Vec, type World } from './physics';
import type { Guide, Shot } from './aim';

export const RAIL = 44;
export const CANVAS_W = TABLE_W + RAIL * 2;
export const CANVAS_H = TABLE_H + RAIL * 2;

export interface Scene {
  world: World;
  trails: Map<string, Vec[]>;
  aim: { cue: Ball; shot: Shot; guide: Guide | null } | null;
}

export function drawScene(ctx: CanvasRenderingContext2D, scene: Scene) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  drawTable(ctx);
  ctx.save();
  ctx.translate(RAIL, RAIL);
  for (const p of scene.world.posts) drawPost(ctx, p);
  drawTrails(ctx, scene);
  if (scene.aim?.guide) drawGuide(ctx, scene.aim.cue, scene.aim.guide);
  for (const b of scene.world.balls) if (!b.potted) drawBall(ctx, b);
  if (scene.aim) drawCue(ctx, scene.aim.cue, scene.aim.shot);
  ctx.restore();
  if (scene.aim) drawPower(ctx, scene.aim.shot.power);
}

function drawTable(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#7a4a24';
  roundRect(ctx, 0, 0, CANVAS_W, CANVAS_H, 26);
  ctx.fill();
  ctx.fillStyle = '#1f8a4c';
  ctx.fillRect(RAIL, RAIL, TABLE_W, TABLE_H);

  ctx.fillStyle = 'rgba(255, 244, 214, 0.75)';
  for (let i = 1; i < 8; i++) {
    if (i === 4) continue;
    const x = RAIL + (TABLE_W / 8) * i;
    dot(ctx, x, RAIL / 2, 3.5);
    dot(ctx, x, CANVAS_H - RAIL / 2, 3.5);
  }
  for (let i = 1; i < 4; i++) {
    const y = RAIL + (TABLE_H / 4) * i;
    dot(ctx, RAIL / 2, y, 3.5);
    dot(ctx, CANVAS_W - RAIL / 2, y, 3.5);
  }

  ctx.fillStyle = '#111';
  for (const p of POCKETS) dot(ctx, RAIL + p.x, RAIL + p.y, p.r);
}

function drawPost(ctx: CanvasRenderingContext2D, p: { x: number; y: number; r: number }) {
  ctx.fillStyle = '#b5793f';
  dot(ctx, p.x, p.y, p.r);
  ctx.strokeStyle = '#6d4620';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  dot(ctx, p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.35);
}

function drawTrails(ctx: CanvasRenderingContext2D, scene: Scene) {
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const b of scene.world.balls) {
    const points = scene.trails.get(b.id);
    if (!points || points.length < 2) continue;
    ctx.strokeStyle = b.kind === 'cue' ? 'rgba(255, 255, 255, 0.45)' : withAlpha(b.color, 0.5);
    polyline(ctx, points);
  }
}

function drawGuide(ctx: CanvasRenderingContext2D, cue: Ball, guide: Guide) {
  ctx.setLineDash([10, 8]);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  polyline(ctx, guide.path);
  ctx.setLineDash([]);

  const hit = guide.hit;
  if (!hit) return;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(hit.ghost.x, hit.ghost.y, cue.r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#ffd166';
  arrow(ctx, hit.object, hit.objectDir, 130);
  if (hit.cueDir) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    arrow(ctx, hit.ghost, hit.cueDir, 90);
  }
}

function drawBall(ctx: CanvasRenderingContext2D, b: Ball) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  dot(ctx, b.x + 2.5, b.y + 3, b.r);
  ctx.fillStyle = b.color;
  dot(ctx, b.x, b.y, b.r);

  if (b.kind === 'bomb') {
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 3;
    ctx.stroke();
    label(ctx, '💣', b.x, b.y, b.r * 1.1);
  } else if (b.label) {
    ctx.fillStyle = '#fff';
    dot(ctx, b.x, b.y, b.r * 0.55);
    ctx.fillStyle = '#222';
    label(ctx, b.label, b.x, b.y, b.r * 0.8);
  }
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  dot(ctx, b.x - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.3);
}

function drawCue(ctx: CanvasRenderingContext2D, cue: Ball, shot: Shot) {
  const gap = cue.r + 6 + shot.power * 90;
  const sx = cue.x - shot.dir.x * gap;
  const sy = cue.y - shot.dir.y * gap;
  const ex = sx - shot.dir.x * 380;
  const ey = sy - shot.dir.y * 380;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#d9b382';
  ctx.lineWidth = 9;
  line(ctx, sx, sy, ex, ey);
  ctx.strokeStyle = '#3d2a1a';
  ctx.lineWidth = 11;
  line(ctx, sx - shot.dir.x * 260, sy - shot.dir.y * 260, ex, ey);
  ctx.strokeStyle = '#4fa3e0';
  ctx.lineWidth = 8;
  line(ctx, sx, sy, sx - shot.dir.x * 6, sy - shot.dir.y * 6);
}

function drawPower(ctx: CanvasRenderingContext2D, power: number) {
  const w = 300;
  const x = (CANVAS_W - w) / 2;
  const y = CANVAS_H - RAIL / 2 - 7;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  roundRect(ctx, x, y, w, 14, 7);
  ctx.fill();
  ctx.fillStyle = `hsl(${120 - power * 120}, 80%, 50%)`;
  roundRect(ctx, x, y, Math.max(14, w * power), 14, 7);
  ctx.fill();
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function polyline(ctx: CanvasRenderingContext2D, points: Vec[]) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (const p of points.slice(1)) ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

function arrow(ctx: CanvasRenderingContext2D, from: Vec, dir: Vec, length: number) {
  const tx = from.x + dir.x * length;
  const ty = from.y + dir.y * length;
  line(ctx, from.x, from.y, tx, ty);
  const a = Math.atan2(dir.y, dir.x);
  for (const side of [-1, 1]) {
    line(ctx, tx, ty, tx - Math.cos(a + side * 0.5) * 12, ty - Math.sin(a + side * 0.5) * 12);
  }
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number) {
  ctx.font = `800 ${size}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + 1);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
