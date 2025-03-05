import defu from "defu";
import { pluginNx } from "../plugins";
import type { OptionsNx, TypedFlatConfigItem } from "../types";

/**
 * Config for Nx monorepos
 */
export async function nx(
  options: OptionsNx = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    depsCheck = false,
    depsCheckSeverity = "error",
    moduleBoundaries,
    ignoredDependencies = [],
    ignoredFiles = [],
    checkObsoleteDependencies = true
  } = options;

  return [
    {
      name: "storm/nx/setup",
      plugins: {
        "@nx": pluginNx
      }
    },
    {
      name: "storm/nx/schema",
      files: ["**/executors/**/schema.json", "**/generators/**/schema.json"],
      rules: {
        "@nx/workspace/valid-schema-description": "error"
      }
    },
    {
      name: "storm/nx/dependency-check",
      files: ["**/package.json"],
      rules:
        depsCheck !== false
          ? {
              "@nx/dependency-checks": [
                depsCheckSeverity,
                defu(depsCheck, {
                  buildTargets: ["build-base", "build"],
                  ignoredDependencies,
                  ignoredFiles,
                  checkMissingDependencies: true,
                  checkObsoleteDependencies,
                  checkVersionMismatches: true,
                  includeTransitiveDependencies: false,
                  useLocalPathsForWorkspaceDependencies: true
                })
              ]
            }
          : {}
    },
    {
      name: "storm/nx/module-boundaries",
      files: ["**/nx.json", "**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
      rules:
        moduleBoundaries !== false
          ? {
              "@nx/enforce-module-boundaries": [
                "error",
                defu(moduleBoundaries ?? {}, {
                  enforceBuildableLibDependency: false,
                  checkDynamicDependenciesExceptions: [".*"],
                  allow: [],
                  depConstraints: [
                    {
                      sourceTag: "*",
                      onlyDependOnLibsWithTags: ["*"]
                    }
                  ]
                })
              ]
            }
          : {}
    }
  ];
}
