import {
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree
} from "@nx/devkit";
import { StormWorkspaceConfig } from "@storm-software/config";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { withRunGenerator } from "../../base/base-generator";
import {
  normalizeOptions,
  typeScriptLibraryGeneratorFn,
  TypeScriptLibraryGeneratorOptions
} from "../../base/typescript-library-generator";
import { NeutralLibraryGeneratorSchema } from "./schema.d";

export async function neutralLibraryGeneratorFn(
  tree: Tree,
  schema: NeutralLibraryGeneratorSchema,
  config?: StormWorkspaceConfig
) {
  const filesDir = joinPaths(
    __dirname,
    "src",
    "generators",
    "neutral-library",
    "files"
  );
  const tsLibraryGeneratorOptions = {
    ...schema,
    platform: "neutral",
    devDependencies: {},
    buildExecutor: "@storm-software/workspace-tools:unbuild"
  } as TypeScriptLibraryGeneratorOptions;

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
  neutralLibraryGeneratorFn,
  {
    hooks: {
      applyDefaultOptions: (
        options: NeutralLibraryGeneratorSchema
      ): NeutralLibraryGeneratorSchema => {
        options.description ??=
          "A library used by Storm Software to support either browser or NodeJs applications";
        options.platform = "neutral";

        return options;
      }
    }
  }
);
