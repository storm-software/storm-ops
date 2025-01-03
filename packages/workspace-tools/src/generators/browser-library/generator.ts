import {
  type Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot
} from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import type { TypeScriptLibraryGeneratorSchema } from "../../../declarations.d";
import { withRunGenerator } from "../../base/base-generator";
import {
  normalizeOptions,
  typeScriptLibraryGeneratorFn
} from "../../base/typescript-library-generator";
import type { BrowserLibraryGeneratorSchema } from "./schema";

export async function browserLibraryGeneratorFn(
  tree: Tree,
  schema: BrowserLibraryGeneratorSchema,
  config?: StormConfig
) {
  const filesDir = joinPathFragments(__dirname, "./files");
  const tsLibraryGeneratorOptions: TypeScriptLibraryGeneratorSchema = {
    ...schema,
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
    buildExecutor: "@storm-software/workspace-tools:unbuild"
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
  browserLibraryGeneratorFn
);
