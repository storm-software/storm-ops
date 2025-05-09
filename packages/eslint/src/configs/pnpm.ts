import {
  createProjectGraphAsync,
  ProjectGraph,
  readCachedProjectGraph
} from "@nx/devkit";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { pluginPnpm } from "../plugins";
import type { OptionsPnpm, TypedFlatConfigItem } from "../types";
import { joinPaths } from "../utils/correct-paths";
import { findWorkspaceRoot } from "../utils/find-workspace-root";
import { ensurePackages, interopDefault } from "../utils/helpers";

export async function pnpm(
  options: OptionsPnpm = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    ignore = ["typescript"],
    ignoreWorkspaceDeps = true
  } = options;
  const workspaceRoot = findWorkspaceRoot();

  await ensurePackages(["jsonc-eslint-parser", "yaml-eslint-parser"]);

  const [parserJsonc, parserYaml] = await Promise.all([
    interopDefault(import("jsonc-eslint-parser")),
    interopDefault(import("yaml-eslint-parser"))
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

  return [
    {
      name: "storm/pnpm/setup",
      plugins: {
        pnpm: pluginPnpm
      }
    },
    {
      name: "storm/pnpm/package-json",
      ignores: ["**/node_modules/**", "**/dist/**"],
      files: ["package.json", "**/package.json"],
      languageOptions: {
        parser: parserJsonc
      },
      rules: {
        "pnpm/json-enforce-catalog": [
          "error",
          {
            ignore,
            autofix: true,
            allowedProtocols: ["workspace", "link", "file"],
            defaultCatalog: "default",
            reuseExistingCatalog: true,
            conflicts: "overrides",
            fields: ["dependencies", "devDependencies"]
          }
        ],
        "pnpm/json-valid-catalog": "error",
        "pnpm/json-prefer-workspace-settings": "error",

        ...overrides
      }
    },
    {
      name: "storm/pnpm/pnpm-workspace-yaml",
      ignores: ["**/node_modules/**", "**/dist/**"],
      files: ["pnpm-workspace.yaml", "**/pnpm-workspace.yaml"],
      languageOptions: {
        parser: parserYaml
      },
      rules: {
        "pnpm/yaml-no-unused-catalog-item": "error",
        "pnpm/yaml-no-duplicate-catalog-item": "error",

        ...overrides
      }
    }
  ];
}
