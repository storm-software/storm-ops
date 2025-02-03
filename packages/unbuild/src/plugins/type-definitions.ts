// nx-ignore-next-line
import { relative } from "node:path";
import type { OutputBundle, Plugin } from "rollup"; // only used  for types
import { UnbuildResolvedOptions } from "../types";

/**
 * This plugin takes all entry-points from the generated bundle and creates a
 * bundled version of corresponding d.ts files.
 *
 * For example, `src/index.ts` generates two corresponding files:
 * - `dist/xyz/index.js`
 * - `dist/xyz/src/index.d.ts`
 *
 * We want a third file: `dist/index.d.ts` that re-exports from `src/index.d.ts`.
 * That way, when TSC or IDEs look for types, it will find them in the right place.
 *
 * @param projectRoot - The root of the project.
 * @returns The Rollup plugin.
 */
export function typeDefinitionsPlugin(options: UnbuildResolvedOptions): Plugin {
  return {
    name: "storm:dts-bundle",
    async generateBundle(_opts: unknown, bundle: OutputBundle): Promise<void> {
      for (const file of Object.values(bundle)) {
        if (
          file.type === "asset" ||
          !file.isEntry ||
          file.facadeModuleId == null
        ) {
          continue;
        }

        const hasDefaultExport = file.exports.includes("default");
        const entrySourceFileName = relative(
          options.projectRoot,
          file.facadeModuleId,
        );
        const entrySourceDtsName = entrySourceFileName.replace(
          /\.[cm]?[jt]sx?$/,
          "",
        );
        const dtsFileName = file.fileName.replace(/\.[cm]?js$/, ".d.ts");
        const relativeSourceDtsName = JSON.stringify("./" + entrySourceDtsName);
        const dtsFileSource = hasDefaultExport
          ? `
export * from ${relativeSourceDtsName};
export { default } from ${relativeSourceDtsName};
            `
          : `export * from ${relativeSourceDtsName};\n`;

        this.emitFile({
          type: "asset",
          fileName: dtsFileName,
          source: dtsFileSource,
        });
      }
    },
  };
}
