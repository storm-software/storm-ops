import { TSDownOptions, TSDownResolvedOptions } from "./types";

export function getDefaultOptions(
  config: Partial<TSDownOptions> & Pick<TSDownOptions, "projectRoot">
): TSDownOptions {
  return {
    entry: ["./src/*.ts"],
    platform: "node",
    target: "esnext",
    mode: "production",
    dts: true,
    unused: {
      level: "error",
      ignore: ["typescript"]
    },
    publint: true,
    fixedExtension: true,
    ...config
  };
}

/**
 * Convert the format option to the format used by TSDown
 *
 * @param format - The format option provided by the user
 * @returns The format used by TSDown
 */
export function toTSDownFormat(
  format: TSDownOptions["format"]
): TSDownResolvedOptions["format"] {
  if (!format || (Array.isArray(format) && format.length === 0)) {
    return ["cjs", "es"];
  } else if (format === "esm") {
    return "es";
  } else if (Array.isArray(format)) {
    return format.map(f => (f === "esm" ? "es" : f));
  }

  return format;
}
