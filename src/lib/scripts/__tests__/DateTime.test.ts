import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateCurrentUTC } from '../DateTime';

const FIXED_SYSTEM_TIME = '2022-07-28T06:04:14.319Z';

describe('DateTime', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();

    const mockedCurrentDate = Date.parse(FIXED_SYSTEM_TIME);
    vi.setSystemTime(mockedCurrentDate);
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  it('should generate a new Date object with the current UTC date and time', () => {
    const currentDate = new Date();
    const expectedDateInUTC = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        currentDate.getUTCHours(),
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds(),
      ),
    ).valueOf();

    expect(expectedDateInUTC).toEqual(generateCurrentUTC());
  });
});
