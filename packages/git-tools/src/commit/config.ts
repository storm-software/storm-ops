import commitizenConfig from "../commitizen/config";
import commitlintConfig from "../commitlint/config";
import type { CommitQuestions, CommitStateConfig } from "../types";

const config: CommitStateConfig = {
  ...commitizenConfig,
  ...commitlintConfig,
  questions: {
    ...(commitlintConfig.prompt.questions as unknown as CommitQuestions)
  }
};

export default config;
