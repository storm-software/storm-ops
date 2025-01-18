import { formatFiles, type Tree } from "@nx/devkit";
import { initGenerator as baseInitGenerator } from "@storm-software/workspace-tools";
import type { InitGeneratorSchema } from "./schema";

export async function initGenerator(tree: Tree, schema: InitGeneratorSchema) {
  const task = baseInitGenerator(tree, { skipFormat: !!schema.skipFormat });

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return task;
}

export default initGenerator;
