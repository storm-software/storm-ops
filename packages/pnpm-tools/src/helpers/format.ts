/**
 * Replaces all the prefixes in a string with an empty string.
 *
 * @param value - The string to replace the prefixes in.
 * @returns The string with all the prefixes replaced with an empty string.
 */
export function replacePrefix(value?: string) {
  return (value ?? "")
    .replaceAll(/^===/, "")
    .replaceAll(/^!==/, "")
    .replaceAll(/^==/, "")
    .replaceAll(/^!=/, "")
    .replaceAll(/^>/, "")
    .replaceAll(/^>=/, "")
    .replaceAll(/^</, "")
    .replaceAll(/^<=/, "")
    .replaceAll(/^\^/, "")
    .replaceAll(/^~/, "");
}
