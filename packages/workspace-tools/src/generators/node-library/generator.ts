import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
  addProjectConfiguration,
  ensurePackage,
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  readJson,
  readProjectConfiguration,
  updateJson,
  writeJson
} from "@nx/devkit";
import {
  addTsConfigPath,
  getRelativePathToRootTsConfig,
  tsConfigBaseOptions
} from "@nx/js";
import jsInitGenerator from "@nx/js/src/generators/init/init";
import {
  AddLintOptions,
  NormalizedSchema
} from "@nx/js/src/generators/library/library";
import setupVerdaccio from "@nx/js/src/generators/setup-verdaccio/generator";
import { PackageJson } from "nx/src/utils/package-json";
import { nxVersion, typesNodeVersion } from "../../utils/versions";
import { normalizeOptions } from "./normalize-options";
import { NodeLibraryGeneratorSchema } from "./schema";

export async function nodeLibraryGenerator(
  tree: Tree,
  schema: NodeLibraryGeneratorSchema
) {
  const filesDir = joinPathFragments(__dirname, "./files");
  const options = await normalizeOptions(tree, schema);

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
        "@types/node": typesNodeVersion
      }
    )
  );

  if (options.publishable) {
    tasks.push(await setupVerdaccio(tree, { ...options, skipFormat: true }));
  }

  const { className, name, propertyName } = names(
    options.projectNames.projectFileName
  );

  createProjectTsConfigJson(tree, options);
  addProjectConfiguration(tree, options.name, {
    root: options.directory,
    projectType: "library",
    sourceRoot: `${options.directory}/src`,
    targets: {
      build: {
        executor: "@storm-software/workspace-tools:tsup",
        outputs: ["{options.outputPath}"],
        options: {
          outputPath: getOutputPath(options),
          tsConfig: joinPathFragments(options.projectRoot, "tsconfig.json"),
          project: joinPathFragments(options.projectRoot, "package.json"),
          defaultConfiguration: "production",
          configurations: {
            production: {
              debug: false
            },
            development: {
              debug: true
            }
          }
        }
      },
      lint: {},
      test: {}
    }
  });

  generateFiles(tree, filesDir, options.projectRoot, {
    ...options,
    dot: ".",
    className,
    name,
    propertyName,
    js: !!options.js,
    cliCommand: "nx",
    strict: undefined,
    tmpl: "",
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    buildable: options.bundler && options.bundler !== "none",
    hasUnitTestRunner: options.unitTestRunner !== "none"
  });

  let repository = {
    type: "github",
    url: "https://github.com/storm-software/storm-stack.git"
  };

  let description =
    "⚡ A Storm package used to create modern, scalable web applications.";

  if (tree.exists("package.json")) {
    const packageJson = readJson<{
      repository: any;
      description: string;
    }>(tree, "package.json");

    packageJson?.repository && (repository = packageJson.repository);
    packageJson?.description && (description = packageJson.description);
  }

  const packageJsonPath = joinPathFragments(
    options.projectRoot,
    "package.json"
  );
  if (tree.exists(packageJsonPath)) {
    updateJson<PackageJson>(tree, packageJsonPath, (json: PackageJson) => {
      json.name = options.importPath;
      json.version = "0.0.1";
      // If the package is publishable or root/standalone, we should remove the private field.
      if (json.private && (options.publishable || options.rootProject)) {
        delete json.private;
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

  if (tree.exists("package.json")) {
    updateJson(tree, "package.json", json => ({
      ...json,
      pnpm: {
        ...json?.pnpm,
        override: {
          ...json?.pnpm?.override,
          [options.importPath]: "workspace:*"
        }
      }
    }));
  }

  addTsConfigPath(tree, options.importPath, [
    joinPathFragments(
      options.projectRoot,
      "./src",
      "index." + (options.js ? "js" : "ts")
    )
  ]);
  addTsConfigPath(tree, joinPathFragments(options.importPath, "/*"), [
    joinPathFragments(options.projectRoot, "./src", "/*")
  ]);

  const lintCallback = await addLint(tree, options);
  tasks.push(lintCallback);

  await formatFiles(tree);
}

async function addLint(
  tree: Tree,
  options: AddLintOptions
): Promise<GeneratorCallback> {
  const { lintProjectGenerator } = ensurePackage("@nx/eslint", nxVersion);
  const { mapLintPattern } =
    // nx-ignore-next-line
    require("@nx/eslint/src/generators/lint-project/lint-project");
  const projectConfiguration = readProjectConfiguration(tree, options.name);
  const task = lintProjectGenerator(tree, {
    project: options.name,
    linter: options.linter,
    skipFormat: true,
    tsConfigPaths: [joinPathFragments(options.projectRoot, "tsconfig.json")],
    unitTestRunner: options.unitTestRunner,
    eslintFilePatterns: [
      mapLintPattern(
        options.projectRoot,
        options.js ? "js" : "ts",
        options.rootProject
      )
    ],
    setParserOptionsProject: options.setParserOptionsProject,
    rootProject: options.rootProject
  });
  const {
    addOverrideToLintConfig,
    lintConfigHasOverride,
    isEslintConfigSupported,
    updateOverrideInLintConfig
    // nx-ignore-next-line
  } = require("@nx/eslint/src/generators/utils/eslint-file");

  // if config is not supported, we don't need to do anything
  if (!isEslintConfigSupported(tree)) {
    return task;
  }

  // Also update the root ESLint config. The lintProjectGenerator will not generate it for root projects.
  // But we need to set the package.json checks.
  if (options.rootProject) {
    addOverrideToLintConfig(tree, "", {
      files: ["*.json"],
      parser: "jsonc-eslint-parser",
      rules: {
        "@nx/dependency-checks": "error"
      }
    });
  }

  // If project lints package.json with @nx/dependency-checks, then add ignore files for
  // build configuration files such as vite.config.ts. These config files need to be
  // ignored, otherwise we will errors on missing dependencies that are for dev only.
  if (
    lintConfigHasOverride(
      tree,
      projectConfiguration.root,
      o =>
        Array.isArray(o.files)
          ? o.files.some(f => f.match(/\.json$/))
          : !!o.files?.match(/\.json$/),
      true
    )
  ) {
    updateOverrideInLintConfig(
      tree,
      projectConfiguration.root,
      o => o.rules?.["@nx/dependency-checks"],
      o => {
        const value = o.rules["@nx/dependency-checks"];
        let ruleSeverity: string;
        let ruleOptions: any;
        if (Array.isArray(value)) {
          ruleSeverity = value[0];
          ruleOptions = value[1];
        } else {
          ruleSeverity = value;
          ruleOptions = {};
        }

        if (options.bundler === "esbuild") {
          ruleOptions.ignoredFiles = [
            "{projectRoot}/esbuild.config.{js,ts,mjs,mts}"
          ];
          o.rules["@nx/dependency-checks"] = [ruleSeverity, ruleOptions];
        }
        return o;
      }
    );
  }
  return task;
}

function getOutputPath(options: NormalizedSchema) {
  const parts = ["dist"];
  if (options.projectRoot === ".") {
    parts.push(options.name);
  } else {
    parts.push(options.projectRoot);
  }
  return joinPathFragments(...parts);
}

function createProjectTsConfigJson(tree: Tree, options: NormalizedSchema) {
  const tsconfig = {
    extends: options.rootProject
      ? undefined
      : getRelativePathToRootTsConfig(tree, options.projectRoot),
    compilerOptions: {
      ...(options.rootProject ? tsConfigBaseOptions : {}),
      outDir: joinPathFragments(
        offsetFromRoot(options.projectRoot),
        "dist/out-tsc"
      ),
      noEmit: true
    },
    files: [],
    include: ["src/**/*.ts", "src/**/*.js", "bin/**/*"],
    exclude: ["jest.config.ts", "src/**/*.spec.ts", "src/**/*.test.ts"]
  };

  writeJson(
    tree,
    joinPathFragments(options.projectRoot, "tsconfig.json"),
    tsconfig
  );
}

export default nodeLibraryGenerator;
