/**
 * function to generate a random number inclusive of min and max given
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns A random number inclusive of min and max
 */
export function randomGenerator(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
