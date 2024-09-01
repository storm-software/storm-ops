import { execSync } from "node:child_process";
import { AbstractHelmClient, PackageOptions, PushOptions } from "../types";
import { ensureInitialized } from "./ensure-init";

/** Helm wrapper class */
export class HelmClient extends AbstractHelmClient {
  /**
   * Creates an instance of HelmClient
   */
  public constructor() {
    super();
  }

  /**
   * Package a chart directory into a chart archive
   *
   * @param {PackageOptions} [options]
   */
  @ensureInitialized
  public package(options: PackageOptions): Promise<string | undefined> {
    let chartPath: string | undefined = undefined;

    let output = {} as any;
    try {
      output = this.runCommand([
        "helm",
        "package",
        options.chartFolder,
        "-d",
        options.outputFolder
      ]);
    } catch (err) {
      if (err?.stderr.length > 0 && err?.exitCode !== 0) {
        throw new Error(`Failed to package chart: ${err.stderr}`);
      }
    }

    if (output?.stderr.length > 0 && output?.exitCode !== 0) {
      throw new Error(`Failed to package chart: ${output.stderr}`);
    }

    const match = output.stdout?.match(
      /Successfully packaged chart and saved it to: (.+)/
    );
    if (!match || match.length < 2) {
      throw new Error("Failed to parse chart path from helm output");
    }

    chartPath = match[1]?.trim();

    return new Promise(resolve => resolve(chartPath));
  }

  @ensureInitialized
  public push(options: PushOptions) {
    try {
      this.runCommand(["helm", "push", options.chartPath, options.remote]);
    } catch (err) {
      if (err?.stderr.length > 0 && err?.exitCode !== 0) {
        throw new Error(`Failed to push chart: ${err.stderr}`);
      }
    }
  }

  @ensureInitialized
  public dependencyUpdate(chartFolder: string) {
    try {
      this.runCommand(["helm", "dependency", "update", chartFolder]);
    } catch (err) {
      if (err?.stderr.length > 0 && err?.exitCode !== 0) {
        throw new Error(`Failed to update chart dependencies: ${err.stderr}`);
      }
    }
  }

  @ensureInitialized
  public dependencyBuild(chartFolder: string) {
    try {
      this.runCommand(["helm", "dependency", "build", chartFolder]);
    } catch (err) {
      if (err?.stderr.length > 0 && err?.exitCode !== 0) {
        throw new Error(`Failed to build chart dependencies: ${err.stderr}`);
      }
    }
  }

  @ensureInitialized
  public addRepository(name: string, url: string) {
    try {
      this.runCommand(["helm", "repo", "add", name, url]);
    } catch (err) {
      if (err?.stderr.length > 0 && err?.exitCode !== 0) {
        throw new Error(`Failed to add repository: ${err.stderr}`);
      }
    }
  }

  /**
   * Initialize Helm
   *
   * @returns A promise
   */
  public override async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      this.runCommand(["helm", "version"]);
    } catch (err) {
      if (err?.stderr.length > 0 && err?.exitCode !== 0) {
        throw new Error(`Helm is not installed: ${err.stderr}`);
      }
    }

    return new Promise<void>(resolve => {
      this.initialized = true;

      resolve();
    });
  }

  private runCommand(commands: string[]): string {
    return execSync(commands.filter(Boolean).join(" "), {
      encoding: "utf8",
      windowsHide: true,
      maxBuffer: 1024 * 1000000,
      stdio: "pipe"
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
