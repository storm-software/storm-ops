import defu from "defu";
import { pluginNx } from "../plugins";
import type { OptionsNx, TypedFlatConfigItem } from "../types";

/**
 * Config for Nx monorepos
 */
export async function nx(
  options: OptionsNx = {}
): Promise<TypedFlatConfigItem[]> {
  const { depsCheck, moduleBoundaries } = options;

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
      rules: {
        "@nx/dependency-checks": [
          "error",
          defu(depsCheck ?? {}, {
            buildTargets: ["build-base", "build"],
            ignoredDependencies: [],
            ignoredFiles: [],
            checkMissingDependencies: true,
            checkObsoleteDependencies: false,
            checkVersionMismatches: true,
            includeTransitiveDependencies: false,
            useLocalPathsForWorkspaceDependencies: true
          })
        ]
      }
    },
    {
      name: "storm/nx/module-boundaries",
      files: ["**/nx.json", "**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
      rules:
        moduleBoundaries !== false
          ? {
              "@nx/enforce-module-boundaries": [
                "error",
                moduleBoundaries ?? {
                  enforceBuildableLibDependency: false,
                  checkDynamicDependenciesExceptions: [".*"],
                  allow: [],
                  depConstraints: [
                    {
                      sourceTag: "*",
                      onlyDependOnLibsWithTags: ["*"]
                    }
                  ]
                }
              ]
            }
          : {}
    }
  ];
}
