import { exec } from "node:child_process";
import {
  CANARY_NPM_TAG,
  DEFAULT_NPM_TAG,
  EXPERIMENTAL_NPM_TAG,
  LATEST_NPM_TAG
} from "../constants";
import { getRegistry } from "./get-registry";

export interface GetVersionOptions {
  /**
   * The registry URL to use.
   *
   * @defaultValue The value returned by `getRegistry()`
   */
  registry?: string;

  /**
   * The package manager executable to use.
   *
   * @defaultValue `"npm"`
   */
  executable?: string;
}

/**
 * Get the version of a package from the npm registry.
 *
 * @param packageName The name of the package to get the version for.
 * @param tag The npm tag to use.
 * @param options Options for getting the version.
 * @returns The version of the package.
 */
export async function getVersion(
  packageName: string,
  tag: string = DEFAULT_NPM_TAG,
  options: GetVersionOptions = {}
): Promise<string> {
  const executable = options.executable || "npm";
  const registry = options.registry || (await getRegistry(executable));

  return new Promise<string>((resolve, reject) => {
    exec(
      `${executable} view ${packageName} version --registry=${registry} --tag=${tag}`,
      (error, stdout, stderr) => {
        if (
          error &&
          !error.message.toLowerCase().trim().startsWith("npm warn")
        ) {
          return reject(error);
        }
        if (stderr && !stderr.toLowerCase().trim().startsWith("npm warn")) {
          return reject(stderr);
        }

        return resolve(stdout.trim());
      }
    );
  });
}

/**
 * Get the latest version of a package from the npm registry.
 *
 * @param packageName The name of the package to get the version for.
 * @param options Options for getting the version.
 * @returns The latest version of the package.
 */
export async function getLatestVersion(
  packageName: string,
  options: GetVersionOptions = {}
): Promise<string> {
  return getVersion(packageName, LATEST_NPM_TAG, options);
}

/**
 * Get the canary version of a package from the npm registry.
 *
 * @param packageName The name of the package to get the version for.
 * @param options Options for getting the version.
 * @returns The canary version of the package.
 */
export async function getCanaryVersion(
  packageName: string,
  options: GetVersionOptions = {}
): Promise<string> {
  return getVersion(packageName, CANARY_NPM_TAG, options);
}

/**
 * Get the experimental version of a package from the npm registry.
 *
 * @param packageName The name of the package to get the version for.
 * @param options Options for getting the version.
 * @returns The experimental version of the package.
 */
export async function getExperimentalVersion(
  packageName: string,
  options: GetVersionOptions = {}
): Promise<string> {
  return getVersion(packageName, EXPERIMENTAL_NPM_TAG, options);
}
