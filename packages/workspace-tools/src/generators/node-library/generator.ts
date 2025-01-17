import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  type Tree
} from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import { withRunGenerator } from "../../base/base-generator";
import {
  normalizeOptions,
  typeScriptLibraryGeneratorFn
} from "../../base/typescript-library-generator";
import { type TypeScriptLibraryGeneratorSchema } from "../../types";
import { typesNodeVersion } from "../../utils/versions";
import type { NodeLibraryGeneratorSchema } from "./schema.d";

export async function nodeLibraryGeneratorFn(
  tree: Tree,
  schema: NodeLibraryGeneratorSchema,
  config?: StormConfig
) {
  const filesDir = joinPathFragments(__dirname, "./files");
  const tsLibraryGeneratorOptions: TypeScriptLibraryGeneratorSchema = {
    ...schema,
    platform: "node",
    devDependencies: {
      "@types/node": typesNodeVersion
    },
    buildExecutor: "@storm-software/workspace-tools:unbuild",
    directory: schema.directory
  };

  const options = await normalizeOptions(tree, tsLibraryGeneratorOptions);
  const { className, name, propertyName } = names(options.name);

  generateFiles(tree, filesDir, options.projectRoot, {
    ...schema,
    dot: ".",
    className,
    name,
    namespace: process.env.STORM_NAMESPACE ?? "storm-software",
    description: schema.description ?? "",
    propertyName,
    js: !!options.js,
    cliCommand: "nx",
    strict: undefined,
    tmpl: "",
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    buildable: options.bundler && options.bundler !== "none",
    hasUnitTestRunner: options.unitTestRunner !== "none"
  });

  await typeScriptLibraryGeneratorFn(tree, tsLibraryGeneratorOptions, config);
  await formatFiles(tree);

  return null;
}

export default withRunGenerator<NodeLibraryGeneratorSchema>(
  "TypeScript Library Creator (NodeJs Platform)",
  nodeLibraryGeneratorFn
);
