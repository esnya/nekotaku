export function snap(v: number): number {
  const l = Math.abs(v * 2 - Math.round(v * 2));
  if (l > 0.15) return v;
  return Math.round(v * 2) / 2;
}
