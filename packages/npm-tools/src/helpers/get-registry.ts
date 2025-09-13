import { getConfig } from "@storm-software/config-tools/get-config";
import { exec } from "node:child_process";
import { DEFAULT_GITHUB_REGISTRY, DEFAULT_NPM_REGISTRY } from "../constants";

/**
 * Get the registry URL.
 *
 * @returns The registry URL.
 */
export async function getRegistry() {
  return new Promise<string>((resolve, reject) => {
    exec("npm config get registry", (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return reject(stderr);
      }
      return resolve(stdout.trim());
    });
  });
}

/**
 * Get the npm registry URL.
 *
 * @returns The npm registry URL.
 */
export async function getNpmRegistry() {
  if (process.env.STORM_REGISTRY_NPM) {
    return process.env.STORM_REGISTRY_NPM;
  }

  const workspaceConfig = await getConfig();
  if (workspaceConfig?.registry?.npm) {
    return workspaceConfig?.registry?.npm;
  }

  return DEFAULT_NPM_REGISTRY;
}

/**
 * Get the GitHub npm registry URL.
 *
 * @returns The GitHub npm registry URL.
 */
export async function getGitHubRegistry() {
  if (process.env.STORM_REGISTRY_GITHUB) {
    return process.env.STORM_REGISTRY_GITHUB;
  }

  const workspaceConfig = await getConfig();
  if (workspaceConfig?.registry?.github) {
    return workspaceConfig?.registry?.github;
  }

  return DEFAULT_GITHUB_REGISTRY;
}
