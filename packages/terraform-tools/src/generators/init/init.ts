import { formatFiles, type Tree } from "@nx/devkit";
import { initGenerator as baseInitGenerator } from "@storm-software/workspace-tools";
import type { Schema } from "./schema";

export async function initGenerator(tree: Tree, schema: Schema) {
  const task = baseInitGenerator(tree, schema);

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return task;
}

export default initGenerator;
