import { ProjectGraph } from "@nx/devkit";
import { StormWorkspaceConfig } from "@storm-software/config";
import { joinPaths } from "@storm-software/config-tools";
import chalkTemplate from "chalk-template";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import {
  createProjectGraphAsync,
  readCachedProjectGraph,
  readProjectsConfigurationFromProjectGraph
} from "nx/src/project-graph/project-graph";
import { getScopeEnum } from "../commitlint/scope";
import type {
  CommitQuestionProps,
  CommitScopeProps,
  CommitTypeProps,
  CommitTypesEnum,
  MinimalCommitState,
  MonorepoCommitQuestionEnum,
  MonorepoCommitState
} from "../types";
import { resolveCommitConfig } from "./helpers";

export function getGitDir() {
  const devNull = process.platform === "win32" ? " nul" : "/dev/null";
  const dir = execSync(`git rev-parse --absolute-git-dir 2>${devNull}`)
    .toString()
    .trim();

  return dir;
}

export function getGitRootDir() {
  const devNull = process.platform === "win32" ? " nul" : "/dev/null";
  const dir = execSync(`git rev-parse --show-toplevel 2>${devNull}`)
    .toString()
    .trim();

  return dir;
}

/**
 * Creates the commit state used to run the commit prompt
 *
 * @param workspaceConfig - The Storm workspace configuration
 * @param configPath - The path to the commit configuration file
 * @returns The commit state
 */
export async function createState<
  TWorkspaceConfig extends StormWorkspaceConfig = StormWorkspaceConfig,
  TCommitState extends TWorkspaceConfig["variant"] extends "minimal"
    ? MinimalCommitState
    : MonorepoCommitState = TWorkspaceConfig["variant"] extends "minimal"
    ? MinimalCommitState
    : MonorepoCommitState
>(
  workspaceConfig: TWorkspaceConfig,
  configPath?: string
): Promise<TCommitState> {
  let root: string;

  try {
    root = getGitRootDir();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    throw new Error("Could not find Git root folder.");
  }

  const state = {
    variant: workspaceConfig.variant,
    config: await resolveCommitConfig(workspaceConfig, configPath),
    root,
    answers: {}
  };

  if (
    state.config.prompt.questions.type &&
    state.config.prompt.questions.type.enum
  ) {
    (state.config.prompt.questions.type as CommitQuestionProps).enum =
      Object.keys(state.config.prompt.questions.type.enum).reduce(
        (ret, key) => {
          if (state.config.prompt.questions.type.enum) {
            ret[key] = {
              ...state.config.prompt.questions.type.enum[key],
              title: chalkTemplate`${
                state.config.prompt.questions.type.enum[key]?.emoji
                  ? `${state.config.prompt.questions.type.enum[key]?.emoji} `
                  : ""
              }{bold ${key}} ${
                state.config.prompt.questions.type.enum[key]?.title &&
                state.config.prompt.questions.type.enum[key]?.title !== key
                  ? `- ${state.config.prompt.questions.type.enum[key]?.title}`
                  : ""
              }${
                (
                  state.config.prompt.questions.type.enum[
                    key
                  ] as CommitTypeProps
                )?.semverBump
                  ? ` (version bump: ${
                      (
                        state.config.prompt.questions.type.enum[
                          key
                        ] as CommitTypeProps
                      )?.semverBump
                    })`
                  : ""
              }`,
              hidden: false
            };
          }

          return ret;
        },
        {} as CommitTypesEnum
      );
  }

  if (
    workspaceConfig.variant === "monorepo" &&
    (!(state.config.prompt.questions as MonorepoCommitQuestionEnum)?.scope ||
      !(state.config.prompt.questions as MonorepoCommitQuestionEnum)?.scope
        .enum ||
      Object.keys(
        (state.config.prompt.questions as MonorepoCommitQuestionEnum)?.scope
          .enum
      ).length === 0)
  ) {
    const scopes = await getScopeEnum({
      config: workspaceConfig
    });
    for (const scope of scopes) {
      if (scope === "monorepo") {
        (
          state.config.prompt.questions as MonorepoCommitQuestionEnum
        ).scope.enum[scope] = {
          title: chalkTemplate`{bold monorepo} - workspace root`,
          description: "The base workspace package (workspace root)",
          hidden: false,
          projectRoot: "/"
        } as CommitScopeProps;
      } else {
        let projectGraph!: ProjectGraph;
        try {
          projectGraph = readCachedProjectGraph();
        } catch {
          await createProjectGraphAsync();
          projectGraph = readCachedProjectGraph();
        }

        if (!projectGraph) {
          throw new Error(
            "Failed to load the project graph. Please run `nx reset`, then run the `storm-git commit` command again."
          );
        }

        const projectConfigurations =
          readProjectsConfigurationFromProjectGraph(projectGraph);
        if (!projectConfigurations?.projects?.[scope]) {
          throw new Error(
            `Failed to load the project configuration for project ${scope}. Please run \`nx reset\`, then run the \`storm-git commit\` command again.`
          );
        }

        const project = projectConfigurations.projects[scope];
        if (project) {
          let description = `${project.name} - ${project.root}`;

          const packageJsonPath = joinPaths(project.root, "package.json");
          if (existsSync(packageJsonPath)) {
            const packageJsonFile = await readFile(packageJsonPath, "utf8");
            const packageJson = JSON.parse(packageJsonFile);

            description = packageJson.description || description;
          }

          (
            state.config.prompt.questions as MonorepoCommitQuestionEnum
          ).scope.enum[scope] = {
            title: chalkTemplate`{bold ${project.name}} - ${project.root}`,
            description,
            hidden: false,
            projectRoot: project.root
          } as CommitScopeProps;
        }
      }
    }
  }

  state.answers = Object.keys(state.config.prompt.questions).reduce(
    (ret, key) => {
      ret[key] = "";

      return ret;
    },
    {} as TCommitState["answers"]
  );

  return state as TCommitState;
}
