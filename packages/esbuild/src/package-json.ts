import { writeJsonFile } from "@nx/devkit";
import {
  addPackageDependencies,
  addWorkspacePackageJsonFields
} from "@storm-software/build-tools";
import {
  getStopwatch,
  writeDebug
} from "@storm-software/config-tools/logger/console";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { existsSync } from "node:fs";
import hf from "node:fs/promises";
import { ESBuildContext } from "./types";

/**
 * Generate the package.json file for the project
 *
 * @param context - The build context
 * @returns The build context
 */
export async function generatePackageJson(context: ESBuildContext) {
  if (
    context.options.generatePackageJson !== false &&
    existsSync(joinPaths(context.options.projectRoot, "package.json"))
  ) {
    writeDebug("  ✍️   Writing package.json file", context.workspaceConfig);
    const stopwatch = getStopwatch("Write package.json file");

    const packageJsonPath = joinPaths(
      context.options.projectRoot,
      "project.json"
    );
    if (!existsSync(packageJsonPath)) {
      throw new Error("Cannot find package.json configuration");
    }

    const packageJsonFile = await hf.readFile(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.options.projectRoot,
        "package.json"
      ),
      "utf8"
    );
    let packageJson = JSON.parse(packageJsonFile);
    if (!packageJson) {
      throw new Error("Cannot find package.json configuration file");
    }

    packageJson = await addPackageDependencies(
      context.workspaceConfig.workspaceRoot,
      context.options.projectRoot,
      context.projectName,
      packageJson
    );

    packageJson = await addWorkspacePackageJsonFields(
      context.workspaceConfig,
      context.options.projectRoot,
      context.sourceRoot,
      context.projectName,
      false,
      packageJson
    );

    if (context.options.entry) {
      packageJson.exports ??= {};
      packageJson.exports["./package.json"] ??= "./package.json";

      const entryPoints = Array.isArray(context.options.entry)
        ? context.options.entry
        : Object.keys(context.options.entry);
      if (entryPoints.length > 0) {
        const defaultEntry = entryPoints.includes("index")
          ? `.${context.options.distDir ? `/${context.options.distDir}` : ""}/index`
          : `.${context.options.distDir ? `/${context.options.distDir}` : ""}/${entryPoints[0]}`;

        const isEsm = Array.isArray(context.options.format)
          ? context.options.format.includes("esm")
          : context.options.format === "esm";
        const isCjs = Array.isArray(context.options.format)
          ? context.options.format.includes("cjs")
          : context.options.format === "cjs";
        const isDts = context.options.dts || context.options.experimentalDts;

        packageJson.exports["."] ??=
          `${defaultEntry}.${isEsm ? "mjs" : isCjs ? "cjs" : "js"}`;

        for (const entryPoint of entryPoints) {
          packageJson.exports[`./${entryPoint}`] ??= {};
          if (isEsm) {
            if (isDts) {
              packageJson.exports[`./${entryPoint}`].import = {
                types: `./dist/${entryPoint}.d.mts`,
                default: `./dist/${entryPoint}.mjs`
              };
            } else {
              packageJson.exports[`./${entryPoint}`].import =
                `./dist/${entryPoint}.mjs`;
            }

            if (isDts) {
              packageJson.exports[`./${entryPoint}`].default = {
                types: `./dist/${entryPoint}.d.mts`,
                default: `./dist/${entryPoint}.mjs`
              };
            } else {
              packageJson.exports[`./${entryPoint}`].default =
                `./dist/${entryPoint}.mjs`;
            }
          }
          if (isCjs) {
            if (isDts) {
              packageJson.exports[`./${entryPoint}`].require = {
                types: `./dist/${entryPoint}.d.cts`,
                default: `./dist/${entryPoint}.cjs`
              };
            } else {
              packageJson.exports[`./${entryPoint}`].require =
                `./dist/${entryPoint}.cjs`;
            }

            if (!isEsm) {
              if (isDts) {
                packageJson.exports[`./${entryPoint}`].default = {
                  types: `./dist/${entryPoint}.d.cts`,
                  default: `./dist/${entryPoint}.cjs`
                };
              } else {
                packageJson.exports[`./${entryPoint}`].default =
                  `./dist/${entryPoint}.cjs`;
              }
            }
          }

          if (!isEsm && !isCjs) {
            if (isDts) {
              packageJson.exports[`./${entryPoint}`].default = {
                types: `./dist/${entryPoint}.d.ts`,
                default: `./dist/${entryPoint}.js`
              };
            } else {
              packageJson.exports[`./${entryPoint}`].default =
                `./dist/${entryPoint}.js`;
            }
          }
        }

        if (isEsm) {
          packageJson.module = `${defaultEntry}.mjs`;
        } else {
          packageJson.main = `${defaultEntry}.cjs`;
        }

        if (isDts) {
          packageJson.types = `${defaultEntry}.d.${isEsm ? "mts" : isCjs ? "cts" : "ts"}`;
        }

        packageJson.exports = Object.keys(packageJson.exports).reduce(
          (ret, key) => {
            if (key.endsWith("/index") && !ret[key.replace("/index", "")]) {
              ret[key.replace("/index", "")] = packageJson.exports[key];
            }

            return ret;
          },
          packageJson.exports
        );
      }
    }

    await writeJsonFile(
      joinPaths(context.outputPath, "package.json"),
      packageJson
    );

    stopwatch();
  }

  return context;
}
