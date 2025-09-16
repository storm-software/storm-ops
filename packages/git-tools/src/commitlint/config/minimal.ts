import { DEFAULT_MINIMAL_COMMIT_RULES } from "../../types";

const config = {
  rules: DEFAULT_MINIMAL_COMMIT_RULES,
  helpUrl: "https://developer.stormsoftware.com/commitlint/minimal"
};

export type MinimalCommitlintConfig = typeof config;

export default config;
