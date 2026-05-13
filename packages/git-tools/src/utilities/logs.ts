/**
 * Formats a log message in a consistent way for Nx output.
 *
 * @param message - The message to format, including a title and body lines.
 * @returns The formatted log message as a string.
 */
export function formatNxLog(message: {
  title: string;
  bodyLines?: string[];
}): string {
  const { title, bodyLines } = message;
  return `${title}${
    bodyLines && bodyLines.length > 0
      ? `\n${bodyLines.map(line => `  ${line}`).join("\n")}`
      : ""
  }`;
}
