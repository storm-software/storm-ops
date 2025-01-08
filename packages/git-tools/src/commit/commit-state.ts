import { hfs } from "@humanfs/node";
import {
  createProjectGraphAsync,
  readProjectsConfigurationFromProjectGraph
} from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import { joinPaths, writeInfo } from "@storm-software/config-tools";
import chalkTemplate from "chalk-template";
import defu from "defu";
import { execSync } from "node:child_process";
import { getScopeEnum, getScopeEnumRule } from "../commitlint/scope";
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
  DefaultCommitQuestionKeys,
  DefaultResolvedCommitRulesEnum
} from "../types";
import { DEFAULT_COMMIT_CONFIG } from "./config";

export const getGitDir = () => {
  const devNull = process.platform === "win32" ? " nul" : "/dev/null";
  const dir = execSync(`git rev-parse --absolute-git-dir 2>${devNull}`)
    .toString()
    .trim();

  return dir;
};

export const getGitRootDir = () => {
  const devNull = process.platform === "win32" ? " nul" : "/dev/null";
  const dir = execSync(`git rev-parse --show-toplevel 2>${devNull}`)
    .toString()
    .trim();

  return dir;
};

const resolveCommitOptions = async (
  config: CommitConfig
): Promise<CommitResolvedConfig<DefaultResolvedCommitRulesEnum>> => {
  return {
    utils: { getScopeEnum },
    parserPreset: "conventional-changelog-conventionalcommits",
    rules: {
      ...config.rules,
      "scope-enum": getScopeEnumRule
    },
    prompt: {
      settings: config.settings,
      messages: config.messages,
      questions: config.questions as CommitQuestionEnum<
        DefaultCommitQuestionKeys,
        CommitQuestionProps
      >
    }
  };
};

const resolveDefaultCommitOptions = async (): Promise<
  CommitResolvedConfig<DefaultResolvedCommitRulesEnum>
> => resolveCommitOptions(DEFAULT_COMMIT_CONFIG);

export const createState = async (
  config: StormConfig,
  commitizenFile = "@storm-software/git-tools/commit/config"
): Promise<CommitState> => {
  let root: string;

  try {
    root = getGitRootDir();
  } catch (_) {
    throw new Error("Could not find Git root folder.");
  }

  let state!: CommitState;
  if (commitizenFile === "@storm-software/git-tools/commit/config") {
    state = {
      config: await resolveDefaultCommitOptions(),
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
        defu(commitizenConfig ?? {}, DEFAULT_COMMIT_CONFIG)
      ),
      root,
      answers: {}
    };
  }

  // if (!state.config.prompt.questions.type) {
  //   state.config.prompt.questions.type = {
  //     name: "type",
  //     message: "Select the type of change that you're committing:",
  //     choices: [],
  //     default: "feat"
  //   };
  // }

  // state.config.questions.type.enum = Object.keys(
  //   defaultCommitizenConfig.types
  // ).map((key: string) => {
  //   let name = key;
  //   let description: string | undefined = undefined;

  //   const type: CommitType | undefined =
  //     key in defaultConfig.types
  //       ? ((defaultConfig.types as Record<string, CommitType>)?.[
  //           key
  //         ] as CommitType)
  //       : undefined;
  //   if (type) {
  //     name = `${key} - ${type.title} ${type.emoji} ${type.description ? type.description : ""}`;
  //     description = type.description;
  //   }

  //   return { name, value: key, description };
  // });

  if (
    state.config.prompt.questions.type &&
    state.config.prompt.questions.type.enum
  ) {
    (state.config.prompt.questions.type as CommitQuestionProps).enum =
      Object.keys(state.config.prompt.questions.type.enum).reduce(
        (ret, key) => {
          ret[key] = {
            ...state.config.prompt.questions.type.enum![key],
            title: chalkTemplate`${state.config.prompt.questions.type.enum![key]?.emoji ? `${state.config.prompt.questions.type.enum![key]?.emoji} ` : ""}{bold ${key}} ${state.config.prompt.questions.type.enum![key]?.title && state.config.prompt.questions.type.enum![key]?.title !== key ? `- ${state.config.prompt.questions.type.enum![key]?.title}` : ""}${(state.config.prompt.questions.type.enum![key] as CommitTypeProps)?.semverBump ? ` (version bump: ${(state.config.prompt.questions.type.enum![key] as CommitTypeProps)?.semverBump})` : ""}`,
            hidden: false
          };

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
    process.env.NX_WORKSPACE_ROOT_PATH ??=
      config.workspaceRoot ?? process.env.STORM_WORKSPACE_ROOT ?? process.cwd();
    const projectGraph = await createProjectGraphAsync({
      exitOnError: true
    });

    const projectConfigs =
      readProjectsConfigurationFromProjectGraph(projectGraph);

    const scopes = await getScopeEnum({});
    for (const scope of scopes) {
      const project = projectConfigs.projects[scope];
      if (project) {
        let description = `${project.name} - ${project.root}`;

        const packageJsonPath = joinPaths(project.root, "package.json");
        if (await hfs.isFile(packageJsonPath)) {
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

  state.answers = Object.keys(state.config.prompt.questions).reduce(
    (ret, key) => {
      ret[key] = "";

      return ret;
    },
    {} as CommitQuestionAnswers
  );

  return state;
};
