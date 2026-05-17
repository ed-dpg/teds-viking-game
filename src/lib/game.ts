import type { Attempt } from './types';

export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function scoreFor(attempt: Attempt): number {
  return { 1: 100, 2: 50, 3: 25 }[attempt];
}
