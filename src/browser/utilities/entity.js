export function align(n, step = 0.5) {
  return Math.round(n / step) * step;
}

export function limit(n, max) {
  return Math.min(Math.max(n, 0), max);
}
