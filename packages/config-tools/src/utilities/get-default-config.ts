/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  STORM_DEFAULT_ERROR_CODES_FILE,
  STORM_DEFAULT_LICENSE,
  type StormWorkspaceConfig
} from "@storm-software/config";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { joinPaths } from "./correct-paths";
import { findWorkspaceRoot } from "./find-workspace-root";

/**
 * Get the default Storm config values used during various dev-ops processes
 *
 * @returns The default Storm config values
 */
export async function getPackageJsonConfig(
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
    | "support"
  >
> {
  let license = STORM_DEFAULT_LICENSE;
  let homepage: string | undefined = undefined;
  let support: string | undefined = undefined;

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

      if (packageJson.bugs) {
        if (typeof packageJson.bugs === "string") {
          support = packageJson.bugs;
        } else if (packageJson.bugs.url) {
          support = packageJson.bugs.url;
        }
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
    support
  };
}

/**
 * Apply default config values to the given config object
 *
 * @param config - The config object to apply defaults to
 * @returns The config object with defaults applied
 */
export function applyDefaultConfig(
  config: Partial<StormWorkspaceConfig>
): Partial<StormWorkspaceConfig> {
  if (!config.support && config.contact) {
    config.support = config.contact;
  }

  if (!config.contact && config.support) {
    config.contact = config.support;
  }

  if (config.homepage) {
    if (!config.docs) {
      config.docs = `${config.homepage}/docs`;
    }

    if (!config.license) {
      config.license = `${config.homepage}/license`;
    }

    if (!config.support) {
      config.support = `${config.homepage}/support`;
    }
    if (!config.contact) {
      config.contact = `${config.homepage}/contact`;
    }

    if (!config.error?.codesFile || !config?.error?.url) {
      config.error ??= { codesFile: STORM_DEFAULT_ERROR_CODES_FILE };
      if (config.homepage) {
        config.error.url ??= `${config.homepage}/errors`;
      }
    }
  }

  return config;
}
