import { writeInfo } from "@storm-software/config-tools";
import { execSync } from "node:child_process";
import defaultConfig from "../commit/config";
import { getScopeEnum } from "../commitlint/get-scope-enum";
import type {
  CommitQuestions,
  CommitState,
  CommitStateConfig,
  CommitType
} from "../types";
import defaultCommitizenConfig from "./config";

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

export const createState = async (
  commitConfig = "@storm-software/git-tools/src/commit/config.js"
): Promise<CommitState> => {
  let root: string;

  try {
    root = getGitRootDir();
  } catch (_) {
    throw new Error("Could not find Git root folder.");
  }

  let state!: CommitState;
  if (commitConfig === "@storm-software/git-tools/src/commit/config.js") {
    state = {
      config: {
        ...defaultConfig
      } as CommitStateConfig,
      root,
      answers: {}
    };
  } else {
    writeInfo(`Using custom commit config file: ${commitConfig}`);

    let config = (await import(commitConfig))?.default;
    if (config?.default) {
      // Handle CommonJS modules that export default as a property
      config = config?.default;
    }

    state = {
      config: {
        ...defaultConfig,
        ...config,
        questions: {
          ...config.prompt.questions,
          type: {
            ...defaultConfig.questions.type,
            ...(config.prompt
              ? config.prompt.questions?.type
              : config?.questions?.type ?? {}),
            enum: {
              ...defaultConfig.types,
              ...(config?.prompt
                ? config.prompt.questions?.type?.enum
                : config?.types ?? {})
            }
          }
        }
      },
      root,
      answers: {}
    };
  }

  state.config.questions.type.enum = Object.keys(
    defaultCommitizenConfig.types
  ).map((key: string) => {
    let name = key;
    let description: string | undefined = undefined;

    const type: CommitType | undefined =
      key in defaultConfig.types
        ? ((defaultConfig.types as Record<string, CommitType>)?.[
            key
          ] as CommitType)
        : undefined;
    if (type) {
      name = `${key} - ${type.title} ${type.emoji} ${type.description ? type.description : ""}`;
      description = type.description;
    }

    return { name, value: key, description };
  });

  state.config.questions.scope.enum = (await getScopeEnum({})).map(
    (scope: string) => ({
      name: scope,
      value: scope
    })
  );

  state.answers = Object.keys(state.config.questions).reduce(
    (ret: Record<keyof CommitQuestions, string>, key: string) => {
      ret[key] = "";

      return ret;
    },
    {}
  );

  return state;
};
