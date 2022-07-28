// / <reference types="vitest" />
import { describe, expect, it } from 'vitest';
import { randomGenerator } from '../helper';

describe('randomGenerator', () => {
  it('should return a finite number ', () => {
    const min = 0;
    const max = 10;
    const result = randomGenerator(min, max);

    expect(Number.isFinite(result)).toBe(true);
  });

  it('should generate a random number between,including min and max', () => {
    const min = 0;
    const max = 10;
    const result = randomGenerator(min, max);

    expect(result).toBeLessThanOrEqual(max);
    expect(result).toBeGreaterThanOrEqual(min);
  });
});
