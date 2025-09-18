import { COMMIT_CONFIGS } from "conventional-changelog-storm-software/configs";

const config = {
  ...COMMIT_CONFIGS.minimal.commitlint
};

export type MinimalCommitlintConfig = typeof config;

export default config;
