export function digitalRoot(n: number): number {
  let sum = n;
  while (sum >= 10) {
    sum = String(sum)
      .split('')
      .reduce((a, d) => a + Number(d), 0);
  }
  return sum;
}

export function gcd(a: number, b: number): number {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}
