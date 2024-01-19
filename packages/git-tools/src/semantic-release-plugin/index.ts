import { wrapStep } from "semantic-release-plugin-decorators";
import { analyzeCommitsForProject } from "./analyze-commits";
import { getCommitsForProject } from "./get-commits-for-project";

const wrapperName = "storm-semantic-release";

const analyzeCommits = wrapStep("analyzeCommits", analyzeCommitsForProject(true), {
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
