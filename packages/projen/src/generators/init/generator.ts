import {
  addDependenciesToPackageJson,
  formatFiles,
  GeneratorCallback,
  readJsonFile,
  runTasksInSerial,
  type Tree,
} from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import {
  initGenerator as baseInitGenerator,
  withRunGenerator,
} from "@storm-software/workspace-tools";
import type { InitGeneratorSchema } from "./schema";

export async function initGeneratorFn(
  tree: Tree,
  options: InitGeneratorSchema,
  config: StormConfig,
) {
  const task = baseInitGenerator(tree, options);

  await runTasksInSerial(addProjenDeps(tree, options))();

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return task;
}

export default withRunGenerator<InitGeneratorSchema>(
  "Initialize Storm Projen workspace",
  initGeneratorFn,
);

function addProjenDeps(
  tree: Tree,
  options: InitGeneratorSchema,
): GeneratorCallback {
  return () => {
    const packageJson = readJsonFile(`${options.directory}/package.json`);
    packageJson.dependencies["projen"] ??= "^0.91.6";

    if (packageJson) {
      addDependenciesToPackageJson(
        tree,
        packageJson.dependencies || {},
        packageJson.devDependencies || {},
      )();
    }
  };
}
