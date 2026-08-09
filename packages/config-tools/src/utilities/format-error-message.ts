/**
 * Format an unknown error value into a human-readable message.
 *
 * @param error - The error to format.
 * @returns A formatted error message string.
 */
export function formatErrorMessage(error: unknown): string {
  if (error == null) {
    return "Unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    const message =
      error.stack || error.message || error.name || "Unknown error";

    if (error.cause) {
      return `${message}\nCause: ${formatErrorMessage(error.cause)}`;
    }

    return message;
  }

  if (
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    const stack =
      "stack" in error && typeof error.stack === "string" ? error.stack : "";
    return stack ? `${error.message}\n${stack}` : error.message;
  }

  try {
    return JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
  } catch {
    return String(error);
  }
}
