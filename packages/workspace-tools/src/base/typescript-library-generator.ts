import {
  type GeneratorCallback,
  type ProjectConfiguration,
  type Tree,
  addDependenciesToPackageJson,
  addProjectConfiguration,
  ensurePackage,
  formatFiles,
  joinPathFragments,
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
import setupVerdaccio from "@nx/js/src/generators/setup-verdaccio/generator";
import type { PackageJson } from "nx/src/utils/package-json";
import type {
  TypeScriptLibraryGeneratorNormalizedSchema,
  TypeScriptLibraryGeneratorSchema
} from "../../declarations.d";
import { UnbuildExecutorSchema } from "../executors/unbuild/schema";
import { addProjectTag, ProjectTagConstants } from "../utils/project-tags";
import { nxVersion } from "../utils/versions";

type TypeScriptLibraryProjectConfig = ProjectConfiguration & {
  targets: {
    build: { options: Partial<UnbuildExecutorSchema> };
  } & Record<string, any>;
};

export async function typeScriptLibraryGeneratorFn(
  tree: Tree,
  schema: TypeScriptLibraryGeneratorSchema
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
    sourceRoot: joinPathFragments(options.directory ?? "", "src"),
    targets: {
      build: {
        executor: schema.buildExecutor,
        outputs: ["{options.outputPath}"],
        options: {
          entry: joinPathFragments(options.projectRoot, "src", "index.ts"),
          outputPath: getOutputPath(options),
          tsConfig: joinPathFragments(options.projectRoot, "tsconfig.json"),
          project: joinPathFragments(options.projectRoot, "package.json"),
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
    projectConfig.targets.build.options.platform = schema.platform;
  }

  addProjectTag(
    projectConfig,
    ProjectTagConstants.Platform.TAG_ID,
    projectConfig.targets.build.options.platform === "node"
      ? ProjectTagConstants.Platform.NODE
      : projectConfig.targets.build.options.platform === "worker"
        ? ProjectTagConstants.Platform.WORKER
        : projectConfig.targets.build.options.platform === "browser"
          ? ProjectTagConstants.Platform.BROWSER
          : ProjectTagConstants.Platform.NEUTRAL,
    { overwrite: true }
  );

  createProjectTsConfigJson(tree, options);
  addProjectConfiguration(tree, options.name, projectConfig);

  let repository = {
    type: "github",
    url: "https://github.com/storm-software/storm-stack.git"
  };

  let description =
    schema.description ??
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

  const packageJsonPath = joinPathFragments(
    options.projectRoot,
    "package.json"
  );
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
    joinPathFragments(
      options.projectRoot,
      "./src",
      `index.${options.js ? "js" : "ts"}`
    )
  ]);
  addTsConfigPath(tree, joinPathFragments(options.importPath, "/*"), [
    joinPathFragments(options.projectRoot, "./src", "/*")
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

  const tsconfigPath = joinPathFragments(options.projectRoot, "tsconfig.json");
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

// export async function addLint(
//   tree: Tree,
//   options: AddLintOptions
// ): Promise<GeneratorCallback> {
//   const { lintProjectGenerator } = ensurePackage("@nx/eslint", nxVersion);
//   const { mapLintPattern } =
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     require("@nx/eslint/src/generators/lint-project/lint-project");
//   const projectConfiguration = readProjectConfiguration(tree, options.name);
//   const task = lintProjectGenerator(tree, {
//     project: options.name,
//     linter: options.linter,
//     skipFormat: true,
//     tsConfigPaths: [joinPathFragments(options.projectRoot, "tsconfig.json")],
//     unitTestRunner: options.unitTestRunner,
//     eslintFilePatterns: [
//       mapLintPattern(
//         options.projectRoot,
//         options.js ? "js" : "ts",
//         options.rootProject
//       )
//     ],
//     setParserOptionsProject: options.setParserOptionsProject,
//     rootProject: options.rootProject
//   });
//   const {
//     addOverrideToLintConfig,
//     lintConfigHasOverride,
//     isEslintConfigSupported,
//     updateOverrideInLintConfig
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//   } = require("@nx/eslint/src/generators/utils/eslint-file");

//   // if config is not supported, we don't need to do anything
//   if (!isEslintConfigSupported(tree)) {
//     return task;
//   }

//   addOverrideToLintConfig(tree, "", {
//     files: ["*.json"],
//     parser: "jsonc-eslint-parser",
//     rules: {
//       "@nx/dependency-checks": [
//         "error",
//         {
//           "buildTargets": ["build"],
//           "ignoredFiles": [
//             "{projectRoot}/esbuild.config.{js,ts,mjs,mts}",
//             "{projectRoot}/jest.config.ts"
//           ],
//           "checkMissingDependencies": true,
//           "checkObsoleteDependencies": true,
//           "checkVersionMismatches": false
//         }
//       ]
//     }
//   });

//   // If project lints package.json with @nx/dependency-checks, then add ignore files for
//   // build configuration files such as vite.config.ts. These config files need to be
//   // ignored, otherwise we will errors on missing dependencies that are for dev only.
//   if (
//     lintConfigHasOverride(
//       tree,
//       projectConfiguration.root,
//       (o: {
//         files: {
//           some: (arg0: (f: any) => any) => any;
//           match: (arg0: RegExp) => any;
//         };
//       }) =>
//         Array.isArray(o.files)
//           ? o.files.some(f => f.match(/\.json$/))
//           : !!o.files?.match(/\.json$/),
//       true
//     )
//   ) {
//     updateOverrideInLintConfig(
//       tree,
//       projectConfiguration.root,
//       (o: { rules: { [x: string]: any } }) =>
//         o.rules?.["@nx/dependency-checks"],
//       (o: { rules: { [x: string]: any[] } }) => {
//         const value = o.rules["@nx/dependency-checks"];
//         let ruleSeverity: string;
//         let ruleOptions: any;
//         if (Array.isArray(value)) {
//           ruleSeverity = value[0];
//           ruleOptions = value[1];
//         } else {
//           ruleSeverity = value ?? "error";
//           ruleOptions = {};
//         }

//         if (options.bundler === "esbuild") {
//           ruleOptions.ignoredFiles = [
//             "{projectRoot}/esbuild.config.{js,ts,mjs,mts}"
//           ];
//           o.rules["@nx/dependency-checks"] = [ruleSeverity, ruleOptions];
//         }
//         return o;
//       }
//     );
//   }
//   return task;
// }

export function getOutputPath(
  options: TypeScriptLibraryGeneratorNormalizedSchema
) {
  const parts = ["dist"];
  if (options.projectRoot === ".") {
    parts.push(options.name);
  } else {
    parts.push(options.projectRoot);
  }
  return joinPathFragments(...parts);
}

export function createProjectTsConfigJson(
  tree: Tree,
  options: TypeScriptLibraryGeneratorNormalizedSchema
) {
  const tsconfig = {
    extends: options.rootProject
      ? undefined
      : getRelativePathToRootTsConfig(tree, options.projectRoot),
    ...(options?.tsConfigOptions ?? {}),
    compilerOptions: {
      ...(options.rootProject ? tsConfigBaseOptions : {}),
      outDir: joinPathFragments(
        offsetFromRoot(options.projectRoot),
        "dist/out-tsc"
      ),
      noEmit: true,
      ...(options?.tsConfigOptions?.compilerOptions ?? {})
    },
    files: [...(options?.tsConfigOptions?.files ?? [])],
    include: [
      ...(options?.tsConfigOptions?.include ?? []),
      "src/**/*.ts",
      "src/**/*.js",
      "bin/**/*"
    ],
    exclude: [
      ...(options?.tsConfigOptions?.exclude ?? []),
      "jest.config.ts",
      "src/**/*.spec.ts",
      "src/**/*.test.ts"
    ]
  };

  writeJson(
    tree,
    joinPathFragments(options.projectRoot, "tsconfig.json"),
    tsconfig
  );
}

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

  let bundler = "tsc";
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
    unitTestRunner: "jest",
    linter: Linter.EsLint,
    testEnvironment: "node",
    config: "project",
    compiler: "tsc",
    bundler,
    skipTypeCheck: false,
    minimal: false,
    ...options,
    fileName,
    name: projectName,
    projectNames,
    projectRoot,
    parsedTags: options.tags ? options.tags.split(",").map(s => s.trim()) : [],
    importPath
  };
}
