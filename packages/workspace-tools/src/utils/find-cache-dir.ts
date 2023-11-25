import { accessSync, constants, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { env } from "node:process";
import { getWorkspaceRoot } from "./get-workspace-root";

const isWritable = path => {
  try {
    accessSync(path, constants.W_OK);
    return true;
  } catch {
    return false;
  }
};

function useDirectory(
  directory: string,
  { create = true }: { create?: boolean }
) {
  if (create) {
    mkdirSync(directory, { recursive: true });
  }

  return directory;
}

function getNodeModuleDirectory(workspaceRoot: string) {
  const nodeModules = join(workspaceRoot, "node_modules");

  if (
    !isWritable(nodeModules) &&
    (existsSync(nodeModules) || !isWritable(join(workspaceRoot)))
  ) {
    return;
  }

  return nodeModules;
}

export function findCacheDirectory(
  {
    name,
    cacheName,
    workspaceRoot,
    create
  }: {
    name: string;
    cacheName?: string;
    workspaceRoot: string;
    create?: boolean;
  } = {
    name: "storm",
    workspaceRoot: getWorkspaceRoot(),
    create: true
  }
) {
  if (env.CACHE_DIR && !["true", "false", "1", "0"].includes(env.CACHE_DIR)) {
    return useDirectory(join(env.CACHE_DIR, name, cacheName), { create });
  }
  if (
    env.STORM_CACHE_DIR &&
    !["true", "false", "1", "0"].includes(env.STORM_CACHE_DIR)
  ) {
    return useDirectory(join(env.STORM_CACHE_DIR, name, cacheName), {
      create
    });
  }

  const nodeModules = getNodeModuleDirectory(workspaceRoot);
  if (!nodeModules) {
    return;
  }

  return useDirectory(
    join(workspaceRoot, "node_modules", ".cache", name, cacheName),
    { create }
  );
}
