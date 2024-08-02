import {
  addDependenciesToPackageJson,
  formatFiles,
  type Tree
} from "@nx/devkit";
import type { Schema } from "./schema";

export async function initGenerator(tree: Tree, schema: Schema) {
  const task = addDependenciesToPackageJson(
    tree,
    {
      nx: "^19.5.6",
      "@nx/workspace": "^19.5.6",
      "@nx/js": "^19.5.6",
      "@storm-software/eslint": "latest",
      "@storm-software/prettier": "latest",
      "@storm-software/config-tools": "latest",
      "@storm-software/testing-tools": "latest",
      "@storm-software/git-tools": "latest",
      "@storm-software/linting-tools": "latest"
    },
    {}
  );

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return task;
}

export default initGenerator;
