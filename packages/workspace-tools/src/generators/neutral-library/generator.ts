import {
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot
} from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import { withRunGenerator } from "../../base/base-generator";
import {
  normalizeOptions,
  typeScriptLibraryGeneratorFn
} from "../../base/typescript-library-generator";
import type { TypeScriptLibraryGeneratorSchema } from "../../types";
import { NeutralLibraryGeneratorSchema } from "./schema.d";

export async function neutralLibraryGeneratorFn(
  tree: Tree,
  schema: NeutralLibraryGeneratorSchema,
  config?: StormConfig
) {
  const filesDir = joinPathFragments(__dirname, "./files");
  const tsLibraryGeneratorOptions = {
    ...schema,
    platform: "neutral",
    devDependencies: {},
    buildExecutor: "@storm-software/workspace-tools:unbuild"
  } as TypeScriptLibraryGeneratorSchema;

  const options = await normalizeOptions(tree, tsLibraryGeneratorOptions);
  const { className, name, propertyName } = names(
    options.projectNames.projectFileName
  );

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

export default withRunGenerator<NeutralLibraryGeneratorSchema>(
  "TypeScript Library Creator (Neutral Platform)",
  neutralLibraryGeneratorFn
);
