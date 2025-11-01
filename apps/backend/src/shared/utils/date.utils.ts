/**
 * Creates a new Date object representing the current moment in UTC.
 * @returns {Date} A Date object set to the current UTC date and time.
 */
export function newDateUTC(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds(),
    ),
  );
}

/**
 * Creates a new Date object representing the start of the current day in UTC (00:00:00.000).
 * @returns {Date} A Date object set to the start of the current UTC day.
 */
export function newStartOfDayUTC(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0, // Set time to midnight
    ),
  );
}

/**
 * Creates a new Date object representing the very end of the current day in UTC (YYYY-MM-DD 23:59:59.999Z).
 * This is useful for range queries where you want to include the entire current day,
 * typically used with a less than or equal to operator (e.g., `date <= endOfDayUTC`).
 * @returns {Date} A Date object set to the last millisecond of the current UTC day.
 */
export function newEndOfDayUTC(): Date {
  const now = new Date(); // Current local time, components will be extracted in UTC
  // Construct a new Date object for the end of the current day in UTC
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999, // Hours, minutes, seconds, milliseconds set to the last moment of the UTC day
    ),
  );
}
