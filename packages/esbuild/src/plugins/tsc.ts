/*-------------------------------------------------------------------

                  ⚡ Storm Software - Storm Stack

 This code was released as part of the Storm Stack project. Storm Stack
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/storm-ops
 Documentation:   https://stormsoftware.com/projects/storm-ops/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/storm-ops/license

 -------------------------------------------------------------------*/

import { hfs } from "@humanfs/node";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import { joinPathFragments } from "@nx/devkit";
import { loadStormConfig, run, writeError } from "@storm-software/config-tools";
import type * as esbuild from "esbuild";
import path from "node:path";
import { ESBuildResolvedOptions } from "../types";

/**
 * Bundle all type definitions by using the API Extractor from RushStack
 *
 * @param filename - the source d.ts to bundle
 * @param outfile - the output bundled file
 * @param externals - the list of external dependencies
 */
function bundleTypeDefinitions(
  filename: string,
  outfile: string,
  externals: string[],
  options: ESBuildResolvedOptions
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { dependencies, peerDependencies, devDependencies } = require(
    `${options.projectRoot}/package.json`
  );

  // get the list of bundled and non bundled as well as their eventual type dependencies
  const dependenciesKeys = Object.keys(dependencies ?? {}).flatMap(p => [
    p,
    getTypeDependencyPackageName(p)
  ]);
  const peerDependenciesKeys = Object.keys(peerDependencies ?? {}).flatMap(
    p => [p, getTypeDependencyPackageName(p)]
  );
  const devDependenciesKeys = Object.keys(devDependencies ?? {}).flatMap(p => [
    p,
    getTypeDependencyPackageName(p)
  ]);

  const includeDeps = devDependenciesKeys;
  const excludeDeps = new Set([
    ...dependenciesKeys,
    ...peerDependenciesKeys,
    ...externals
  ]);
  const bundledPackages = includeDeps.filter(dep => !excludeDeps.has(dep));

  // we give the config in its raw form instead of a file
  const extractorConfig = ExtractorConfig.prepare({
    configObject: {
      projectFolder: options.projectRoot,
      mainEntryPointFilePath: filename,
      bundledPackages,
      compiler: {
        tsconfigFilePath: options.tsconfig,
        overrideTsconfig: {
          compilerOptions: {
            paths: {} // bug with api extract + paths
          }
        }
      },
      dtsRollup: {
        enabled: true,
        untrimmedFilePath: path.join(options.outdir, `${outfile}.d.ts`)
      },
      tsdocMetadata: {
        enabled: false
      }
    },
    packageJsonFullPath: path.join(options.projectRoot, "package.json"),
    configObjectFullPath: undefined
  });

  // here we trigger the "command line" interface equivalent
  const extractorResult = Extractor.invoke(extractorConfig, {
    showVerboseMessages: true,
    localBuild: true
  });

  // we exit the process immediately if there were errors
  if (extractorResult.succeeded === false) {
    writeError(
      `API Extractor completed with ${extractorResult.errorCount} ${extractorResult.errorCount === 1 ? "error" : "errors"}`
    );

    throw new Error("API Extractor completed with errors");
  }
}

/**
 * Triggers the TypeScript compiler and the type bundler.
 */
export const tscPlugin: (emitTypes?: boolean) => esbuild.Plugin = (
  emitTypes?: boolean
) => ({
  name: "storm:tsc",
  setup(build) {
    const options = build.initialOptions as ESBuildResolvedOptions;

    if (emitTypes === false) {
      return; // build has opted out of emitting types
    }

    build.onStart(async () => {
      const config = await loadStormConfig();

      // we only call tsc if not in watch mode or in dev mode (they skip types)
      if (process.env.WATCH !== "true" && process.env.DEV !== "true") {
        // // --paths null basically prevents typescript from using paths from the
        // // tsconfig.json that is passed from the esbuild config. We need to do
        // // this because TS would include types from the paths into this build.
        // // but our paths, in our specific case only represent separate packages.
        // await run(
        //   config,
        //   `pnpm exec tsc --project ${options.tsconfig} --paths null`,
        //   config.workspaceRoot
        // );

        await run(
          config,
          `pnpm exec tsc --project ${options.tsconfig}`,
          options.config.workspaceRoot
        );
      }

      // we bundle types if we also bundle the entry point and it is a ts file
      if (options.bundle && options.entryPoints[0]!.endsWith(".ts")) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const sourceRoot = options.sourceRoot.replaceAll(
          options.projectRoot,
          ""
        );
        const typeOutDir = options.outdir; // type out dir
        const entryPoint = options.entryPoints[0]!.replace(
          sourceRoot,
          ""
        ).replace(/\.ts$/, "");
        const bundlePath = joinPathFragments(options.outdir, entryPoint);

        let dtsPath;
        if (
          await hfs.isFile(
            `${options.config.workspaceRoot}/${typeOutDir}/${entryPoint}.d.ts`
          )
        ) {
          dtsPath = `${options.config.workspaceRoot}/${typeOutDir}/${entryPoint}.d.ts`;
        } else if (
          await hfs.isFile(
            `${options.config.workspaceRoot}/${typeOutDir}/${entryPoint.replace(/^src\//, "")}.d.ts`
          )
        ) {
          dtsPath = `${options.config.workspaceRoot}/${typeOutDir}/${entryPoint.replace(/^src\//, "")}.d.ts`;
        }

        const ext =
          options.outExtension.dts || options.format === "esm"
            ? "d.mts"
            : "d.ts";
        if (process.env.WATCH !== "true" && process.env.DEV !== "true") {
          // we get the types generated by tsc and bundle them near the output
          bundleTypeDefinitions(
            dtsPath,
            bundlePath,
            options.external ?? [],
            options
          );

          const dtsContents = await hfs.text(`${bundlePath}.d.ts`);
          await hfs.write(`${bundlePath}.${ext}`, dtsContents!);
        } else {
          // in watch mode, it wouldn't be viable to bundle the types every time
          // we haven't built any types with tsc at this stage, but we want types
          // we link the types locally by re-exporting them from the entry point
          await hfs.write(
            `${bundlePath}.${ext}`,
            `export * from './${entryPoint}'`
          );
        }
      }
    });
  }
});

/**
 * Automatically get the type dependency package name, following the
 * DefinitelyTyped naming conventions.
 *
 * @param npmPackage - the npm package name
 * @returns the type dependency package name
 */
function getTypeDependencyPackageName(npmPackage: string) {
  if (npmPackage.startsWith("@")) {
    const [scope, name] = npmPackage.split("/");

    return `@types/${scope?.slice(1)}__${name}`;
  }
  return `@types/${npmPackage}`;
}
