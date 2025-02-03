import {
  type GeneratorCallback,
  type ProjectConfiguration,
  type Tree,
  addDependenciesToPackageJson,
  addProjectConfiguration,
  ensurePackage,
  formatFiles,
  names,
  offsetFromRoot,
  readJson,
  updateJson,
  writeJson,
} from "@nx/devkit";
import { determineProjectNameAndRootOptions } from "@nx/devkit/src/generators/project-name-and-root-utils";
import {
  addTsConfigPath,
  getRelativePathToRootTsConfig,
  tsConfigBaseOptions,
} from "@nx/js";
import jsInitGenerator from "@nx/js/src/generators/init/init";
import { InitSchema } from "@nx/js/src/generators/init/schema";
import {
  Bundler,
  NormalizedLibraryGeneratorOptions,
} from "@nx/js/src/generators/library/schema";
import setupVerdaccio from "@nx/js/src/generators/setup-verdaccio/generator";
import { ProjectPackageManagerWorkspaceState } from "@nx/js/src/utils/package-manager-workspaces";
import { StormConfig } from "@storm-software/config";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import type { PackageJson } from "nx/src/utils/package-json";
import { UnbuildExecutorSchema } from "../executors/unbuild/schema.d";
import { addProjectTag, ProjectTagConstants } from "../utils/project-tags";
import { nxVersion } from "../utils/versions";
import { TypeScriptLibraryGeneratorSchema } from "./typescript-library-generator.schema.d";

export type TypeScriptLibraryGeneratorOptions =
  TypeScriptLibraryGeneratorSchema & {
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    peerDependenciesMeta?: Record<string, any>;
    tsconfigOptions?: Record<string, any>;
  };

export type TypeScriptLibraryGeneratorNormalizedOptions =
  TypeScriptLibraryGeneratorOptions &
    NormalizedLibraryGeneratorOptions & {
      rootProject: boolean;
    };

type TypeScriptLibraryProjectConfig = ProjectConfiguration & {
  targets: {
    build: { options: Partial<UnbuildExecutorSchema> };
  } & Record<string, any>;
};

export async function typeScriptLibraryGeneratorFn(
  tree: Tree,
  options: TypeScriptLibraryGeneratorOptions,
  config?: StormConfig,
) {
  const normalized = await normalizeOptions(tree, { ...options });

  const tasks: GeneratorCallback[] = [];
  tasks.push(
    await jsInitGenerator(tree, {
      ...normalized,
      tsConfigName: normalized.rootProject
        ? "tsconfig.json"
        : "tsconfig.base.json",
    } as InitSchema),
  );

  tasks.push(
    addDependenciesToPackageJson(
      tree,
      {},
      {
        "@storm-software/workspace-tools": "latest",
        "@storm-software/testing-tools": "latest",
        ...(options.devDependencies ?? {}),
      },
    ),
  );

  if (normalized.publishable) {
    tasks.push(await setupVerdaccio(tree, { ...normalized, skipFormat: true }));
  }

  const projectConfig = {
    root: normalized.directory,
    projectType: "library",
    sourceRoot: joinPaths(normalized.directory ?? "", "src"),
    targets: {
      build: {
        executor: options.buildExecutor,
        outputs: ["{options.outputPath}"],
        options: {
          entry: [joinPaths(normalized.projectRoot, "src", "index.ts")],
          outputPath: getOutputPath(normalized),
          tsconfig: joinPaths(normalized.projectRoot, "tsconfig.json"),
          project: joinPaths(normalized.projectRoot, "package.json"),
          defaultConfiguration: "production",
          platform: "neutral",
          assets: [
            {
              input: normalized.projectRoot,
              glob: "*.md",
              output: "/",
            },
            {
              input: "",
              glob: "LICENSE",
              output: "/",
            },
          ],
        },
        configurations: {
          production: {
            debug: false,
            verbose: false,
          },
          development: {
            debug: true,
            verbose: true,
          },
        },
      },
    },
  } as TypeScriptLibraryProjectConfig;

  if (options.platform) {
    projectConfig.targets.build.options.platform =
      options.platform === "worker" ? "node" : options.platform;
  }

  addProjectTag(
    projectConfig,
    ProjectTagConstants.Platform.TAG_ID,
    options.platform === "node"
      ? ProjectTagConstants.Platform.NODE
      : options.platform === "worker"
        ? ProjectTagConstants.Platform.WORKER
        : options.platform === "browser"
          ? ProjectTagConstants.Platform.BROWSER
          : ProjectTagConstants.Platform.NEUTRAL,
    { overwrite: false },
  );

  createProjectTsConfigJson(tree, normalized);
  addProjectConfiguration(tree, normalized.name, projectConfig);

  let repository = {
    type: "github",
    url:
      config?.repository ||
      `https://github.com/${config?.organization || "storm-software"}/${config?.namespace || config?.name || "repository"}.git`,
  };

  let description =
    options.description ||
    "A package developed by Storm Software used to create modern, scalable web applications.";

  if (tree.exists("package.json")) {
    const packageJson = readJson<{
      repository: any;
      description: string;
    }>(tree, "package.json");

    if (packageJson?.repository) {
      repository = packageJson.repository;
    }
    if (packageJson?.description) {
      description = packageJson.description;
    }
  }

  if (!normalized.importPath) {
    normalized.importPath = normalized.name;
  }

  const packageJsonPath = joinPaths(normalized.projectRoot, "package.json");
  if (tree.exists(packageJsonPath)) {
    updateJson<PackageJson>(tree, packageJsonPath, (json: PackageJson) => {
      if (!normalized.importPath) {
        normalized.importPath = normalized.name;
      }

      json.name = normalized.importPath;
      json.version = "0.0.1";

      // If the package is publishable or root/standalone, we should remove the private field.
      if (json.private && (normalized.publishable || normalized.rootProject)) {
        json.private = undefined;
      }

      return {
        ...json,
        version: "0.0.1",
        description,
        repository: {
          ...repository,
          directory: normalized.projectRoot,
        },
        type: "module",
        dependencies: {
          ...json.dependencies,
        },
        publishConfig: {
          access: "public",
        },
      } as unknown as PackageJson;
    });
  } else {
    writeJson<PackageJson>(tree, packageJsonPath, {
      name: normalized.importPath,
      version: "0.0.1",
      description,
      repository: {
        ...repository,
        directory: normalized.projectRoot,
      },
      private: !normalized.publishable || normalized.rootProject,
      type: "module",
      publishConfig: {
        access: "public",
      },
    } as unknown as PackageJson);
  }

  if (tree.exists("package.json") && normalized.importPath) {
    updateJson(tree, "package.json", (json) => ({
      ...json,
      pnpm: {
        ...json?.pnpm,
        overrides: {
          ...json?.pnpm?.overrides,
          [normalized.importPath ?? ""]: "workspace:*",
        },
      },
    }));
  }

  addTsConfigPath(tree, normalized.importPath, [
    joinPaths(
      normalized.projectRoot,
      "./src",
      `index.${normalized.js ? "js" : "ts"}`,
    ),
  ]);
  addTsConfigPath(tree, joinPaths(normalized.importPath, "/*"), [
    joinPaths(normalized.projectRoot, "./src", "/*"),
  ]);

  if (tree.exists("package.json")) {
    const packageJson = readJson<{
      repository: any;
      description: string;
    }>(tree, "package.json");

    if (packageJson?.repository) {
      repository = packageJson.repository;
    }
    if (packageJson?.description) {
      description = packageJson.description;
    }
  }

  const tsconfigPath = joinPaths(normalized.projectRoot, "tsconfig.json");
  if (tree.exists(tsconfigPath)) {
    updateJson(tree, tsconfigPath, (json: any) => {
      json.composite ??= true;

      return json;
    });
  } else {
    writeJson(tree, tsconfigPath, {
      extends: `${offsetFromRoot(normalized.projectRoot)}tsconfig.base.json`,
      composite: true,
      compilerOptions: {
        outDir: `${offsetFromRoot(normalized.projectRoot)}dist/out-tsc`,
      },
      files: [],
      include: ["src/**/*.ts", "src/**/*.js"],
      exclude: ["jest.config.ts", "src/**/*.spec.ts", "src/**/*.test.ts"],
    });
  }

  // const lintCallback = await addLint(tree, options);
  // tasks.push(lintCallback);

  await formatFiles(tree);

  return null;
}

export function getOutputPath(
  options: TypeScriptLibraryGeneratorNormalizedOptions,
) {
  const parts = ["dist"];
  if (options.projectRoot === ".") {
    parts.push(options.name);
  } else {
    parts.push(options.projectRoot);
  }
  return joinPaths(...parts);
}

export function createProjectTsConfigJson(
  tree: Tree,
  options: TypeScriptLibraryGeneratorNormalizedOptions,
) {
  const tsconfig = {
    extends: options.rootProject
      ? undefined
      : getRelativePathToRootTsConfig(tree, options.projectRoot),
    ...(options?.tsconfigOptions ?? {}),
    compilerOptions: {
      ...(options.rootProject ? tsConfigBaseOptions : {}),
      outDir: joinPaths(offsetFromRoot(options.projectRoot), "dist/out-tsc"),
      noEmit: true,
      ...(options?.tsconfigOptions?.compilerOptions ?? {}),
    },
    files: [...(options?.tsconfigOptions?.files ?? [])],
    include: [
      ...(options?.tsconfigOptions?.include ?? []),
      "src/**/*.ts",
      "src/**/*.js",
      "bin/**/*",
    ],
    exclude: [
      ...(options?.tsconfigOptions?.exclude ?? []),
      "jest.config.ts",
      "src/**/*.spec.ts",
      "src/**/*.test.ts",
    ],
  };

  writeJson(tree, joinPaths(options.projectRoot, "tsconfig.json"), tsconfig);
}

export type UnitTestRunner = "jest" | "vitest" | "none" | undefined;
export type TestEnvironment = "jsdom" | "node" | undefined;

export async function normalizeOptions(
  tree: Tree,
  options: TypeScriptLibraryGeneratorOptions,
  config?: StormConfig,
): Promise<TypeScriptLibraryGeneratorNormalizedOptions> {
  let importPath = options.importPath;
  if (!importPath && config?.namespace) {
    importPath = `@${config?.namespace}/${options.name}`;
  }

  if (options.publishable) {
    if (!importPath) {
      throw new Error(
        `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`,
      );
    }
  }

  let bundler: Bundler = "tsc";
  if (options.publishable === false && options.buildable === false) {
    bundler = "none";
  }

  const { Linter } = ensurePackage("@nx/eslint", nxVersion);

  const rootProject = false;
  const {
    projectName,
    names: projectNames,
    projectRoot,
    importPath: normalizedImportPath,
  } = await determineProjectNameAndRootOptions(tree, {
    name: options.name,
    projectType: "library",
    directory: options.directory,
    importPath,
    rootProject,
  });

  const normalized = names(projectNames.projectFileName);
  const fileName = normalized.fileName;

  return {
    js: false,
    pascalCaseFiles: false,
    skipFormat: false,
    skipTsConfig: false,
    includeBabelRc: false,
    unitTestRunner: "jest" as UnitTestRunner,
    linter: Linter.EsLint,
    testEnvironment: "node" as TestEnvironment,
    config: "project",
    compiler: "tsc",
    bundler,
    skipTypeCheck: false,
    minimal: false,
    hasPlugin: false,
    isUsingTsSolutionConfig: false,
    projectPackageManagerWorkspaceState:
      "included" as ProjectPackageManagerWorkspaceState,
    ...options,
    fileName,
    name: projectName,
    projectNames,
    projectRoot,
    parsedTags: options.tags
      ? options.tags.split(",").map((s) => s.trim())
      : [],
    importPath: normalizedImportPath,
    rootProject,
    shouldUseSwcJest: false,
  } as TypeScriptLibraryGeneratorNormalizedOptions;
}
