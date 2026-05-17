import type { Attempt, GameConfig, Round, VikingThing } from './types';

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

function randomInRange(min: number, max: number, rng: () => number): number {
  return min + rng() * (max - min);
}

export function buildRounds(
  config: GameConfig,
  pool: VikingThing[],
  rng: () => number = Math.random,
): Round[] {
  const answerCount = Math.min(config.roundCount, pool.length);
  const answers = shuffle(pool, rng).slice(0, answerCount);

  return answers.map((answer): Round => {
    const distractors = pickDistractors(answer, pool, config.optionCount, rng);
    const options = shuffle([answer, ...distractors], rng);
    return {
      answer,
      options,
      focal: {
        x: randomInRange(25, 75, rng),
        y: randomInRange(25, 75, rng),
      },
      attempt: 1,
      picked: [],
      result: 'pending',
      pointsEarned: 0,
    };
  });
}
