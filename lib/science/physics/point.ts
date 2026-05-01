export class Point {
  constructor(public readonly x: number, public readonly y: number) {}

  add(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  sub(p: Point): Point {
    return new Point(this.x - p.x, this.y - p.y);
  }

  distanceTo(p: Point): number {
    const dx = this.x - p.x;
    const dy = this.y - p.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
