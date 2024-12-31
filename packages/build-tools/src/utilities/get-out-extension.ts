/**
 * Get the output extension for the given format and package type.
 *
 * @param format - The format of the output.
 * @param pkgType - The package type.
 * @returns The output extensions (for the js and dts output files).
 */
export function getOutExtension(
  format: string,
  pkgType?: string
): { js: string; dts: string } {
  let jsExtension = ".js";
  let dtsExtension = ".d.ts";

  if (pkgType === "module" && format === "cjs") {
    jsExtension = ".cjs";
    dtsExtension = ".d.cts";
  }
  if (pkgType !== "module" && format === "esm") {
    jsExtension = ".mjs";
    dtsExtension = ".d.mts";
  }
  if (format === "iife") {
    jsExtension = ".global.js";
  }

  return {
    js: jsExtension,
    dts: dtsExtension
  };
}
