import { describe, it, expect } from 'vitest';
import { shuffle, scoreFor, pickDistractors } from './game';
import type { VikingThing } from './types';

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const result = shuffle([1, 2, 3, 4, 5]);
    expect(result).toHaveLength(5);
  });

  it('contains the same elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle([...input]);
    expect(result.sort()).toEqual(input.sort());
  });

  it('does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5];
    const snapshot = [...input];
    shuffle(input);
    expect(input).toEqual(snapshot);
  });

  it('produces a deterministic order when given a seeded rng', () => {
    // rng returns 0, then 0.5, then 0.9, then 0 — repeating
    const seq = [0, 0.5, 0.9, 0];
    let i = 0;
    const rng = () => seq[i++ % seq.length];
    const a = shuffle([1, 2, 3, 4], rng);
    i = 0;
    const b = shuffle([1, 2, 3, 4], rng);
    expect(a).toEqual(b);
  });
});

describe('scoreFor', () => {
  it('returns 100 for attempt 1', () => {
    expect(scoreFor(1)).toBe(100);
  });
  it('returns 50 for attempt 2', () => {
    expect(scoreFor(2)).toBe(50);
  });
  it('returns 25 for attempt 3', () => {
    expect(scoreFor(3)).toBe(25);
  });
});

function make(id: string, category: string): VikingThing {
  return { id, name: id, image: `${id}.svg`, category };
}

describe('pickDistractors', () => {
  const pool: VikingThing[] = [
    make('longship', 'ship'),
    make('knarr', 'ship'),
    make('drakkar', 'ship'),
    make('faering', 'ship'),
    make('ulfberht', 'weapon'),
    make('axe', 'weapon'),
    make('spear', 'weapon'),
    make('helmet', 'armor'),
  ];
  const answer = pool[0]; // longship / ship

  it('returns exactly optionCount - 1 distractors', () => {
    const result = pickDistractors(answer, pool, 4);
    expect(result).toHaveLength(3);
  });

  it('never includes the answer', () => {
    const result = pickDistractors(answer, pool, 4);
    expect(result.some((d) => d.id === answer.id)).toBe(false);
  });

  it('prefers same-category entries when pool is large enough', () => {
    const result = pickDistractors(answer, pool, 4);
    expect(result.every((d) => d.category === 'ship')).toBe(true);
  });

  it('falls back to other categories when same-category pool is too small', () => {
    const smallAnswer = make('helmet', 'armor');
    const smallPool = [smallAnswer, ...pool.filter((p) => p.category !== 'armor')];
    const result = pickDistractors(smallAnswer, smallPool, 4);
    expect(result).toHaveLength(3);
    expect(result.some((d) => d.id === smallAnswer.id)).toBe(false);
  });

  it('returns no duplicates', () => {
    const result = pickDistractors(answer, pool, 4);
    const ids = result.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
