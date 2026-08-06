import {
  createProjectGraphAsync,
  ProjectGraph,
  readCachedProjectGraph
} from "@nx/devkit";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import type { OptionsPnpm, TypedFlatConfigItem } from "../types";
import { joinPaths } from "../utils/correct-paths";
import { findWorkspaceRoot } from "../utils/find-workspace-root";
import { ensurePackages, interopDefault } from "../utils/helpers";

export async function bun(
  options: OptionsPnpm = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    ignore = ["typescript"],
    ignoreWorkspaceDeps = true
  } = options;
  const workspaceRoot = findWorkspaceRoot();

  await ensurePackages([
    "@storm-software/eslint-plugin-bun",
    "jsonc-eslint-parser"
  ]);

  const [plugin, parserJsonc] = await Promise.all([
    interopDefault(import("@storm-software/eslint-plugin-bun")),
    interopDefault(import("jsonc-eslint-parser"))
  ] as const);

  if (ignoreWorkspaceDeps !== false) {
    let projectGraph!: ProjectGraph;
    try {
      projectGraph = readCachedProjectGraph();
    } catch {
      await createProjectGraphAsync();
      projectGraph = readCachedProjectGraph();
    }

    const localPackages = [] as string[];
    if (projectGraph) {
      await Promise.all(
        Object.keys(projectGraph.nodes).map(async node => {
          const projectNode = projectGraph.nodes[node];
          if (projectNode?.data.root) {
            const projectPackageJsonPath = joinPaths(
              workspaceRoot,
              projectNode.data.root,
              "package.json"
            );
            if (existsSync(projectPackageJsonPath)) {
              const projectPackageJsonContent = await readFile(
                projectPackageJsonPath,
                "utf8"
              );

              const projectPackageJson = JSON.parse(projectPackageJsonContent);
              if (projectPackageJson.private !== true) {
                localPackages.push(projectPackageJson.name);
              }
            }
          }
        })
      );
    }

    localPackages.forEach(pkg => {
      if (!ignore.includes(pkg)) {
        ignore.push(pkg);
      }
    });
  }

  const configs = (
    Array.isArray(plugin.configs?.recommended)
      ? plugin.configs.recommended
      : [plugin.configs?.recommended]
  ).filter(
    config =>
      config &&
      typeof config === "object" &&
      "name" in config &&
      !config.name?.endsWith("setup")
  ) as TypedFlatConfigItem[];
  const packageJsonConfig = configs.find(
    config => config.name?.endsWith("package-json") ?? false
  );

  return [
    {
      name: "storm/bun/setup",
      plugins: {
        bun: plugin
      }
    },
    ...configs.map(config => ({
      name: config.name,
      ...config
    })),
    {
      name: "storm/bun/package-json",
      ...packageJsonConfig,
      languageOptions: {
        ...packageJsonConfig?.languageOptions,
        parser: parserJsonc
      },
      rules: {
        ...packageJsonConfig?.rules,
        ...overrides
      }
    }
  ];
}
