import { existsSync } from "node:fs";
import { join } from "node:path";
import { findWorkspaceRootSafe } from "./find-workspace-root";

/**
 * Detect the package manager used in the workspace.
 *
 * @returns "pnpm" | "bun" | "npm"
 */
export function detectPackageManager(): "pnpm" | "bun" | "npm" {
  const workspaceRoot = findWorkspaceRootSafe() ?? process.cwd();
  if (existsSync(join(workspaceRoot, "bun.lockb")) || existsSync(join(workspaceRoot, "bun.lock")) || existsSync(join(workspaceRoot, "bunfig.toml")) || existsSync(join(workspaceRoot, "bunfig.yml"))) {
    return "bun";
  }
  if (existsSync(join(workspaceRoot, "pnpm-lock.yaml")) || existsSync(join(workspaceRoot, "pnpm-lock.yml")) || existsSync(join(workspaceRoot, "pnpm-workpace.yaml"))) {
    return "pnpm";
  }

  return "npm";
}
