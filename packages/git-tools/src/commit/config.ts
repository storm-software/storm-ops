import commitizenConfig from "../commitizen/config";
import commitlintConfig from "../commitlint/config";
import { CommitStateConfig } from "../types";

const config: CommitStateConfig = {
  ...commitizenConfig,
  ...commitlintConfig,
  questions: {
    ...commitlintConfig.prompt.questions
  }
};

export default config;
