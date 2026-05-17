import type { Attempt, VikingThing } from './types';

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

export function pickDistractors(
  answer: VikingThing,
  pool: VikingThing[],
  optionCount: number,
  rng: () => number = Math.random,
): VikingThing[] {
  const need = optionCount - 1;
  const others = pool.filter((p) => p.id !== answer.id);
  const sameCategory = others.filter((p) => p.category === answer.category);
  const otherCategory = others.filter((p) => p.category !== answer.category);

  const picked: VikingThing[] = [];
  const sameShuffled = shuffle(sameCategory, rng);
  for (const item of sameShuffled) {
    if (picked.length >= need) break;
    picked.push(item);
  }
  if (picked.length < need) {
    const otherShuffled = shuffle(otherCategory, rng);
    for (const item of otherShuffled) {
      if (picked.length >= need) break;
      picked.push(item);
    }
  }
  return picked;
}
