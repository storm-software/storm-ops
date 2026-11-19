import { createProjectGraphAsync } from "@nx/devkit";
import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import { hasReleaseChanges } from "../../../packages/git-tools/src/release/check";
import { getReleaseConfig } from "../../../packages/git-tools/src/release/config";

async function checkRelease() {
  const workspaceConfig = await getWorkspaceConfig();
  const projectGraph = await createProjectGraphAsync({ exitOnError: true });
  const releaseConfig = getReleaseConfig(projectGraph, {}, workspaceConfig);

  return (await hasReleaseChanges(projectGraph, releaseConfig, workspaceConfig))
    ? 0
    : 10;
}

// Distinguish a proven no-op from an error; only exit 10 permits skipping builds.
checkRelease()
  .then(code => process.exit(code))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
