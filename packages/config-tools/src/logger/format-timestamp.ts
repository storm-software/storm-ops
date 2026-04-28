/**
 * Format a timestamp to a human-readable string.
 *
 * @param fullDateTime Whether to include the full date and time in the formatted string (defaults to `false`, which only includes the time)
 * @param date The date to format.
 * @returns The formatted timestamp.
 */
export const formatTimestamp = (
  fullDateTime = false,
  date = new Date()
): string => {
  return fullDateTime
    ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    : `${date.toLocaleTimeString()}`;
};
