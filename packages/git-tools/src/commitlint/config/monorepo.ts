import { COMMIT_CONFIGS } from "conventional-changelog-storm-software/configs";

const config = {
  ...COMMIT_CONFIGS.monorepo.commitlint
};

export type MonorepoCommitlintConfig = typeof config;

export default config;
