import { addDependenciesToPackageJson, formatFiles, Tree } from "@nx/devkit";
import {
  eslintVersion,
  lintStagedVersion,
  nxVersion,
  prettierPackageJsonVersion,
  prettierPrismaVersion,
  prettierVersion,
  semanticReleaseVersion,
  swcCliVersion,
  swcCoreVersion,
  swcHelpersVersion,
  swcNodeVersion,
  tsLibVersion,
  tsupVersion,
  typescriptVersion,
  typesNodeVersion,
  verdaccioVersion
} from "../../utils/versions";
import { Schema } from "./schema";

export async function stormInitGenerator(tree: Tree, schema: Schema) {
  const task = addDependenciesToPackageJson(
    tree,
    {
      "nx": nxVersion,
      "@nx/workspace": nxVersion,
      "tsup": tsupVersion,
      "prettier": prettierVersion,
      "prettier-plugin-packagejson": prettierPackageJsonVersion,
      "prettier-plugin-prisma": prettierPrismaVersion,
      "@swc/cli": swcCliVersion,
      "@swc/core": swcCoreVersion,
      "@swc/helpers": swcHelpersVersion,
      "@swc-node/register": swcNodeVersion,
      "tslib": tsLibVersion,
      "@types/node": typesNodeVersion,
      "verdaccio": verdaccioVersion,
      "typescript": typescriptVersion,
      "eslint": eslintVersion,
      "lint-staged": lintStagedVersion,
      "semantic-release": semanticReleaseVersion
    },
    {}
  );

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return task;
}

export default stormInitGenerator;
