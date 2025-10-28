#!/usr/bin/env node

import type { StormWorkspaceConfig } from "@storm-software/config";
import { getConfig } from "@storm-software/config-tools/get-config";
import {
  getStopwatch,
  writeFatal,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools/logger/console";
import { findWorkspaceRootSafe } from "@storm-software/config-tools/utilities/find-workspace-root";
import {
  exitWithError,
  exitWithSuccess,
  handleProcess
} from "@storm-software/config-tools/utilities/process-handler";
import { Command } from "commander";
import { build } from "../src/build";
import { clean } from "../src/clean";
import { UnbuildCLIOptions } from "../src/types";

async function createProgram(config: StormWorkspaceConfig) {
  try {
    writeInfo("⚡ Running Storm Unbuild pipeline", config);

    const root = findWorkspaceRootSafe();
    process.env.STORM_WORKSPACE_ROOT ??= root;
    process.env.NX_WORKSPACE_ROOT_PATH ??= root;
    if (root) {
      process.chdir(root);
    }

    const program = new Command("storm-unbuild");
    program.version("1.0.0", "-v --version", "display CLI version");

    program
      .description("⚡ Run the Storm Unbuild pipeline")
      .showHelpAfterError()
      .showSuggestionAfterError();

    program
      .command("build", { isDefault: true })
      .alias("bundle")
      .description("Run a TypeScript build using Unbuild.")
      .option("-n --name <value>", "The name of the project to build")
      .option(
        "-p --project-root <path>",
        "The path to the root of the project to build. This path is defined relative to the workspace root."
      )
      .option(
        "-s --source-root <path>",
        "The path of the project's source folder to build"
      )
      .option(
        "-o --output-path <path>",
        "The path of the project's source folder to build",
        "dist/{projectRoot}"
      )
      .option(
        "-p --platform <value>",
        "The platform to build the distribution for",
        "node"
      )
      .option(
        "-f, --format <value...>",
        "The format to build the distribution in",

        (value: string, previous: unknown) => {
          if (previous === undefined) {
            return [value];
          } else if (Array.isArray(previous) && !previous.includes(value)) {
            previous.push(value);
          }

          return previous;
        },
        ["esm"]
      )
      .option(
        "-t --target <value>",
        "The target to build the distribution for",
        "ESNext"
      )
      .option("-b --bundle", "Should the output be bundled", true)
      .option("--no-bundle", "Should the output be bundled")
      .option(
        "-c --clean",
        "Should the output directory be cleaned before building",
        true
      )
      .option(
        "--no-clean",
        "Should the output directory be cleaned before building"
      )
      .option("-w --watch", "Should the build process watch for changes")
      .option("-d --debug", "Should the build process run in debug mode")
      .option("--banner <value>", "The banner to prepend to the output")
      .option("--footer <value>", "The footer to prepend to the output")
      .option(
        "--splitting",
        "Should the output be split into multiple files",
        true
      )
      .option("--tree-shaking", "Should tree shaking be enabled", true)
      .option(
        "--generate-package-json",
        "Should a package.json be generated for the output",
        true
      )
      .option("--emit-on-all", "Should the output be emitted on all platforms")
      .option(
        "--metafile",
        "Should a metafile be generated for the output",
        true
      )
      .option("--minify", "Should the output be minified", true)
      .option(
        "--include-src",
        "Should the source files be included in the output"
      )
      .option("--verbose", "Should the build process be verbose")
      .option("--emit-types", "Should types be emitted for the output", true)
      .action(buildAction(config));

    program
      .command("clean")
      .alias("clear")
      .description(
        "Clean the output directory of the project. This command will remove the 'dist' folder."
      )
      .option("-n --name <value>", "The name of the project to clean")
      .action(cleanAction(config));

    return program;
  } catch (e) {
    writeFatal(
      `A fatal error occurred while running the program: ${e.message}`,
      config
    );
    process.exit(1);
  }
}

const buildAction =
  (config: StormWorkspaceConfig) => async (options: UnbuildCLIOptions) => {
    try {
      await build({
        ...options,
        sourcemap: !!options.debug,
        replace: {},
        alias: {},
        stub: false,
        watchOptions: {
          buildDelay: 5000,
          chokidar: {},
          clearScreen: true,
          skipWrite: true
        },
        stubOptions: {
          jiti: {}
        },
        dependencies: [],
        peerDependencies: [],
        devDependencies: [],
        rollup: {
          emitCJS: false,
          watch: false,
          cjsBridge: false,
          dts: {
            respectExternal: true
          },
          replace: {},
          alias: {},
          resolve: {},
          json: {},
          commonjs: {},
          esbuild: {
            target: options.target,
            format: "esm",
            platform: options.platform,
            minify: options.minify,
            treeShaking: options.treeShaking
          }
        }
      });
    } catch (e) {
      writeFatal(
        `A fatal error occurred while cleaning the Unbuild output directory: ${e.message}`,
        config
      );

      exitWithError(config);
      process.exit(1);
    }
  };

const cleanAction =
  (config: StormWorkspaceConfig) =>
  async (options: { output: string; name?: string }) => {
    try {
      await clean(options.name, options.output, config);
    } catch (e) {
      writeFatal(
        `A fatal error occurred while cleaning the ESBuild output directory: ${e.message}`,
        config
      );

      exitWithError(config);
      process.exit(1);
    }
  };

void (async () => {
  const config = await getConfig();
  const stopwatch = getStopwatch("Storm ESBuild executable");

  try {
    handleProcess(config);

    const program = await createProgram(config);
    await program.parseAsync(process.argv);

    writeSuccess(
      `🎉  Storm ESBuild executable has completed successfully!`,
      config
    );
    exitWithSuccess(config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running Storm ESBuild executable: \n\n${error.message}`,
      config
    );
    exitWithError(config);
    process.exit(1);
  } finally {
    stopwatch();
  }
})();
