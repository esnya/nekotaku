export default function memory<T>(getter: () => T): () => T {
  let m: T | null = null;
  return () => {
    if (m === null) {
      m = getter();
    }
    return m;
  };
}

export function async<T>(getter: () => Promise<T>): () => Promise<T> {
  let m: T | null = null;
  return async () => {
    if (m === null) {
      m = await getter();
    }
    return m;
  };
}
