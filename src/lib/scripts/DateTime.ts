/**
 * Function to generate a new Date object with the current UTC date and time.
 */
export function generateCurrentUTC() {
  const currentDate = new Date();
  return new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
      currentDate.getUTCHours(),
      currentDate.getUTCMinutes(),
      currentDate.getUTCSeconds(),
    ),
  );
}
