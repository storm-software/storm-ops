import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  updateJson,
  writeJson
} from "@nx/devkit";
import { getRelativePathToRootTsConfig, tsConfigBaseOptions } from "@nx/js";
import jsInitGenerator from "@nx/js/src/generators/init/init";
import { NormalizedSchema } from "@nx/js/src/generators/library/library";
import setupVerdaccio from "@nx/js/src/generators/setup-verdaccio/generator";
import { PackageJson } from "nx/src/utils/package-json";
import { join } from "path";
import { typesNodeVersion } from "../../utils/versions";
import { normalizeOptions } from "./normalize-options";
import { NodeLibraryGeneratorSchema } from "./schema";

export async function nodeLibraryGenerator(
  tree: Tree,
  schema: NodeLibraryGeneratorSchema
) {
  const filesDir = join(__dirname, "./files");
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
          main: join(options.projectRoot, "src/index.ts"),
          tsConfig: join(options.projectRoot, "tsconfig.json"),
          project: join(options.projectRoot, "package.json")
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

  const packageJsonPath = joinPathFragments(
    options.projectRoot,
    "package.json"
  );

  updateJson<PackageJson>(tree, packageJsonPath, (json: PackageJson) => {
    json.name = options.importPath;
    json.version = "0.0.1";
    // If the package is publishable or root/standalone, we should remove the private field.
    if (json.private && (options.publishable || options.rootProject)) {
      delete json.private;
    }
    return {
      ...json,
      files: ["build", "src"],
      type: "module",
      types: "legacy/index.d.ts",
      main: "legacy/index.cjs",
      module: "legacy/index.js",
      exports: {
        ".": {
          import: {
            types: "./modern/index.d.ts",
            default: "./modern/index.js"
          },
          require: {
            types: "./modern/index.d.cts",
            default: "./modern/index.cjs"
          }
        },
        "./package.json": "./package.json"
      },
      sideEffects: false,
      dependencies: {
        ...json.dependencies
      },
      publishConfig: {
        access: "public"
      }
    } as unknown as PackageJson;
  });

  await formatFiles(tree);
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
