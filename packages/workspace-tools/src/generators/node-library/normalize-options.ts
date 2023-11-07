import { Tree, ensurePackage, names } from "@nx/devkit";
import { determineProjectNameAndRootOptions } from "@nx/devkit/src/generators/project-name-and-root-utils";
import { NormalizedSchema } from "@nx/js/src/generators/library/library";
import { Bundler } from "@nx/js/src/utils/schema";
import { nxVersion } from "../../utils/versions";
import { NodeLibraryGeneratorSchema } from "./schema";

export async function normalizeOptions(
  tree: Tree,
  options: NodeLibraryGeneratorSchema
): Promise<NormalizedSchema> {
  if (options.publishable) {
    if (!options.importPath) {
      throw new Error(
        `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`
      );
    }
  }

  let bundler: Bundler = "tsc";
  if (options.publishable === false && options.buildable === false) {
    bundler = "none";
  }

  const { Linter } = ensurePackage("@nx/eslint", nxVersion);
  const {
    projectName,
    names: projectNames,
    projectRoot,
    importPath
  } = await determineProjectNameAndRootOptions(tree, {
    name: options.name,
    projectType: "library",
    directory: options.directory,
    importPath: options.importPath,
    projectNameAndRootFormat: options.projectNameAndRootFormat,
    rootProject: options.rootProject,
    callingGenerator: "@nx/js:library"
  });
  options.rootProject = projectRoot === ".";

  const normalized = names(projectNames.projectFileName);
  const fileName = normalized.fileName;

  return {
    js: false,
    pascalCaseFiles: false,
    skipFormat: false,
    skipTsConfig: false,
    includeBabelRc: false,
    unitTestRunner: "jest",
    linter: Linter.EsLint,
    testEnvironment: "node",
    config: "project",
    compiler: "tsc",
    bundler,
    skipTypeCheck: false,
    minimal: false,
    ...options,
    fileName,
    name: projectName,
    projectNames,
    projectRoot,
    parsedTags: options.tags ? options.tags.split(",").map(s => s.trim()) : [],
    importPath
  };
}
