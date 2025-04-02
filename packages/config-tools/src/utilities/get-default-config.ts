/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ColorConfig,
  STORM_DEFAULT_HOMEPAGE,
  STORM_DEFAULT_LICENSE,
  type StormWorkspaceConfig
} from "@storm-software/config";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { joinPaths } from "./correct-paths";
import { findWorkspaceRoot } from "./find-workspace-root";

/**
 * Storm theme config values used for styling various workspace elements
 */
export const DEFAULT_COLOR_CONFIG: ColorConfig = {
  light: {
    background: "#fafafa",
    foreground: "#1d1e22",
    brand: "#1fb2a6",
    alternate: "#db2777",
    help: "#5C4EE5",
    success: "#087f5b",
    info: "#0550ae",
    warning: "#e3b341",
    danger: "#D8314A",
    positive: "#22c55e",
    negative: "#dc2626"
  },
  dark: {
    background: "#1d1e22",
    foreground: "#cbd5e1",
    brand: "#2dd4bf",
    alternate: "#db2777",
    help: "#818cf8",
    success: "#10b981",
    info: "#58a6ff",
    warning: "#f3d371",
    danger: "#D8314A",
    positive: "#22c55e",
    negative: "#dc2626"
  }
};

/**
 * Get the default Storm config values used during various dev-ops processes
 *
 * @returns The default Storm config values
 */
export const getDefaultConfig = async (
  root?: string
): Promise<
  Pick<
    StormWorkspaceConfig,
    | "workspaceRoot"
    | "name"
    | "namespace"
    | "repository"
    | "license"
    | "homepage"
    | "docs"
    | "licensing"
  >
> => {
  let license = STORM_DEFAULT_LICENSE;
  let homepage = STORM_DEFAULT_HOMEPAGE;

  let name: string | undefined = undefined;
  let namespace: string | undefined = undefined;
  let repository: string | undefined = undefined;

  const workspaceRoot = findWorkspaceRoot(root);
  if (existsSync(join(workspaceRoot, "package.json"))) {
    const file = await readFile(
      joinPaths(workspaceRoot, "package.json"),
      "utf8"
    );
    if (file) {
      const packageJson = JSON.parse(file);

      if (packageJson.name) {
        name = packageJson.name;
      }
      if (packageJson.namespace) {
        namespace = packageJson.namespace;
      }
      if (packageJson.repository) {
        if (typeof packageJson.repository === "string") {
          repository = packageJson.repository;
        } else if (packageJson.repository.url) {
          repository = packageJson.repository.url;
        }
      }
      if (packageJson.license) {
        license = packageJson.license;
      }
      if (packageJson.homepage) {
        homepage = packageJson.homepage;
      }
    }
  }

  return {
    workspaceRoot,
    name,
    namespace,
    repository,
    license,
    homepage,
    docs: `${homepage || STORM_DEFAULT_HOMEPAGE}/docs`,
    licensing: `${homepage || STORM_DEFAULT_HOMEPAGE}/license`
  };
};
