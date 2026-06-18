import { StormWorkspaceConfig } from "@storm-software/config/types";
import {
  applyUpdates,
  checkUpdates,
  createGitHubClient,
  getCompatibleUpdate,
  getUpdateLevel,
  isSha,
  parseExcludePatterns,
  readInlineVersionComment,
  resolveTargetReference,
  scanGitHubActions,
  shouldIgnore
} from "actions-up";
import { basename, dirname, isAbsolute, relative, resolve } from "node:path";
import "node:worker_threads";
import pc from "picocolors";

/**
 * Options for resolving scan directories from CLI flags.
 */
interface ResolveScanDirectoriesOptions {
  dir?: string[] | string;
  recursive?: boolean;
  cwd: string;
}

/**
 * Resolved directory with root and relative directory.
 */
interface ResolvedDirectory {
  root: string;
  dir: string;
}

/**
 * Represents a GitHub Action used in workflows or composite actions.
 */
export interface GitHubAction {
  /**
   * Type of the GitHub Action.
   */
  type: "reusable-workflow" | "composite" | "external" | "docker" | "local";

  /**
   * Version or tag of the action (e.g., 'v1', 'main', commit SHA).
   */
  version?: string | null;

  /**
   * Line number where the action is used in the file.
   */
  line?: number;

  /**
   * Path to the file where this action is used.
   */
  file?: string;

  /**
   * Original `uses` string from workflow, if available.
   */
  uses?: string;

  /**
   * Name of the job where this action is used (for workflows).
   */
  job?: string;

  /**
   * Full name of the action (e.g., 'actions/checkout').
   */
  name: string;

  /**
   * Original `ref` string from workflow, if available.
   */
  ref?: string;
}

/**
 * Result of scanning a repository for GitHub Actions usage.
 */
export interface ScanResult {
  /**
   * Map of workflow files to their used GitHub Actions.
   */
  workflows: Map<string, GitHubAction[]>;

  /**
   * Map of composite action names to their file paths.
   */
  compositeActions: Map<string, string>;

  /**
   * List of all unique GitHub Actions found in the repository.
   */
  actions: GitHubAction[];
}

const GITHUB_DIRECTORY = ".github";

/**
 * Resolve directories to scan from CLI options.
 *
 * Defaults:
 *
 * - Non-recursive mode: `.github`
 * - Recursive mode without --dir: `.`.
 *
 * @param options - CLI options used to compute scan directories.
 * @param options.cwd - Current working directory.
 * @param options.dir - Optional directory flag value(s).
 * @param options.recursive - Whether recursive mode is enabled.
 * @returns Unique resolved directories.
 */
function resolveScanDirectories(
  options: ResolveScanDirectoriesOptions
): ResolvedDirectory[] {
  let { recursive, cwd, dir } = options;

  let rawDirectories: string[] = [];
  if (Array.isArray(dir)) {
    rawDirectories.push(...dir);
  } else if (typeof dir === "string") {
    rawDirectories.push(dir);
  } else if (recursive) {
    rawDirectories.push(".");
  } else {
    rawDirectories.push(GITHUB_DIRECTORY);
  }

  let seen = new Set<string>();
  let results: ResolvedDirectory[] = [];

  for (let value of rawDirectories) {
    let absolute = resolve(cwd, value);
    let relativePath = relative(cwd, absolute);
    let isOutside =
      relativePath.startsWith("..") ||
      isAbsolute(relativePath) ||
      resolve(cwd, relativePath) !== absolute;

    let entry: ResolvedDirectory;
    if (recursive) {
      entry = { root: absolute, dir: "." };
    } else if (isOutside) {
      entry = { dir: basename(absolute), root: dirname(absolute) };
    } else {
      entry = { dir: relativePath || GITHUB_DIRECTORY, root: cwd };
    }

    let key = `${entry.root}\0${entry.dir}`;
    if (!seen.has(key)) {
      seen.add(key);
      results.push(entry);
    }
  }

  return results;
}

export interface RunActionsUpOptions {
  path?: string;
  excludes?: string[];
}

/**
 * Main action function for the "actions-up" command.
 *
 * @param workspaceConfig - The workspace configuration object.
 * @returns A promise that resolves when the action is complete.
 */
export async function runActionsUp(
  workspaceConfig: Partial<StormWorkspaceConfig>,
  options: RunActionsUpOptions = {}
): Promise<void> {
  const { path = ".github", excludes = [] } = options;

  // let spinner: ReturnType<typeof createSpinner> | null = null;
  let directories = resolveScanDirectories({
    cwd: workspaceConfig.workspaceRoot || process.cwd(),
    dir: path
  });

  let includeBranches = false;
  let mode = "minor";
  let style = "sha";

  try {
    console.info(pc.cyan("\n🚀 Actions Up!\n"));
    // spinner = createSpinner("Scanning GitHub Actions...").start();

    let scanResults = await Promise.all(
      directories.map(({ root, dir }) => scanGitHubActions(root, dir))
    );

    let merged: ScanResult = {
      compositeActions: new Map(),
      workflows: new Map(),
      actions: []
    };
    for (let [index, result] of scanResults.entries()) {
      for (let [key, value] of result.workflows) {
        merged.workflows.set(`${index}:${key}`, value);
      }
      for (let [, value] of result.compositeActions) {
        merged.compositeActions.set(`${index}:${value}`, value);
      }
      merged.actions.push(...result.actions);
    }

    let seen = new Set<string>();
    merged.actions = merged.actions.filter(action => {
      let key = `${action.file}:${action.line}:${action.name}:${action.version}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    let totalActions = merged.actions.length;
    let totalWorkflows = merged.workflows.size;
    let totalCompositeActions = merged.compositeActions.size;

    // spinner?.success(
    //   `Found ${pc.yellow(totalActions)} actions in ` +
    //     `${pc.yellow(totalWorkflows)} workflows and ` +
    //     `${pc.yellow(totalCompositeActions)} composite actions`
    // );

    if (totalActions === 0) {
      console.info(pc.green("\n✨ No GitHub Actions found in this repository"));
      return;
    }

    let actionsToCheck = merged.actions;

    if (excludes.length > 0) {
      let regexes = parseExcludePatterns(excludes);
      if (regexes.length > 0) {
        actionsToCheck = actionsToCheck.filter(action => {
          let { name } = action;
          for (let rx of regexes) {
            if (rx.test(name)) {
              return false;
            }
          }
          return true;
        });
      }
    }

    // spinner = createSpinner("Checking for updates...").start();

    if (actionsToCheck.length === 0) {
      // spinner?.success("No actions to check");
      console.info(pc.green("\n✨ Nothing to check\n"));
      return;
    }

    let token = process.env["GITHUB_TOKEN"];
    let githubClient = createGitHubClient(token);

    let updates = await checkUpdates(actionsToCheck, token, {
      client: githubClient,
      includeBranches,
      style: "sha"
    });

    let filtered: typeof updates = [];
    await Promise.all(
      updates.map(async update => {
        let ignored = await shouldIgnore(
          update.action.file,
          update.action.line
        );
        if (!ignored) {
          filtered.push(update);
        }
      })
    );

    let skipped = filtered.filter(update => update.status === "skipped");
    let outdated = filtered.filter(update => update.hasUpdate);

    let now = Date.now();
    outdated = outdated.filter(update => {
      if (!update.publishedAt) {
        return true;
      }
      return now - update.publishedAt.getTime() >= 24 * 60 * 60 * 1000; // greater than 24 hours
    });

    let blockedByMode: typeof outdated = [];
    if (mode !== "major") {
      let tagsCache = new Map<
        string,
        Awaited<ReturnType<typeof githubClient.getAllTags>>
      >();
      let shaCache = new Map<string, string | null>();
      let fileCache = new Map<string, string>();
      let decisions = await Promise.all(
        outdated.map(async update => {
          let effectiveCurrentVersion = update.currentVersion;
          if (isSha(update.currentVersion)) {
            let inline = await readInlineVersionComment(
              update.action.file,
              update.action.line,
              fileCache
            );
            if (inline) {
              effectiveCurrentVersion = inline;
            }
          }

          let level = getUpdateLevel(
            effectiveCurrentVersion,
            update.latestVersion
          );
          let allowed =
            mode === "minor"
              ? level === "minor" || level === "patch" || level === "none"
              : level === "patch" || level === "none";

          return { effectiveCurrentVersion, allowed, update };
        })
      );

      let allowedByMode: typeof outdated = [];
      let compatibleFallbacks = await Promise.all(
        decisions.map(async decision => {
          if (decision.allowed) {
            return { update: decision.update };
          }

          let compatible = await getCompatibleUpdate(githubClient, {
            currentVersion: decision.effectiveCurrentVersion,
            actionName: decision.update.action.name,
            tagsCache,
            shaCache,
            mode
          });

          if (!compatible) {
            return { blocked: decision.update };
          }

          return {
            update: {
              ...decision.update,
              latestVersion: compatible.version,
              latestSha: compatible.sha,
              isBreaking: false,
              hasUpdate: true
            }
          };
        })
      );

      for (let decision of compatibleFallbacks) {
        if (decision.update) {
          allowedByMode.push(decision.update);
          continue;
        }

        blockedByMode.push(decision.blocked);
      }

      outdated = allowedByMode;
    }

    outdated = outdated.map(update => resolveTargetReference(update, style));
    let unresolvedByStyle = outdated
      .filter(update => !update.targetRef)
      .map(update => ({
        ...update,
        skipReason: "unsupported-style" as const,
        status: "skipped" as const,
        hasUpdate: false
      }));
    skipped.push(...unresolvedByStyle);
    outdated = outdated.filter(update => update.targetRef);

    let breaking = outdated.filter(update => update.isBreaking);

    if (outdated.length === 0) {
      // spinner?.success("All actions are up to date!");

      console.info(
        pc.green("\n✨ Everything is already at the latest version!\n")
      );
      return;
    }

    // spinner?.success(
    //   `Found ${pc.yellow(outdated.length)} updates available${
    //     breaking.length > 0
    //       ? ` (${pc.redBright(breaking.length)} breaking)`
    //       : ""
    //   }`
    // );

    /**
     * Auto-update all actions with the resolved target ref.
     */
    let toUpdate = outdated.filter(update => update.targetRef);
    if (toUpdate.length === 0) {
      console.info(pc.yellow("\n⚠️ No actionable updates available\n"));
      return;
    }

    console.info(pc.yellow(`\n🔄 Updating ${toUpdate.length} actions...\n`));

    await applyUpdates(toUpdate);

    console.info(pc.green("\n✓ Updates applied successfully!"));
  } catch (error) {
    // spinner?.error("Failed");

    /**
     * Handle rate limit errors with helpful message.
     */
    if (error instanceof Error && error.name === "GitHubRateLimitError") {
      console.error(pc.yellow("\n⚠️ Rate Limit Exceeded\n"));
      console.error(error.message);
      console.error(pc.gray("\nExample: GITHUB_TOKEN=ghp_xxxx actions-up\n"));
    } else {
      console.error(
        pc.redBright("\nError:"),
        error instanceof Error ? error.message : String(error)
      );
    }
    process.exit(1);
  }
}
