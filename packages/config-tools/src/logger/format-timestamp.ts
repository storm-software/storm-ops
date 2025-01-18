/**
 * Format a timestamp to a human-readable string.
 *
 * @param date The date to format.
 * @returns The formatted timestamp.
 */
export const formatTimestamp = (date = new Date()): string => {
  return date.toLocaleTimeString();
};
