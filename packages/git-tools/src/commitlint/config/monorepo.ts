import { DEFAULT_MONOREPO_COMMIT_RULES } from "../../types";

const config = {
  rules: DEFAULT_MONOREPO_COMMIT_RULES,
  helpUrl: "https://developer.stormsoftware.com/commitlint/monorepo"
};

export type MonorepoCommitlintConfig = typeof config;

export default config;
