import { DEFAULT_MINIMAL_COMMIT_RULES } from "../../types";

const config = {
  rules: DEFAULT_MINIMAL_COMMIT_RULES,
  helpUrl: "https://developer.stormsoftware.com/commitlint/minimal",
  parserOpts: {
    headerPattern: /^(\w*): (.*)$/,
    breakingHeaderPattern: /^(\w*): (.*)$/,
    headerCorrespondence: ["type", "subject"],
    noteKeywords: ["BREAKING CHANGE", "BREAKING-CHANGE"],
    revertPattern:
      /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ["header", "hash"],
    issuePrefixes: ["#"]
  }
};

export type MinimalCommitlintConfig = typeof config;

export default config;
