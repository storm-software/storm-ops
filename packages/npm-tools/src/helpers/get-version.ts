import { exec } from "node:child_process";
import { valid } from "semver";
import stripAnsi from "strip-ansi";
import {
  CANARY_NPM_TAG,
  DEFAULT_NPM_TAG,
  EXPERIMENTAL_NPM_TAG,
  LATEST_NPM_TAG
} from "../constants";
import { getRegistry } from "./get-registry";

const BENIGN_PACKAGE_MANAGER_STDERR_LINE =
  /^(npm warn|\[[\d.]+ms\]|\[sys\]|\[warn\] request took)/i;

/**
 * Remove known package manager diagnostic output from stderr.
 *
 * @param stderr - The stderr output from a package manager command.
 * @returns The remaining stderr content, if any.
 */
export function filterBenignPackageManagerStderr(stderr: string): string {
  return stderr
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => !BENIGN_PACKAGE_MANAGER_STDERR_LINE.test(line))
    .join("\n")
    .trim();
}

/**
 * Extract a semver version from package manager stdout.
 *
 * @param stdout - The stdout output from a package manager command.
 * @returns The extracted version string.
 */
export function extractPackageVersion(stdout: string): string {
  const lines = stripAnsi(stdout)
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index];
    if (line && valid(line, true)) {
      return line;
    }
  }

  return stripAnsi(stdout).trim();
}

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

  /**
   * The number of times to retry fetching the version in case of failure.
   *
   * @defaultValue `3`
   */
  retries?: number;

  /**
   * The timeout in milliseconds for the command execution.
   *
   * @defaultValue `10000` (10 seconds)
   */
  timeout?: number;
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
  const retries = options.retries ?? 3;
  const timeout = options.timeout ?? 10000;
  const registry = options.registry || (await getRegistry(executable));

  let lastError: Error | string | undefined;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, timeout);

      const version = await Promise.resolve(
        new Promise<string>((resolve, reject) => {
          exec(
            `${executable} view ${packageName} version --registry=${registry}`,
            {
              signal: abortController.signal,
              maxBuffer: 1024 * 1024 * 10 // 10 MB
            },
            (error, stdout, stderr) => {
              const filteredStderr = stderr
                ? filterBenignPackageManagerStderr(stderr)
                : "";

              if (
                error &&
                !error.message.toLowerCase().trim().startsWith("npm warn")
              ) {
                return reject(
                  filteredStderr
                    ? new Error(filteredStderr, { cause: error })
                    : error
                );
              }

              if (filteredStderr) {
                return reject(new Error(filteredStderr));
              }

              return resolve(extractPackageVersion(stdout));
            }
          );
        })
      );
      if (!valid(version, true)) {
        clearTimeout(timeoutId);

        throw new Error(
          stripAnsi(version).startsWith("[WARN] Request took")
            ? `A timeout occurred while fetching the version for package "${packageName}" with tag "${tag}".`
            : `Invalid version "${version}" fetched for package "${packageName}" with tag "${tag}"`
        );
      }

      clearTimeout(timeoutId);
      return version;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const delayMs = Math.pow(2, attempt) * 100;
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
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
