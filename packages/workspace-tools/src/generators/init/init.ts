import { addDependenciesToPackageJson, formatFiles, Tree } from "@nx/devkit";
import { nxVersion } from "../../utils/versions";
import { Schema } from "./schema";

export async function stormInitGenerator(tree: Tree, schema: Schema) {
  const task = addDependenciesToPackageJson(
    tree,
    {
      "nx": nxVersion,
      "@nx/workspace": nxVersion,
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

export default stormInitGenerator;
