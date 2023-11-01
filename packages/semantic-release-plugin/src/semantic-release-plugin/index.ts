import { wrapStep } from "semantic-release-plugin-decorators";
import {
  analyzeCommitsForProject,
  getCommitsForProject
} from "./analyze-commits";

const wrapperName = "storm-semantic-release";

const analyzeCommits = wrapStep(
  "analyzeCommits",
  analyzeCommitsForProject(true),
  {
    wrapperName
  }
);

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
