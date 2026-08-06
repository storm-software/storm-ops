import fs from "node:fs";
import process from "node:process";
import { findUpSync } from "find-up-simple";
import { dirname, normalize, resolve } from "pathe";
import { globSync } from "tinyglobby";

export interface BunWorkspacePackageJson {
  catalog?: Record<string, string>;
  catalogs?: Record<string, Record<string, string>>;
  workspaces?:
    | string[]
    | {
        packages?: string[];
        catalog?: Record<string, string>;
        catalogs?: Record<string, Record<string, string>>;
      };
  [key: string]: unknown;
}

export type CatalogName = "default" | (string & {});

export interface SpecifierConflicts {
  conflicts: boolean;
  newCatalogName: string;
  existingSpecifier?: string;
}

export interface BunWorkspace {
  filepath: string;
  setContent: (content: string) => void;
  hasChanged: () => boolean;
  hasQueue: () => boolean;
  clearQueue: () => void;
  queueChange: (
    fn: (workspace: BunWorkspace) => void,
    order?: "pre" | "post"
  ) => void;
  toJSON: () => BunWorkspacePackageJson;
  toString: () => string;
  setPackage: (
    catalog: CatalogName,
    packageName: string,
    specifier: string
  ) => void;
  setPackageNoConflicts: (
    catalog: CatalogName,
    packageName: string,
    specifier: string
  ) => void;
  getPackageCatalogs: (packageName: string) => string[];
  hasSpecifierConflicts: (
    catalog: CatalogName,
    packageName: string,
    specifier: string
  ) => SpecifierConflicts;
  getCatalogData: () => {
    catalog?: Record<string, string>;
    catalogs?: Record<string, Record<string, string>>;
  };
  getWorkspacePackagePatterns: () => string[];
}

type CatalogRoot = "top" | "workspaces";

function isWorkspaceObject(
  workspaces: BunWorkspacePackageJson["workspaces"]
): workspaces is {
  packages?: string[];
  catalog?: Record<string, string>;
  catalogs?: Record<string, Record<string, string>>;
} {
  return Boolean(workspaces) && typeof workspaces === "object" && !Array.isArray(workspaces);
}

function detectCatalogRoot(data: BunWorkspacePackageJson): CatalogRoot {
  if (data.catalog || data.catalogs) {
    return "top";
  }

  if (
    isWorkspaceObject(data.workspaces) &&
    (data.workspaces.catalog || data.workspaces.catalogs)
  ) {
    return "workspaces";
  }

  return isWorkspaceObject(data.workspaces) ? "workspaces" : "top";
}

function normalizeCatalogName(name: string): string {
  return name
    .replace(/\^/g, "h")
    .replace(/~/g, "t")
    .replace(/\./g, "_")
    .replace(/</g, "l")
    .replace(/>/g, "g")
    .replace(/=/g, "e")
    .replace(/\*/g, "s")
    .replace(/@/g, "a")
    .replace(/\|/g, "p")
    .replace(/&/g, "n")
    .replace(/-/g, "m")
    .replace(/\+/g, "u")
    .replace(/\s/g, "_");
}

function sortObjectKeys<T>(input: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(input).sort(([left], [right]) => left.localeCompare(right))
  );
}

function isWorkspaceRootPackageJson(data: BunWorkspacePackageJson): boolean {
  return Boolean(
    data.workspaces || data.catalog || data.catalogs
  );
}

/**
 * Find and parse the Bun workspace root `package.json` that holds catalogs.
 *
 * Catalogs live in root `package.json` (top-level or under `workspaces`), not
 * `pnpm-workspace.yaml`. See https://bun.com/docs/pm/catalogs
 */
export function readBunWorkspace(cwd = process.cwd()): BunWorkspace {
  const filepath = findUpSync("package.json", {
    cwd,
    type: "file"
  });

  if (!filepath) {
    throw new Error("package.json not found");
  }

  // Walk upward until we find a workspace/catalog root.
  let current = filepath;
  let content = fs.readFileSync(current, "utf8");
  let data = JSON.parse(content) as BunWorkspacePackageJson;

  while (!isWorkspaceRootPackageJson(data)) {
    const searchFrom = dirname(dirname(current));
    const next = findUpSync("package.json", {
      cwd: searchFrom,
      type: "file"
    });
    if (!next || normalize(next) === normalize(current)) {
      break;
    }
    current = next;
    content = fs.readFileSync(current, "utf8");
    data = JSON.parse(content) as BunWorkspacePackageJson;
  }

  if (!isWorkspaceRootPackageJson(data)) {
    throw new Error(
      "Bun workspace root package.json with workspaces/catalog not found"
    );
  }

  let hasChanged = false;
  let queueTimer: ReturnType<typeof setTimeout> | undefined;
  const queue: Array<(workspace: BunWorkspace) => void> = [];
  let catalogRoot = detectCatalogRoot(data);

  const write = () => {
    if (!fs.existsSync(current)) {
      return;
    }
    fs.writeFileSync(current, `${JSON.stringify(data, null, 2)}\n`);
  };

  const clearQueue = () => {
    if (queueTimer != null) {
      clearTimeout(queueTimer);
      queueTimer = undefined;
    }
    queue.length = 0;
  };

  const getCatalogContainer = (): BunWorkspacePackageJson => {
    if (catalogRoot === "workspaces") {
      if (!isWorkspaceObject(data.workspaces)) {
        data.workspaces = {
          packages: Array.isArray(data.workspaces) ? data.workspaces : [],
          catalog: {},
          catalogs: {}
        };
      }
      return data.workspaces as BunWorkspacePackageJson;
    }
    return data;
  };

  const getCatalogData = () => {
    const container = getCatalogContainer();
    return {
      catalog: container.catalog,
      catalogs: container.catalogs
    };
  };

  const setPackage = (
    catalogName: CatalogName,
    packageName: string,
    specifier: string
  ) => {
    const container = getCatalogContainer();

    if (catalogName === "default") {
      container.catalog ??= {};
      if (container.catalog[packageName] !== specifier) {
        container.catalog[packageName] = specifier;
        container.catalog = sortObjectKeys(container.catalog);
        hasChanged = true;
      }
      return;
    }

    container.catalogs ??= {};
    container.catalogs[catalogName] ??= {};
    if (container.catalogs[catalogName]![packageName] !== specifier) {
      container.catalogs[catalogName]![packageName] = specifier;
      container.catalogs[catalogName] = sortObjectKeys(
        container.catalogs[catalogName]!
      );
      container.catalogs = sortObjectKeys(container.catalogs);
      hasChanged = true;
    }
  };

  const hasSpecifierConflicts = (
    catalogName: CatalogName,
    packageName: string,
    specifier: string
  ): SpecifierConflicts => {
    const { catalog, catalogs } = getCatalogData();
    const existingSpecifier =
      catalogName === "default"
        ? catalog?.[packageName]
        : catalogs?.[catalogName]?.[packageName];

    if (existingSpecifier === specifier) {
      return {
        conflicts: false,
        newCatalogName: catalogName,
        existingSpecifier
      };
    }

    if (existingSpecifier) {
      const versionSuffix = normalizeCatalogName(specifier);
      const newCatalogName =
        catalogName === "default"
          ? `conflicts_${packageName}_${versionSuffix}`
          : `conflicts_${catalogName}_${versionSuffix}`;
      return {
        conflicts: true,
        existingSpecifier,
        newCatalogName
      };
    }

    return {
      conflicts: false,
      newCatalogName: catalogName
    };
  };

  const getPackageCatalogs = (packageName: string): string[] => {
    const found: string[] = [];
    const { catalog, catalogs } = getCatalogData();

    if (catalogs) {
      for (const name of Object.keys(catalogs)) {
        if (catalogs[name]?.[packageName]) {
          found.push(name);
        }
      }
    }

    if (catalog?.[packageName]) {
      found.push("default");
    }

    return found;
  };

  const workspace: BunWorkspace = {
    filepath: current,
    setContent(newContent: string) {
      content = newContent;
      data = JSON.parse(newContent) as BunWorkspacePackageJson;
      catalogRoot = detectCatalogRoot(data);
      hasChanged = false;
    },
    hasChanged: () => hasChanged,
    hasQueue: () => queueTimer != null,
    clearQueue,
    queueChange(fn, order) {
      if (order === "pre") {
        queue.unshift(fn);
      } else {
        queue.push(fn);
      }

      if (queueTimer != null) {
        clearTimeout(queueTimer);
      }

      queueTimer = setTimeout(() => {
        queueTimer = undefined;
        const clone = [...queue];
        queue.length = 0;
        for (const queued of clone) {
          queued(workspace);
        }
        if (hasChanged) {
          write();
        }
      }, 1000);
    },
    toJSON: () => data,
    toString: () => `${JSON.stringify(data, null, 2)}\n`,
    setPackage,
    setPackageNoConflicts(catalogName, packageName, specifier) {
      const { newCatalogName } = hasSpecifierConflicts(
        catalogName,
        packageName,
        specifier
      );
      setPackage(newCatalogName, packageName, specifier);
    },
    getPackageCatalogs,
    hasSpecifierConflicts,
    getCatalogData,
    getWorkspacePackagePatterns() {
      if (Array.isArray(data.workspaces)) {
        return data.workspaces;
      }
      if (isWorkspaceObject(data.workspaces) && data.workspaces.packages) {
        return data.workspaces.packages;
      }
      return [];
    }
  };

  return workspace;
}

const WORKSPACE_CACHE_TIME = 10_000;
let workspaceLastRead: number | undefined;
let workspace: BunWorkspace | undefined;

export function getBunWorkspace(cwd = process.cwd()): BunWorkspace {
  if (
    workspaceLastRead &&
    workspace &&
    !workspace.hasQueue() &&
    Date.now() - workspaceLastRead > WORKSPACE_CACHE_TIME
  ) {
    workspace = undefined;
  }

  if (!workspace) {
    workspace = readBunWorkspace(cwd);
    workspaceLastRead = Date.now();
  }

  return workspace;
}

export function resetBunWorkspaceCache(): void {
  workspace?.clearQueue();
  workspace = undefined;
  workspaceLastRead = undefined;
}

export function isRootWorkspacePackageJson(
  filename: string,
  cwd = process.cwd()
): boolean {
  try {
    const root = getBunWorkspace(cwd);
    return normalize(root.filepath) === normalize(filename);
  } catch {
    return false;
  }
}

export function collectWorkspacePackageJsonPaths(
  workspaceRoot: BunWorkspace
): string[] {
  const root = resolve(dirname(workspaceRoot.filepath));
  const patterns = workspaceRoot.getWorkspacePackagePatterns();
  const dirs = patterns.length
    ? globSync(patterns, {
        cwd: root,
        dot: false,
        ignore: [
          "**/node_modules/**",
          "**/dist/**",
          "**/build/**"
        ],
        absolute: true,
        expandDirectories: false,
        onlyDirectories: true
      })
    : [];

  dirs.push(root);

  return dirs
    .map(dir => resolve(dir, "package.json"))
    .filter(path => fs.existsSync(path))
    .sort();
}
