import { getExecOutput } from "@actions/exec";
import { AbstractHelmClient, PackageOptions, PushOptions } from "../types";
import { ensureInitialized } from "./ensure-init";

/** Helm wrapper class */
export class HelmClient extends AbstractHelmClient {
  /**
   * Package a chart directory into a chart archive
   *
   * @param {PackageOptions} [options]
   */
  @ensureInitialized
  public async package(options: PackageOptions): Promise<string | undefined> {
    let chartPath: string | undefined = undefined;
    await getExecOutput("helm", [
      "package",
      options.chartFolder,
      "-d",
      options.outputFolder
    ]).then(output => {
      if (output.stderr.length > 0 && output.exitCode !== 0) {
        throw new Error(`Failed to package chart: ${output.stderr}`);
      }
      const stdout = output.stdout;
      const match = stdout.match(
        /Successfully packaged chart and saved it to: (.+)/
      );
      if (!match) {
        throw new Error("Failed to parse chart path from helm output");
      }
      chartPath = match[1]?.trim();
    });
    return chartPath;
  }

  @ensureInitialized
  public async push(options: PushOptions): Promise<void> {
    await getExecOutput("helm", [
      "push",
      options.chartPath,
      options.remote
    ]).then(output => {
      if (output.stderr.length > 0 && output.exitCode !== 0) {
        throw new Error(`Failed to push chart: ${output.stderr}`);
      }
    });
  }

  @ensureInitialized
  public async dependencyUpdate(chartFolder: string): Promise<void> {
    await getExecOutput("helm", ["dependency", "update", chartFolder]).then(
      output => {
        if (output.stderr.length > 0 && output.exitCode !== 0) {
          throw new Error(
            `Failed to update chart dependencies: ${output.stderr}`
          );
        }
      }
    );
  }

  @ensureInitialized
  public async dependencyBuild(chartFolder: string): Promise<void> {
    await getExecOutput("helm", ["dependency", "build", chartFolder]).then(
      output => {
        if (output.stderr.length > 0 && output.exitCode !== 0) {
          throw new Error(
            `Failed to build chart dependencies: ${output.stderr}`
          );
        }
      }
    );
  }

  @ensureInitialized
  public async addRepository(name: string, url: string): Promise<void> {
    await getExecOutput("helm", ["repo", "add", name, url]).then(output => {
      if (output.stderr.length > 0 && output.exitCode !== 0) {
        throw new Error(`Failed to add repository: ${output.stderr}`);
      }
    });
  }

  /**
   * Initialize Helm
   *
   * @returns {Promise<void>}
   */
  override async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    await getExecOutput("helm", ["version"]).then(output => {
      if (output.stderr.length > 0 && output.exitCode !== 0) {
        throw new Error(`Helm is not installed: ${output.stderr}`);
      }
      this.initialized = true;
    });
  }
}

/**
 * Create a new Helm client instance
 *
 * @returns {HelmClient}
 */
export const createHelmClient = (): HelmClient => {
  return new HelmClient();
};
