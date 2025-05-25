import { hfs } from "@humanfs/node";
import { ProjectGraph } from "@nx/devkit";
import { StormWorkspaceConfig } from "@storm-software/config";
import { joinPaths, writeInfo } from "@storm-software/config-tools";
import chalkTemplate from "chalk-template";
import defu from "defu";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import {
  createProjectGraphAsync,
  readCachedProjectGraph,
  readProjectsConfigurationFromProjectGraph
} from "nx/src/project-graph/project-graph";
import { getScopeEnum, getScopeEnumUtil } from "../commitlint/scope";
import type {
  CommitConfig,
  CommitQuestionAnswers,
  CommitQuestionEnum,
  CommitQuestionProps,
  CommitResolvedConfig,
  CommitScopeProps,
  CommitState,
  CommitTypeProps,
  CommitTypesEnum,
  DefaultCommitQuestionKeys
} from "../types";
import { DEFAULT_COMMIT_CONFIG } from "./config";

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

async function resolveCommitOptions(
  config: CommitConfig,
  workspaceConfig: StormWorkspaceConfig
): Promise<CommitResolvedConfig> {
  return {
    utils: { getScopeEnum: getScopeEnumUtil({ config: workspaceConfig }) },
    parserPreset: "conventional-changelog-conventionalcommits",
    prompt: {
      settings: config.settings,
      messages: config.messages,
      questions: config.questions as CommitQuestionEnum<
        DefaultCommitQuestionKeys,
        CommitQuestionProps
      >
    }
  };
}

async function resolveDefaultCommitOptions(
  config: StormWorkspaceConfig
): Promise<CommitResolvedConfig> {
  return resolveCommitOptions(DEFAULT_COMMIT_CONFIG, config);
}

export async function createState(
  config: StormWorkspaceConfig,
  commitizenFile = "@storm-software/git-tools/commit/config"
): Promise<CommitState> {
  let root: string;

  try {
    root = getGitRootDir();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    throw new Error("Could not find Git root folder.");
  }

  let state!: CommitState;
  if (commitizenFile === "@storm-software/git-tools/commit/config") {
    state = {
      config: await resolveDefaultCommitOptions(config),
      root,
      answers: {}
    };
  } else {
    writeInfo(`Using custom commit config file: ${commitizenFile}`, config);

    let commitizenConfig = await import(commitizenFile);
    if (commitizenConfig?.default) {
      // Handle CommonJS modules that export default as a property
      commitizenConfig = commitizenConfig?.default;
    }

    state = {
      config: await resolveCommitOptions(
        defu(commitizenConfig ?? {}, DEFAULT_COMMIT_CONFIG),
        config
      ),
      root,
      answers: {}
    };
  }

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
    !state.config.prompt.questions.scope ||
    !state.config.prompt.questions.scope.enum ||
    Object.keys(state.config.prompt.questions.scope.enum).length === 0
  ) {
    const scopes = await getScopeEnum({
      config
    });
    for (const scope of scopes) {
      if (scope === "monorepo") {
        state.config.prompt.questions.scope.enum[scope] = {
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
            const packageJson = await hfs.json(packageJsonPath);
            description = packageJson.description || description;
          }

          state.config.prompt.questions.scope.enum[scope] = {
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
    {} as CommitQuestionAnswers
  );

  return state;
}
