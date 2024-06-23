import path from "node:path";
import packageJson from "../../../package.json";

const repoUrl = "https://github.com/storm-software/storm-ops";

export default function getDocumentationUrl(filename) {
  const ruleName = path.basename(filename, "");
  return `${repoUrl}/blob/v${packageJson.version}/docs/rules/${ruleName}.md`;
}
