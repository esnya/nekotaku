export function align(n) {
  return Math.round(n * 2) / 2;
}

export function limit(n, max) {
  return Math.min(Math.max(n, 0), max);
}
