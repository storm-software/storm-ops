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
import {
  createProjectGraphAsync,
  joinPathFragments,
  ProjectGraphProjectNode,
  readJsonFile,
  readProjectsConfigurationFromProjectGraph,
  writeJsonFile
} from "@nx/devkit";
import { calculateProjectBuildableDependencies } from "@nx/js/src/utils/buildable-libs-utils";
import { watch as createWatcher } from "chokidar";
import { debounce, flatten, omit } from "es-toolkit";
import { map } from "es-toolkit/compat";
import * as esbuild from "esbuild";
import { BuildContext } from "esbuild";
import { globbySync } from "globby";
import { existsSync } from "node:fs";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root";
import { DEFAULT_BUILD_OPTIONS } from "./config";
import { depsCheckPlugin } from "./plugins/deps-check";
import { fixImportsPlugin } from "./plugins/fix-imports";
import { onErrorPlugin } from "./plugins/on-error";
import { resolvePathsPlugin } from "./plugins/resolve-paths";
import { tscPlugin } from "./plugins/tsc";
import { ESBuildResolvedOptions, type ESBuildOptions } from "./types";
import { handle, pipe, transduce } from "./utilities/helpers";
import { writeLog } from "./utilities/log";

/**
 * Apply defaults to the original build options
 *
 * @param options - the original build options
 * @returns the build options with defaults applied
 */
const resolveOptions = async (
  options: ESBuildOptions
): Promise<ESBuildResolvedOptions> => {
  const projectRoot = options.projectRoot;

  const workspaceRoot = findWorkspaceRoot(projectRoot);
  if (!workspaceRoot) {
    throw new Error("Cannot find Nx workspace root");
  }

  const nxJsonPath = joinPathFragments(workspaceRoot.dir, "nx.json");
  if (!(await hfs.isFile(nxJsonPath))) {
    throw new Error("Cannot find Nx workspace configuration");
  }

  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });

  const projectJsonPath = joinPathFragments(
    workspaceRoot.dir,
    projectRoot,
    "project.json"
  );
  if (!(await hfs.isFile(projectJsonPath))) {
    throw new Error("Cannot find project.json configuration");
  }

  const projectJson = await hfs.json(projectJsonPath);
  const projectName = projectJson.name;

  const projectConfigurations =
    readProjectsConfigurationFromProjectGraph(projectGraph);
  if (!projectConfigurations?.projects?.[projectName]) {
    throw new Error(
      "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
    );
  }

  // const packageJsonPath = joinPathFragments(projectRoot, "project.json");
  // if (!(await hfs.isFile(packageJsonPath))) {
  //   throw new Error("Cannot find package.json configuration");
  // }

  // const packageJson = await hfs.json(
  //   joinPathFragments(workspaceRoot.dir, projectRoot, "package.json")
  // );

  return {
    ...DEFAULT_BUILD_OPTIONS,
    format: "cjs",
    outExtension: { ".js": ".js" },
    resolveExtensions: [".ts", ".js", ".node"],
    entryPoints: globbySync("./src/**/*.{j,t}s", {
      ignore: ["./src/__tests__/**/*"]
    }),
    mainFields: ["module", "main"],
    ...options,
    outdir:
      options.outdir ||
      joinPathFragments(workspaceRoot.dir, "dist", projectRoot),
    plugins: [
      ...(options.plugins ?? []),
      resolvePathsPlugin,
      fixImportsPlugin,
      tscPlugin(options.emitTypes),
      onErrorPlugin
    ],
    external: [...(options.external ?? [])],
    name: `${options.name || projectName}-${options.format || "cjs"}`,
    projectConfigurations,
    projectName,
    projectGraph,
    workspaceRoot
  };
};

const generatePackageJson = async (options: ESBuildResolvedOptions) => {
  const nxJsonPath = joinPathFragments(options.workspaceRoot.dir, "nx.json");
  if (!(await hfs.isFile(nxJsonPath))) {
    throw new Error("Cannot find Nx workspace configuration");
  }

  const projectJsonPath = joinPathFragments(
    options.workspaceRoot.dir,
    options.projectRoot,
    "project.json"
  );
  if (!(await hfs.isFile(projectJsonPath))) {
    throw new Error("Cannot find project.json configuration");
  }

  if (!options.projectConfigurations?.projects?.[options.projectName]) {
    throw new Error(
      "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
    );
  }

  const packageJsonPath = joinPathFragments(
    options.projectRoot,
    "project.json"
  );
  if (!(await hfs.isFile(packageJsonPath))) {
    throw new Error("Cannot find package.json configuration");
  }

  const packageJson = await hfs.json(
    joinPathFragments(
      options.workspaceRoot.dir,
      options.projectRoot,
      "package.json"
    )
  );

  const projectDependencies = calculateProjectBuildableDependencies(
    undefined,
    options.projectGraph,
    options.workspaceRoot.dir,
    options.projectName,
    process.env.NX_TASK_TARGET_TARGET || "build",
    process.env.NX_TASK_TARGET_CONFIGURATION || "production",
    true
  );

  const localPackages = projectDependencies.dependencies
    .filter(
      dep =>
        dep.node.type === "lib" &&
        dep.node.data.root !== options.projectRoot &&
        dep.node.data.root !== options.workspaceRoot.dir
    )
    .reduce(
      (ret, project) => {
        const projectNode = project.node as ProjectGraphProjectNode;

        if (projectNode.data.root) {
          const projectPackageJsonPath = joinPathFragments(
            options.workspaceRoot.dir,
            projectNode.data.root,
            "package.json"
          );
          if (existsSync(projectPackageJsonPath)) {
            const projectPackageJson = readJsonFile(projectPackageJsonPath);

            if (projectPackageJson.private !== false) {
              ret.push(projectPackageJson);
            }
          }
        }

        return ret;
      },
      [] as Record<string, any>[]
    );

  if (localPackages.length > 0) {
    writeLog(
      "trace",
      `📦  Adding local packages to package.json: ${localPackages.map(p => p.name).join(", ")}`
    );

    packageJson.peerDependencies = localPackages.reduce((ret, localPackage) => {
      if (!ret[localPackage.name]) {
        ret[localPackage.name] = `>=${localPackage.version || "0.0.1"}`;
      }

      return ret;
    }, packageJson.peerDependencies ?? {});
    packageJson.peerDependenciesMeta = localPackages.reduce(
      (ret, localPackage) => {
        if (!ret[localPackage.name]) {
          ret[localPackage.name] = {
            optional: false
          };
        }

        return ret;
      },
      packageJson.peerDependenciesMeta ?? {}
    );
    packageJson.devDependencies = localPackages.reduce((ret, localPackage) => {
      if (!ret[localPackage.name]) {
        ret[localPackage.name] = localPackage.version || "0.0.1";
      }

      return ret;
    }, packageJson.peerDependencies ?? {});
  } else {
    writeLog(
      "trace",
      "📦  No local packages dependencies to add to package.json"
    );
  }

  packageJson.main = "./dist/index.cjs";
  packageJson.module = "./dist/index.mjs";
  packageJson.types = "./dist/index.d.ts";

  await writeJsonFile(
    joinPathFragments(options.outdir, "package.json"),
    packageJson
  );

  return options;
};

/**
 * Create two deferred builds for esm and cjs. The one follows the other:
 * - 1. The code gets compiled to an optimized tree-shaken esm output
 * - 2. We take that output and compile it to an optimized cjs output
 *
 * @param options - the original build options
 * @returns if options = [a, b], we get [a-esm, a-cjs, b-esm, b-cjs]
 */
async function createOptions(options: ESBuildOptions[]) {
  return flatten(
    await Promise.all(
      map(options, options => [
        // we defer it so that we don't trigger glob immediately
        () => resolveOptions(options)
      ])
    )
  );
}

/**
 * We only want to trigger the glob search once we are ready, and that is when
 * the previous build has finished. We get the build options from the deferred.
 */
async function computeOptions(
  options: () => Promise<ESBuildResolvedOptions>
): Promise<ESBuildResolvedOptions> {
  return options();
}

// /**
//  * Extensions are not automatically by esbuild set for `options.outfile`. We
//  * look at the set `options.outExtension` and we add that to `options.outfile`.
//  */
// function addExtensionFormat(options: ESBuildOptions) {
//   if (options.outfile && options.outExtension) {
//     const ext = options.outExtension[".js"];

//     options.outfile = `${options.outfile}${ext}`;
//   }

//   return options;
// }

// /**
//  * If we don't have `options.outfile`, we default `options.outdir`
//  */
// function addDefaultOutDir(options: ESBuildOptions) {
//   if (options.outfile === undefined) {
//     options.outdir = getOutDir(options);
//   }

//   return options;
// }

/**
 * Execute esbuild with all the configurations we pass
 */
async function executeEsBuild(options: ESBuildResolvedOptions) {
  if (process.env.WATCH === "true") {
    const context = await esbuild.context(
      omit(options, ["name", "emitTypes", "emitMetafile"]) as any
    );

    watch(context, options);
  }

  const build = await esbuild.build(
    omit(options, ["name", "emitTypes", "emitMetafile"]) as any
  );

  if (build.metafile && options.emitMetafile) {
    const metafilePath = `${options.outdir}/${options.name}.meta.json`;
    await hfs.write(metafilePath, JSON.stringify(build.metafile));
  }

  return [options, build] as const;
}

/**
 * A blank esbuild run to do an analysis of our deps
 */
async function dependencyCheck(options: ESBuildResolvedOptions) {
  // we only check our dependencies for a full build
  if (process.env.DEV === "true") return undefined;
  // Only run on test and publish pipelines on Buildkite
  // Meaning we skip on GitHub Actions
  // Because it's slow and runs for each job, during setup, making each job slower
  if (process.env.CI && !process.env.BUILDKITE) return undefined;

  // we need to bundle everything to do the analysis
  const buildPromise = esbuild.build({
    entryPoints: globbySync("**/*.{j,t}s", {
      // We don't check dependencies in ecosystem tests because tests are isolated from the build.
      ignore: ["./src/__tests__/**/*", "./tests/e2e/**/*", "./dist/**/*"],
      gitignore: true
    }),
    logLevel: "silent", // there will be errors
    bundle: true, // we bundle to get everything
    write: false, // no need to write for analysis
    outdir: "out",
    plugins: [depsCheckPlugin(options.bundle)]
  });

  // we absolutely don't care if it has any errors
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  await buildPromise.catch(() => {});

  return undefined;
}

/**
 * Execution pipeline that applies a set of actions
 *
 * @param options - the build options
 * @returns the build result
 */
export async function build(options: ESBuildOptions[]) {
  void transduce.async(options, dependencyCheck);

  return transduce.async(
    await createOptions(options),
    pipe.async(computeOptions, generatePackageJson, executeEsBuild)
  );
}

/**
 * Executes the build and rebuilds what is necessary
 *
 * @param context - the build context
 * @param options - the build options
 * @returns the build result
 */
const watch = (context: BuildContext, options: ESBuildResolvedOptions) => {
  if (process.env.WATCH !== "true") return context;

  // common chokidar options for the watchers
  const config = {
    ignoreInitial: true,
    useFsEvents: true,
    ignored: ["./src/__tests__/**/*", "./package.json"]
  };

  // prepare the incremental builds watcher
  const changeWatcher = createWatcher(["./src/**/*"], config);

  // triggers quick rebuild on file change
  const fastRebuild = debounce(async () => {
    const timeBefore = Date.now();

    // we handle possible rebuild exceptions
    const rebuildResult = await handle.async(() => {
      return context.rebuild();
    });

    if (rebuildResult instanceof Error) {
      writeLog("error", rebuildResult.message);
    }

    writeLog("log", `${Date.now() - timeBefore}ms [${options.name ?? ""}]`);
  }, 10);

  changeWatcher.on("change", fastRebuild);

  return undefined;
};

// Utils ::::::::::::::::::::::::::::::::::::::::::::::::::

// get the current project externals this helps to mark dependencies as external
// by having convention in the package.json (dev = bundled, non-dev = external)
// function getProjectExternals(options: ESBuildOptions) {
//   const pkg = require(`${process.cwd()}/package.json`);
//   const peerDeps = Object.keys(pkg.peerDependencies ?? {});
//   const regDeps = Object.keys(pkg.dependencies ?? {});

//   // when bundling, only the devDeps will be bundled
//   if (!process.env.IGNORE_EXTERNALS && options.bundle === true) {
//     return [...new Set([...peerDeps, ...regDeps])];
//   }

//   // otherwise, all the dependencies will be bundled
//   return [];
// }
