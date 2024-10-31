import {
  convertNxGenerator,
  ensurePackage,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  joinPathFragments,
  names,
  readProjectConfiguration,
  runTasksInSerial,
  Tree,
  updateJson,
  updateProjectConfiguration
} from "@nx/devkit";
import { determineProjectNameAndRootOptions } from "@nx/devkit/src/generators/project-name-and-root-utils";
import { applicationGenerator as nodeApplicationGenerator } from "@nx/node";
import { nxVersion } from "@nx/node/src/utils/versions";
import { StormConfig } from "@storm-software/config";
import { join } from "path";
import initGenerator from "../init/generator";
import { getAccountId } from "./libs/get-account-id";
import { vitestImports } from "./libs/vitest-imports";
import { vitestScript } from "./libs/vitest-script";
import type { NormalizedSchema, WorkerGeneratorSchema } from "./schema";

export async function applicationGenerator(
  tree: Tree,
  schema: WorkerGeneratorSchema
) {
  const {
    getStopwatch,
    writeDebug,
    writeError,
    writeFatal,
    writeInfo,
    writeTrace,
    findWorkspaceRoot,
    loadStormConfig
  } = await import("@storm-software/config-tools");

  const stopwatch = getStopwatch("Storm Worker generator");

  let config: StormConfig | undefined;
  try {
    writeInfo(`⚡ Running the Storm Worker generator...\n\n`, config);

    const workspaceRoot = findWorkspaceRoot();

    writeDebug(
      `Loading the Storm Config from environment variables and storm.json file...
- workspaceRoot: ${workspaceRoot}`,
      config
    );

    config = await loadStormConfig(workspaceRoot);
    writeTrace(
      `Loaded Storm config into env: \n${Object.keys(process.env)
        .map(key => ` - ${key}=${JSON.stringify(process.env[key])}`)
        .join("\n")}`,
      config
    );

    const options = await normalizeOptions(tree, schema, config);
    const tasks: GeneratorCallback[] = [];

    // Set up the needed packages.
    tasks.push(
      await initGenerator(tree, {
        ...options,
        skipFormat: true
      })
    );

    tasks.push(
      await nodeApplicationGenerator(tree, {
        ...options,
        framework: "none",
        skipFormat: true,
        unitTestRunner:
          options.unitTestRunner == "vitest" ? "none" : options.unitTestRunner,
        e2eTestRunner: "none",
        name: schema.name
      })
    );

    if (options.unitTestRunner === "vitest") {
      const { vitestGenerator, createOrEditViteConfig } = ensurePackage(
        "@nx/vite",
        nxVersion
      );
      const vitestTask = await vitestGenerator(tree, {
        project: options.name,
        uiFramework: "none",
        coverageProvider: "v8",
        skipFormat: true,
        testEnvironment: "node"
      });
      tasks.push(vitestTask);
      createOrEditViteConfig(
        tree,
        {
          project: options.name,
          includeLib: false,
          includeVitest: true,
          testEnvironment: "node"
        },
        true
      );
    }

    addCloudflareFiles(tree, options);
    updateTsAppConfig(tree, options);
    addTargets(tree, options);

    if (options.unitTestRunner === "none") {
      removeTestFiles(tree, options);
    }

    if (!options.skipFormat) {
      await formatFiles(tree);
    }

    if (options.template === "hono") {
      tasks.push(() => {
        const packageJsonPath = joinPathFragments(
          options.directory ?? "",
          "package.json"
        );
        if (tree.exists(packageJsonPath)) {
          updateJson(tree, packageJsonPath, json => ({
            ...json,
            dependencies: {
              hono: "4.4.0",
              ...json?.dependencies
            }
          }));
        }
      });
    }

    return runTasksInSerial(...tasks);
  } catch (error) {
    return () => {
      writeFatal(
        "A fatal error occurred while running the generator - the process was forced to terminate",
        config
      );
      writeError(
        `An exception was thrown in the generator's process \n - Details: ${error.message}\n - Stacktrace: ${error.stack}`,
        config
      );
    };
  } finally {
    stopwatch();
  }
}

// Modify the default tsconfig.app.json generate by the node application generator to support workers.
function updateTsAppConfig(tree: Tree, options: NormalizedSchema) {
  updateJson(tree, join(options.appProjectRoot, "tsconfig.app.json"), json => {
    json.compilerOptions = {
      ...json.compilerOptions,
      esModuleInterop: true,
      target: "es2021",
      lib: ["es2021"],
      module: "es2022",
      moduleResolution: "node",
      resolveJsonModule: true,

      allowJs: true,
      checkJs: false,
      noEmit: true,

      isolatedModules: true,
      allowSyntheticDefaultImports: true,
      forceConsistentCasingInFileNames: true,

      strict: true,
      skipLibCheck: true
    };
    json.compilerOptions.types = [
      ...json.compilerOptions.types,
      "@cloudflare/workers-types"
    ];
    return json;
  });
}

// Adds the needed files from the common folder and the selected template folder
function addCloudflareFiles(tree: Tree, options: NormalizedSchema) {
  // Delete main.ts. Workers convention is a file named `index.js` or `index.ts
  tree.delete(join(options.appProjectRoot, "src/main.ts"));

  // General configuration files for workers
  generateFiles(
    tree,
    join(__dirname, "./files/common"),
    options.appProjectRoot,
    {
      ...options,
      tmpl: "",
      name: options.name,
      accountId: options.accountId ? getAccountId(options.accountId) : "",
      vitestScript: options.unitTestRunner === "vitest" ? vitestScript : ""
    }
  );

  // Generate template files with workers code
  if (options.template && options.template !== "none") {
    generateFiles(
      tree,
      join(__dirname, `./files/${options.template}`),
      join(options.appProjectRoot, "src"),
      {
        ...options,
        tmpl: "",
        name: options.name,
        accountId: options.accountId ? getAccountId(options.accountId) : "",
        vitestScript: options.unitTestRunner === "vitest" ? vitestScript : "",
        vitestImports: options.unitTestRunner === "vitest" ? vitestImports : ""
      }
    );
  }
}

// Adds the targets to the project configuration
function addTargets(tree: Tree, options: NormalizedSchema) {
  try {
    const projectConfiguration = readProjectConfiguration(tree, options.name);

    projectConfiguration.targets = {
      ...(projectConfiguration.targets ?? {}),
      serve: {
        executor: "@storm-software/cloudflare-tools:serve",
        options: {
          port: options.port
        }
      },
      "nx-release-publish": {
        executor: "@storm-software/cloudflare-tools:cloudflare-publish"
      }
    };

    if (projectConfiguration.targets.build) {
      delete projectConfiguration.targets.build;
    }

    updateProjectConfiguration(tree, options.name, projectConfiguration);
  } catch (e) {
    console.error(e);
  }
}

function removeTestFiles(tree: Tree, options: NormalizedSchema) {
  tree.delete(join(options.appProjectRoot, "src", "index.test.ts"));
}

// Transform the options to the normalized schema. Loads defaults options.
async function normalizeOptions(
  host: Tree,
  options: WorkerGeneratorSchema,
  config?: StormConfig
): Promise<NormalizedSchema> {
  const { projectName: appProjectName, projectRoot: appProjectRoot } =
    await determineProjectNameAndRootOptions(host, {
      name: options.name,
      projectType: "application",
      directory: options.directory,
      rootProject: options.rootProject
    });
  options.rootProject = appProjectRoot === ".";

  return {
    addPlugin: process.env.NX_ADD_PLUGINS !== "false",
    accountId: config?.cloudflareAccountId
      ? config.cloudflareAccountId
      : undefined,
    ...options,
    name: names(appProjectName).fileName,
    frontendProject: options.frontendProject
      ? names(options.frontendProject).fileName
      : undefined,
    appProjectRoot,
    unitTestRunner: options.unitTestRunner ?? "vitest",
    rootProject: options.rootProject ?? false,
    template: options.template ?? "fetch-handler",
    port: options.port ?? 3000
  };
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
