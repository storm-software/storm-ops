import {
  type Tree,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot
} from "@nx/devkit";
import { StormWorkspaceConfig } from "@storm-software/config";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { withRunGenerator } from "../../base/base-generator";
import {
  normalizeOptions,
  typeScriptLibraryGeneratorFn,
  TypeScriptLibraryGeneratorOptions
} from "../../base/typescript-library-generator";
import type { BrowserLibraryGeneratorSchema } from "./schema.d";

export async function browserLibraryGeneratorFn(
  tree: Tree,
  schema: BrowserLibraryGeneratorSchema,
  config?: StormWorkspaceConfig
) {
  const filesDir = joinPaths(
    __dirname,
    "src",
    "generators",
    "browser-library",
    "files"
  );
  const tsLibraryGeneratorOptions: TypeScriptLibraryGeneratorOptions = {
    buildExecutor: "@storm-software/workspace-tools:unbuild",
    platform: "browser",
    devDependencies: {
      "@types/react": "^18.3.6",
      "@types/react-dom": "^18.3.0"
    },
    peerDependencies: {
      react: "^18.3.0",
      "react-dom": "^18.3.0",
      "react-native": "*"
    },
    peerDependenciesMeta: {
      "react-dom": {
        optional: true
      },
      "react-native": {
        optional: true
      }
    },
    ...schema,
    description: schema.description!,
    directory: schema.directory
  };

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
    hasUnitTestRunner: options.unitTestRunner !== "none",
    tsConfigOptions: {
      compilerOptions: {
        jsx: "react",
        types: [
          "node",
          "@nx/react/typings/cssmodule.d.ts",
          "@nx/react/typings/image.d.ts"
        ]
      }
    }
  });

  await typeScriptLibraryGeneratorFn(tree, tsLibraryGeneratorOptions, config);
  await formatFiles(tree);

  return null;
}

export default withRunGenerator<BrowserLibraryGeneratorSchema>(
  "TypeScript Library Creator (Browser Platform)",
  browserLibraryGeneratorFn,
  {
    hooks: {
      applyDefaultOptions: (
        options: BrowserLibraryGeneratorSchema
      ): BrowserLibraryGeneratorSchema => {
        options.description ??=
          "A library used by Storm Software to support browser applications";
        options.platform ??= "browser";

        return options;
      }
    }
  }
);
