import { describe, it, expect } from 'vitest';
import { shuffle } from './game';

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
