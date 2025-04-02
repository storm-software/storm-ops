import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  GeneratorCallback,
  readJsonFile,
  runTasksInSerial,
  type Tree
} from "@nx/devkit";
import { StormWorkspaceConfig } from "@storm-software/config";
import { run } from "@storm-software/config-tools";
import {
  initGenerator as baseInitGenerator,
  withRunGenerator
} from "@storm-software/workspace-tools";
import { readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { getCloudTemplateName } from "../../base/providers";
import type { InitGeneratorSchema } from "./schema";

export async function initGeneratorFn(
  tree: Tree,
  options: InitGeneratorSchema,
  config: StormWorkspaceConfig
) {
  const task = baseInitGenerator(tree, options);

  addProjectConfiguration(tree, options.name || "deployment", {
    root: options.directory || "./deployment",
    projectType: "application",
    sourceRoot: options.directory || "./deployment",
    targets: {
      up: {
        executor: "@nx-extend/pulumi:up",
        options: {}
      },
      preview: {
        executor: "@nx-extend/pulumi:preview",
        options: {}
      },
      refresh: {
        executor: "@nx-extend/pulumi:refresh",
        options: {}
      },
      import: {
        executor: "@nx-extend/pulumi:import",
        options: {}
      }
    },
    tags: ["infra:pulumi"]
  });

  await runTasksInSerial(
    generateNewPulumiProject(tree, options, config),
    loginToPulumi(tree, options, config),
    addPulumiDeps(tree, options),
    cleanupProject(tree, options)
  )();

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return task;
}

export default withRunGenerator<InitGeneratorSchema>(
  "Initialize Storm Pulumi workspace",
  initGeneratorFn
);

function generateNewPulumiProject(
  tree: Tree,
  options: InitGeneratorSchema,
  config: StormWorkspaceConfig
): GeneratorCallback {
  return () => {
    const template = getCloudTemplateName(options.provider);

    run(
      config,
      [
        `pulumi new ${template}`,
        `--name=${options.name || "deployment"}`,
        `--dir=${options.directory || "./deployment"}`,
        options.secretsProvider &&
          `--secrets-provider=${options.secretsProvider}`,
        "--generate-only",
        "--yes",
        "--force"
      ]
        .filter(Boolean)
        .join(" "),
      join(config.workspaceRoot, options.directory || "./deployment"),
      "inherit"
    );
  };
}

function loginToPulumi(
  tree: Tree,
  options: InitGeneratorSchema,
  config: StormWorkspaceConfig
): GeneratorCallback {
  return () => {
    if (!options.login) {
      return;
    }

    if (options.login.startsWith("file://")) {
      options.login = `file://${tree.root}/${
        options.directory || "./deployment"
      }/${options.login.replace("file://", "")}`;
    }

    run(
      config,
      ["pulumi login", options.login].filter(Boolean).join(" "),
      join(config.workspaceRoot, options.directory || "./deployment"),
      "inherit",
      {
        ...process.env,
        PULUMI_EXPERIMENTAL: "true"
      }
    );
  };
}

function addPulumiDeps(
  tree: Tree,
  options: InitGeneratorSchema
): GeneratorCallback {
  return () => {
    const packageJson = readJsonFile(`${options.directory}/package.json`);

    if (packageJson) {
      addDependenciesToPackageJson(tree, {}, packageJson.dependencies || {})();
    }
  };
}

function cleanupProject(
  tree: Tree,
  options: InitGeneratorSchema
): GeneratorCallback {
  return () => {
    const indexTsLocation = join(
      tree.root,
      `${options.directory || "./deployment"}/index.ts`
    );
    tree.write(
      `${options.directory}/pulumi.ts`,
      readFileSync(indexTsLocation).toString()
    );

    // Remove the unneeded files
    unlinkSync(
      join(tree.root, `${options.directory || "./deployment"}/.gitignore`)
    );
    unlinkSync(
      join(tree.root, `${options.directory || "./deployment"}/package.json`)
    );
    unlinkSync(
      join(tree.root, `${options.directory || "./deployment"}/tsconfig.json`)
    );
  };
}
