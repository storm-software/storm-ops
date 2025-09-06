import { DEFAULT_MONOREPO_COMMIT_RULES } from "../../types";

const config = {
  rules: DEFAULT_MONOREPO_COMMIT_RULES,
  helpUrl: "https://developer.stormsoftware.com/commitlint/monorepo",
  parserOpts: {
    headerPattern: /^(\w*)(?:\((.*)\))!?: (.*)$/,
    breakingHeaderPattern: /^(\w*)(?:\((.*)\))!: (.*)$/,
    headerCorrespondence: ["type", "scope", "subject"],
    noteKeywords: ["BREAKING CHANGE", "BREAKING-CHANGE"],
    revertPattern:
      /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ["header", "hash"],
    issuePrefixes: ["#"]
  }
};

export type MonorepoCommitlintConfig = typeof config;

export default config;
