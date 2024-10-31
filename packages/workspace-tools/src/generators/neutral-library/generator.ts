import {
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot
} from "@nx/devkit";
import type { TypeScriptLibraryGeneratorSchema } from "../../../declarations.d";
import { withRunGenerator } from "../../base/base-generator";
import {
  normalizeOptions,
  typeScriptLibraryGeneratorFn
} from "../../base/typescript-library-generator";
import { NeutralLibraryGeneratorSchema } from "./schema";

export async function neutralLibraryGeneratorFn(
  tree: Tree,
  schema: NeutralLibraryGeneratorSchema
) {
  const filesDir = joinPathFragments(__dirname, "./files");
  const tsLibraryGeneratorOptions = {
    ...schema,
    platform: "neutral",
    devDependencies: {},
    buildExecutor: "@storm-software/workspace-tools:tsup-neutral"
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

  await typeScriptLibraryGeneratorFn(tree, tsLibraryGeneratorOptions);
  await formatFiles(tree);

  return null;
}

export default withRunGenerator<NeutralLibraryGeneratorSchema>(
  "TypeScript Library Creator (Neutral Platform)",
  neutralLibraryGeneratorFn
);
