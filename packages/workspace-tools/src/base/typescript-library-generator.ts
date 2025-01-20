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
  writeJson
} from "@nx/devkit";
import { determineProjectNameAndRootOptions } from "@nx/devkit/src/generators/project-name-and-root-utils";
import {
  addTsConfigPath,
  getRelativePathToRootTsConfig,
  tsConfigBaseOptions
} from "@nx/js";
import jsInitGenerator from "@nx/js/src/generators/init/init";
import {
  Bundler,
  NormalizedLibraryGeneratorOptions
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

export type TypeScriptLibraryGeneratorNormalizedSchema =
  TypeScriptLibraryGeneratorSchema & NormalizedLibraryGeneratorOptions;

type TypeScriptLibraryProjectConfig = ProjectConfiguration & {
  targets: {
    build: { options: Partial<UnbuildExecutorSchema> };
  } & Record<string, any>;
};

export async function typeScriptLibraryGeneratorFn(
  tree: Tree,
  schema: TypeScriptLibraryGeneratorSchema,
  config?: StormConfig
) {
  const options = await normalizeOptions(tree, { ...schema });

  const tasks: GeneratorCallback[] = [];
  tasks.push(
    await jsInitGenerator(tree, {
      ...options,
      tsConfigName: options.rootProject ? "tsconfig.json" : "tsconfig.base.json"
    })
  );

  tasks.push(
    addDependenciesToPackageJson(
      tree,
      {},
      {
        "@storm-software/workspace-tools": "latest",
        "@storm-software/testing-tools": "latest",
        ...(schema.devDependencies ?? {})
      }
    )
  );

  if (options.publishable) {
    tasks.push(await setupVerdaccio(tree, { ...options, skipFormat: true }));
  }

  const projectConfig = {
    root: options.directory,
    projectType: "library",
    sourceRoot: joinPaths(options.directory ?? "", "src"),
    targets: {
      build: {
        executor: schema.buildExecutor,
        outputs: ["{options.outputPath}"],
        options: {
          entry: [joinPaths(options.projectRoot, "src", "index.ts")],
          outputPath: getOutputPath(options),
          tsconfig: joinPaths(options.projectRoot, "tsconfig.json"),
          project: joinPaths(options.projectRoot, "package.json"),
          defaultConfiguration: "production",
          platform: "neutral",
          assets: [
            {
              input: options.projectRoot,
              glob: "*.md",
              output: "/"
            },
            {
              input: "",
              glob: "LICENSE",
              output: "/"
            }
          ]
        },
        configurations: {
          production: {
            debug: false,
            verbose: false
          },
          development: {
            debug: true,
            verbose: true
          }
        }
      }
    }
  } as TypeScriptLibraryProjectConfig;

  if (schema.platform) {
    projectConfig.targets.build.options.platform =
      schema.platform === "worker" ? "node" : schema.platform;
  }

  addProjectTag(
    projectConfig,
    ProjectTagConstants.Platform.TAG_ID,
    schema.platform === "node"
      ? ProjectTagConstants.Platform.NODE
      : schema.platform === "worker"
        ? ProjectTagConstants.Platform.WORKER
        : schema.platform === "browser"
          ? ProjectTagConstants.Platform.BROWSER
          : ProjectTagConstants.Platform.NEUTRAL,
    { overwrite: false }
  );

  createProjectTsConfigJson(tree, options);
  addProjectConfiguration(tree, options.name, projectConfig);

  let repository = {
    type: "github",
    url:
      config?.repository ||
      `https://github.com/${config?.organization || "storm-software"}/${config?.namespace || config?.name || "repository"}.git`
  };

  let description =
    schema.description ||
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

  if (!options.importPath) {
    options.importPath = options.name;
  }

  const packageJsonPath = joinPaths(options.projectRoot, "package.json");
  if (tree.exists(packageJsonPath)) {
    updateJson<PackageJson>(tree, packageJsonPath, (json: PackageJson) => {
      if (!options.importPath) {
        options.importPath = options.name;
      }

      json.name = options.importPath;
      json.version = "0.0.1";

      // If the package is publishable or root/standalone, we should remove the private field.
      if (json.private && (options.publishable || options.rootProject)) {
        json.private = undefined;
      }

      return {
        ...json,
        version: "0.0.1",
        description,
        repository: {
          ...repository,
          directory: options.projectRoot
        },
        type: "module",
        dependencies: {
          ...json.dependencies
        },
        publishConfig: {
          access: "public"
        }
      } as unknown as PackageJson;
    });
  } else {
    writeJson<PackageJson>(tree, packageJsonPath, {
      name: options.importPath,
      version: "0.0.1",
      description,
      repository: {
        ...repository,
        directory: options.projectRoot
      },
      private: !options.publishable || options.rootProject,
      type: "module",
      publishConfig: {
        access: "public"
      }
    } as unknown as PackageJson);
  }

  if (tree.exists("package.json") && options.importPath) {
    updateJson(tree, "package.json", json => ({
      ...json,
      pnpm: {
        ...json?.pnpm,
        overrides: {
          ...json?.pnpm?.overrides,
          [options.importPath ?? ""]: "workspace:*"
        }
      }
    }));
  }

  addTsConfigPath(tree, options.importPath, [
    joinPaths(options.projectRoot, "./src", `index.${options.js ? "js" : "ts"}`)
  ]);
  addTsConfigPath(tree, joinPaths(options.importPath, "/*"), [
    joinPaths(options.projectRoot, "./src", "/*")
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

  const tsconfigPath = joinPaths(options.projectRoot, "tsconfig.json");
  if (tree.exists(tsconfigPath)) {
    updateJson(tree, tsconfigPath, (json: any) => {
      json.composite ??= true;

      return json;
    });
  } else {
    writeJson(tree, tsconfigPath, {
      extends: `${offsetFromRoot(options.projectRoot)}tsconfig.base.json`,
      composite: true,
      compilerOptions: {
        outDir: `${offsetFromRoot(options.projectRoot)}dist/out-tsc`
      },
      files: [],
      include: ["src/**/*.ts", "src/**/*.js"],
      exclude: ["jest.config.ts", "src/**/*.spec.ts", "src/**/*.test.ts"]
    });
  }

  // const lintCallback = await addLint(tree, options);
  // tasks.push(lintCallback);

  await formatFiles(tree);

  return null;
}

export function getOutputPath(
  options: TypeScriptLibraryGeneratorNormalizedSchema
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
  options: TypeScriptLibraryGeneratorNormalizedSchema
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
      ...(options?.tsconfigOptions?.compilerOptions ?? {})
    },
    files: [...(options?.tsconfigOptions?.files ?? [])],
    include: [
      ...(options?.tsconfigOptions?.include ?? []),
      "src/**/*.ts",
      "src/**/*.js",
      "bin/**/*"
    ],
    exclude: [
      ...(options?.tsconfigOptions?.exclude ?? []),
      "jest.config.ts",
      "src/**/*.spec.ts",
      "src/**/*.test.ts"
    ]
  };

  writeJson(tree, joinPaths(options.projectRoot, "tsconfig.json"), tsconfig);
}

export type UnitTestRunner = "jest" | "vitest" | "none" | undefined;
export type TestEnvironment = "jsdom" | "node" | undefined;

export async function normalizeOptions(
  tree: Tree,
  options: TypeScriptLibraryGeneratorSchema
): Promise<TypeScriptLibraryGeneratorNormalizedSchema> {
  if (options.publishable) {
    if (!options.importPath) {
      throw new Error(
        `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`
      );
    }
  }

  let bundler: Bundler = "tsc";
  if (options.publishable === false && options.buildable === false) {
    bundler = "none";
  }

  const { Linter } = ensurePackage("@nx/eslint", nxVersion);
  const {
    projectName,
    names: projectNames,
    projectRoot,
    importPath
  } = await determineProjectNameAndRootOptions(tree, {
    name: options.name,
    projectType: "library",
    directory: options.directory,
    importPath: options.importPath,
    rootProject: options.rootProject
  });
  options.rootProject = projectRoot === ".";

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
    parsedTags: options.tags ? options.tags.split(",").map(s => s.trim()) : [],
    importPath
  } as TypeScriptLibraryGeneratorNormalizedSchema;
}
