import { wrapStep } from "semantic-release-plugin-decorators";
import { getCommitsForProject } from "./analyze-commits";

export * from "./release-context";

const wrapperName = "storm-semantic-release";

const analyzeCommits = wrapStep("analyzeCommits", getCommitsForProject(true), {
  wrapperName
});

const generateNotes = wrapStep("generateNotes", getCommitsForProject(false), {
  wrapperName
});

const success = wrapStep("success", getCommitsForProject(false), {
  wrapperName
});

const prepare = wrapStep("prepare", getCommitsForProject(false), {
  wrapperName
});

export { analyzeCommits, generateNotes, prepare, success };
