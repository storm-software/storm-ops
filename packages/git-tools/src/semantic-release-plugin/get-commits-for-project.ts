/* eslint-disable @typescript-eslint/no-explicit-any */

import { ProjectGraph, createProjectGraphAsync } from "@nx/devkit";
import { execSync } from "child_process";
import filter from "conventional-commits-filter";
import { filterAffected } from "nx/src/project-graph/affected/affected-project-graph.js";
import { calculateFileChanges } from "nx/src/project-graph/file-utils.js";
import { map, pipe } from "remeda";
import { PluginFn } from "semantic-release-plugin-decorators";
import { ReleaseContext } from "../types";

interface CommitAffectingProjectsParams {
  commit: Pick<any, "subject" | "commit" | "body">;
  projects: string[];
  // Name of root project
  projectName: string;
  context: Pick<any, "logger">;
  verbose?: boolean;
  graph: ProjectGraph;
}

export const getCommitsForProject =
  (verbose?: boolean) =>
  (plugin: PluginFn) =>
  async (config: any, context: any) => {
    if (!config) {
      throw new Error("Release config is missing.");
    }

    if (!context.commits) {
      throw new Error("Commits are missing.");
    }

    const filteredCommits = await filterCommits(
      context.commits,
      config,
      context,
      verbose
    );
    if (!filteredCommits || filteredCommits.length === 0) {
      context.logger.warn(
        `No commits found for the ${config.projectName} package. Skip analysis.`
      );
    }

    return plugin(config, {
      ...context,
      commits: filteredCommits
    });
  };

export async function filterCommits(
  commits: any[],
  releaseContext: ReleaseContext,
  context: any,
  verbose?: boolean
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const projectName = releaseContext.projectName!;
  const graph = await createProjectGraphAsync();
  const dependencies = await getProjectDependencies(projectName, graph);
  const allDeps = [...dependencies, projectName];

  if (verbose) {
    context.logger.log(
      `Found following dependencies: "${dependencies.join(
        ", "
      )}" for project "${projectName}"`
    );
  }

  const result = await promiseFilter(commits, (commit: any) =>
    isCommitAffectingProjects({
      commit,
      projects: allDeps,
      context: context,
      verbose: verbose,
      graph,
      projectName
    })
  );

  if (verbose) {
    context.logger.log(
      `Filtered ${result.length} commits out of ${commits.length}`
    );
  }

  return result;
}

async function getProjectDependencies(
  projectName: string,
  graph: ProjectGraph
) {
  return getRecursiveDependencies(projectName, graph);
}

export function getRecursiveDependencies(
  projectName: string,
  graph: ProjectGraph
): string[] {
  const deps = graph.dependencies[projectName];

  if (!deps) {
    return [];
  }

  return pipe(
    deps,
    filter((dependency: any) => !dependency.target.startsWith("npm:")),
    map((dependency: any) => dependency.target),
    (filteredDeps: string[]) =>
      filteredDeps.reduce((acc, target) => {
        const targetDeps = getRecursiveDependencies(target, graph);

        return [...acc, ...targetDeps];
      }, filteredDeps)
  );
}

export async function isCommitAffectingProjects({
  commit,
  projects,
  context,
  verbose,
  graph,
  projectName
}: CommitAffectingProjectsParams): Promise<boolean> {
  if (shouldSkipCommit(commit, projectName)) {
    if (verbose) {
      context.logger.log(`ℹ️ Commit ${commit.subject} is skipped`);
    }

    return false;
  }

  const affectedFiles = await listAffectedFilesInCommit(commit);
  const fileChanges = calculateFileChanges(affectedFiles, [], { projects });
  const filteredGraph = await filterAffected(graph, fileChanges);

  const isAffected = projects.some(project =>
    Boolean(filteredGraph.nodes[project])
  );

  if (verbose) {
    context.logger.log(
      `Checking if commit ${commit.subject} affects dependencies`
    );
  }

  if (verbose) {
    if (isAffected) {
      context.logger.log(
        `✔  Commit "${commit.subject}" affects project or its dependencies`
      );
    } else {
      context.logger.log(
        `❌  Commit "${commit.subject}" does not affect project or its dependencies`
      );
    }
  }

  return isAffected;
}

export function shouldSkipCommit(
  commit: Pick<any, "body">,
  projectName: string
): boolean {
  const onlyMatchRegex = /\[only (.*?)]/g;
  const skipMatchRegex = /\[skip (.*?)]/g;

  const skipAll = "[skip all]";
  const skipMatches = Array.from(commit.body.matchAll(skipMatchRegex));
  const onlyMatches = Array.from(commit.body.matchAll(onlyMatchRegex));

  const hasOnlyMatch =
    onlyMatches.length &&
    !onlyMatches.some((match: any) =>
      match[1]
        .split(",")
        .map((project: string) => project.trim())
        .some((project: string) => project === projectName)
    );

  const hasSkipMatch =
    commit.body.includes(skipAll) ||
    (skipMatches.length &&
      skipMatches.some((match: any) =>
        match[1]
          .split(",")
          .map((project: string) => project.trim())
          .some((project: string) => project === projectName)
      ));

  return Boolean(hasSkipMatch || hasOnlyMatch);
}

function listAffectedFilesInCommit(commit: Pick<any, "commit">): string[] {
  // eg. /code/Repo/frontend/
  const cwd = process.cwd() + "/";
  // eg. /code/Repo/
  const repositoryRoot = execSync("git rev-parse --show-toplevel") + "/";
  // Matches the start of a path from the git root to the nx root
  const nxPathPart = new RegExp(`^${cwd.substring(repositoryRoot.length)}`);

  const files = execSync(`git show --name-status ${commit.commit.short}`);

  return files
    .toString()
    .split("\n")
    .map(line => line?.split("\t")?.[1])
    .filter(Boolean)
    .filter((filePath: string) => {
      // only include files inside the nx root
      return filePath.match(nxPathPart);
    })
    .map((filePath: string) => {
      // The filepaths start from the root of the git repository, but
      // in our case we want them to start from the nx root.
      return filePath.replace(nxPathPart, "");
    });
}

export const promiseFilter = <T>(
  array: T[],
  predicate: (item: T) => Promise<boolean>
): Promise<T[]> =>
  Promise.all(
    array.map(item => predicate(item).then(result => (result ? item : null)))
  ).then(results => results.filter(Boolean)) as Promise<T[]>;
