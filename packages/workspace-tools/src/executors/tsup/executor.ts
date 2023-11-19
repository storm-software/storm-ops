/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutorContext, joinPathFragments, readJsonFile } from "@nx/devkit";
import { getExtraDependencies } from "@nx/esbuild/src/executors/esbuild/lib/get-extra-dependencies";
import { copyAssets } from "@nx/js";
import { DependentBuildableProjectNode } from "@nx/js/src/utils/buildable-libs-utils";
import { readFileSync, writeFileSync } from "fs";
import { removeSync } from "fs-extra";
import { writeFile } from "fs/promises";
import { globSync } from "glob";
import { EventEmitter } from "node:events";
import { buildProjectGraphWithoutDaemon } from "nx/src/project-graph/project-graph";
import { fileExists } from "nx/src/utils/fileutils";
import { join } from "path";
import { format } from "prettier";
import { Options, build as tsup } from "tsup";
import { applyWorkspaceTokens } from "../../utils/apply-workspace-tokens";
import { removeExtension } from "../../utils/file-path-utils";
import { getWorkspaceRoot } from "../../utils/get-workspace-root";
import { getConfig } from "./get-config";
import { TsupExecutorSchema } from "./schema";

type PackageConfiguration = {
  version: string;
  packageName: string;
  hash?: string;
};

export default async function runExecutor(
  options: TsupExecutorSchema,
  context: ExecutorContext
) {
  try {
    console.log("📦  Running Storm build executor on the workspace");

    options.verbose &&
      console.log(
        `⚙️  Executor options:
${Object.keys(options)
  .map(
    key =>
      `${key}: ${
        !options[key] || isPrimitive(options[key])
          ? options[key]
          : JSON.stringify(options[key])
      }`
  )
  .join("\n")}
`
      );

    // #region Prepare build context variables

    if (
      !context.projectsConfigurations?.projects ||
      !context.projectName ||
      !context.projectsConfigurations.projects[context.projectName]
    ) {
      throw new Error(
        "The Build process failed because the context is not valid. Please run this command from a workspace."
      );
    }

    const workspaceRoot = getWorkspaceRoot();
    const projectRoot =
      context.projectsConfigurations.projects[context.projectName].root;
    const sourceRoot =
      context.projectsConfigurations.projects[context.projectName].sourceRoot;

    const outputPath = applyWorkspaceTokens(
      options.outputPath
        ? options.outputPath
        : join(workspaceRoot, "dist", projectRoot),
      context
    );

    // #endregion Prepare build context variables

    // #region Clean output directory

    if (options.clean !== false) {
      console.log(`🧹 Cleaning output path: ${outputPath}`);
      removeSync(outputPath);
    }

    // #endregion Clean output directory

    // #region Copy asset files to output directory

    const assets = Array.from(options.assets);
    assets.push({
      input: projectRoot,
      glob: "*.md",
      output: "/"
    });
    assets.push({
      input: "",
      glob: "LICENSE",
      output: "."
    });
    assets.push({
      input: sourceRoot,
      glob: "**/{*.d.ts,*.ts,*.tsx}",
      output: "src/"
    });

    const result = await copyAssets(
      { assets, watch: options.watch, outputPath },
      context
    );
    if (!result.success) {
      throw new Error("The Build process failed trying to copy assets");
    }

    // #endregion Copy asset files to output directory

    // #region Generate the package.json file

    options.external = options.external || [];
    const externalDependencies: DependentBuildableProjectNode[] =
      options.external.reduce((acc, name) => {
        const externalNode = context.projectGraph.externalNodes[`npm:${name}`];
        if (externalNode) {
          acc.push({
            name,
            outputs: [],
            node: externalNode
          });
        }
        return acc;
      }, []);
    options.verbose &&
      console.log(`Added the following external dependencies:
${externalDependencies
  .map(dep => {
    return `name: ${dep.name}, node: ${dep.node}, outputs: ${dep.outputs}`;
  })
  .join("\n")}`);

    if (!options.bundle) {
      for (const thirdPartyDependency of getExtraDependencies(
        context.projectName,
        context.projectGraph
      )) {
        const packageConfig = thirdPartyDependency.node
          .data as PackageConfiguration;
        if (packageConfig?.packageName) {
          options.external.push(packageConfig.packageName);
          externalDependencies.push(thirdPartyDependency);
        }
      }
    }

    const projectGraph = await buildProjectGraphWithoutDaemon();

    const pathToPackageJson = join(context.root, projectRoot, "package.json");
    const packageJson = fileExists(pathToPackageJson)
      ? readJsonFile(pathToPackageJson)
      : { name: context.projectName, version: "0.0.1" };

    const workspacePackageJson = readJsonFile(
      joinPathFragments(workspaceRoot, "package.json")
    );

    externalDependencies.forEach(entry => {
      const packageConfig = entry.node.data as PackageConfiguration;
      if (
        packageConfig?.packageName &&
        !!(projectGraph.externalNodes[entry.node.name]?.type === "npm")
      ) {
        const { packageName, version } = packageConfig;
        if (
          packageJson.dependencies?.[packageName] ||
          packageJson.devDependencies?.[packageName] ||
          packageJson.peerDependencies?.[packageName]
        ) {
          return;
        }
        if (workspacePackageJson.dependencies?.[packageName]) {
          return;
        }

        packageJson.dependencies ??= {};
        packageJson.dependencies[packageName] = version;
      }
    });

    packageJson.type = "module";
    packageJson.exports ??= {
      ".": {
        import: {
          types: "./dist/modern/index.d.ts",
          default: "./dist/modern/index.js"
        },
        require: {
          types: "./dist/modern/index.d.cts",
          default: "./dist/modern/index.cjs"
        },
        ...(options.additionalEntryPoints ?? []).map(entryPoint => ({
          [removeExtension(entryPoint).replace(sourceRoot, "")]: {
            types: joinPathFragments(
              "./dist/modern",
              `${removeExtension(entryPoint.replace(sourceRoot, ""))}.d.ts`
            ),
            default: joinPathFragments(
              "./dist/modern",
              `${removeExtension(entryPoint.replace(sourceRoot, ""))}.js`
            )
          }
        }))
      },
      "./package.json": "./package.json"
    };

    packageJson.funding ??= workspacePackageJson.funding;

    packageJson.types ??= "dist/legacy/index.d.ts";
    packageJson.main ??= "dist/legacy/index.cjs";
    packageJson.module ??= "dist/legacy/index.js";
    options.platform &&
      options.platform !== "node" &&
      (packageJson.browser ??= "dist/modern/index.global.js");

    packageJson.sideEffects ??= false;
    packageJson.files ??= ["dist", "src"];
    packageJson.publishConfig ??= {
      access: "public"
    };

    packageJson.description ??= workspacePackageJson.description;
    packageJson.homepage ??= workspacePackageJson.homepage;
    packageJson.bugs ??= workspacePackageJson.bugs;
    packageJson.author ??= workspacePackageJson.author;
    packageJson.license ??= workspacePackageJson.license;
    packageJson.keywords ??= workspacePackageJson.keywords;

    packageJson.repository ??= workspacePackageJson.repository;
    packageJson.repository.directory ??= projectRoot
      ? projectRoot
      : joinPathFragments("packages", context.projectName);

    const packageJsonPath = joinPathFragments(
      context.root,
      outputPath,
      "package.json"
    );
    console.log(`⚡ Writing package.json file to: ${packageJsonPath}`);

    writeFileSync(
      packageJsonPath,
      await format(JSON.stringify(packageJson), {
        plugins: ["prettier-plugin-packagejson"],
        parser: "json",
        trailingComma: "none",
        tabWidth: 2,
        semi: true,
        singleQuote: false,
        quoteProps: "preserve",
        insertPragma: false,
        bracketSameLine: true,
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: "avoid",
        endOfLine: "lf"
      })
    );

    const banner = options.banner
      ? options.banner
      : process.env.STORM_TS_FILE_HEADING;
    if (banner) {
      const files = globSync([
        joinPathFragments(context.root, outputPath, "src/**/*.ts"),
        joinPathFragments(context.root, outputPath, "src/**/*.tsx"),
        joinPathFragments(context.root, outputPath, "src/**/*.js"),
        joinPathFragments(context.root, outputPath, "src/**/*.jsx")
      ]);
      await Promise.allSettled(
        files.map(file =>
          writeFile(
            file,
            `// ${banner}\n\n${readFileSync(file, "utf-8")}`,
            "utf-8"
          )
        )
      );
    }

    // #endregion Generate the package.json file

    // #region Run the build process

    const eventEmitter = new EventEmitter({ captureRejections: true });
    eventEmitter.on("message", event => {
      console.log(`📢  Tsup build message: \n`, event);
    });

    const config = getConfig(sourceRoot, {
      ...options,
      banner: banner
        ? { js: `// ${banner}`, css: `/* ${banner} */` }
        : undefined,
      outputPath
    });
    if (typeof config === "function") {
      await build(await Promise.resolve(config({})));
    } else {
      await build(config);
    }

    // #endregion Run the build process

    console.log("⚡ The Build process has completed successfully");
    return {
      success: true
    };
  } catch (e) {
    console.error(e);
    return {
      success: false
    };
  }
}

const build = async (options: Options | Options[]) => {
  Array.isArray(options)
    ? options.length > 0
      ? options[0].silent
      : false
    : options.silent && console.log("⚙️  Tsup build config: \n", options, "\n");

  if (Array.isArray(options)) {
    await Promise.all(options.map(buildOptions => tsup(buildOptions)));
  } else {
    await tsup(options);
  }
};

const isPrimitive = (value: unknown): boolean => {
  try {
    return (
      value === undefined ||
      value === null ||
      (typeof value !== "object" && typeof value !== "function")
    );
  } catch (e) {
    return false;
  }
};
