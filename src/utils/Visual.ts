export function lerp(start: number, end: number, t: number): number {
  if (t < start) {
    t = start;
  }
  if (t > end) {
    t = end;
  }
  return start * (1 - t) + end * t;
}

export function lerpColor(color1: string, color2: string, t: number): string {
  if (t < 0) {
    t = 0;
  }
  if (t > 1) {
    t = 1;
  }
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  const r = Math.round(lerp(r1, r2, t)).toString(16).padStart(2, "0");
  const g = Math.round(lerp(g1, g2, t)).toString(16).padStart(2, "0");
  const b = Math.round(lerp(b1, b2, t)).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
}
