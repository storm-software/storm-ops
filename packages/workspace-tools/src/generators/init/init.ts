import { addDependenciesToPackageJson, formatFiles, Tree } from "@nx/devkit";
import { nxVersion } from "../../utils/versions";
import { Schema } from "./schema";

export async function stormInitGenerator(tree: Tree, schema: Schema) {
  const task = addDependenciesToPackageJson(
    tree,
    {
      "nx": nxVersion,
      "@nx/workspace": nxVersion
    },
    {}
  );

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return task;
}

export default stormInitGenerator;
