import type { StormConfig } from "@storm-software/config";
import {
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess,
  writeWarning
} from "@storm-software/config-tools";
import {
  releaseChangelog,
  releasePublish
} from "nx/src/command-line/release/index.js";
import type { ReleaseVersion } from "nx/src/command-line/release/utils/shared.js";
import { readNxJson } from "nx/src/config/nx-json.js";
import { createProjectFileMapUsingProjectGraph } from "nx/src/project-graph/file-map-utils.js";
import { createProjectGraphAsync } from "nx/src/project-graph/project-graph.js";
import { releaseVersion } from "./nx-version";
import { createNxReleaseConfig } from "./release-config";

export interface NxReleaseChangelogResult {
  workspaceChangelog?: {
    releaseVersion: ReleaseVersion;
    contents: string;
  };
  projectChangelogs?: {
    [projectName: string]: {
      releaseVersion: ReleaseVersion;
      contents: string;
    };
  };
}

export type StormReleaseOptions = {
  project?: string;
  firstRelease?: boolean;
  head?: string;
  base?: string;
  dryRun?: boolean;
};

export const runRelease = async (
  config: StormConfig,
  options: StormReleaseOptions
) => {
  try {
    process.env.GIT_AUTHOR_NAME = process.env.GITHUB_ACTOR;
    process.env.GIT_AUTHOR_EMAIL = `${process.env.GITHUB_ACTOR}@users.noreply.github.com`;

    process.env.GIT_COMMITTER_NAME ??= process.env.STORM_BOT || "Stormie-Bot";
    process.env.GIT_COMMITTER_EMAIL = `bot@stormsoftware.com`;

    process.env.NPM_AUTH_TOKEN = process.env.NPM_TOKEN;
    process.env.NODE_AUTH_TOKEN = process.env.NPM_TOKEN;
    process.env.NPM_CONFIG_PROVENANCE = "true";

    writeInfo("Creating workspace Project Graph data...", config);

    const projectGraph = await createProjectGraphAsync({ exitOnError: true });
    const nxJson = readNxJson();

    writeInfo(
      "Reading in the workspaces release configuration from the nx.json file...",
      config
    );
    const { error: configError, nxReleaseConfig } = await createNxReleaseConfig(
      projectGraph,
      await createProjectFileMapUsingProjectGraph(projectGraph),
      nxJson.release
    );
    if (configError) {
      throw new Error(
        `An error occured determining the release configuration: (${
          configError.code
        }) ${JSON.stringify(configError.data)}`
      );
    }

    writeInfo("Determining the current release versions...", config);

    const { workspaceVersion, projectsVersionData } = await releaseVersion(
      config,
      {
        dryRun: false,
        verbose: true,
        preid: config.preid,
        stageChanges: true,
        gitCommit: false,
        gitTag: false
      }
    );

    await releaseChangelog({
      version:
        nxReleaseConfig?.projectsRelationship !== "fixed"
          ? undefined
          : workspaceVersion,
      versionData: projectsVersionData,
      dryRun: false,
      verbose: true,
      to: options.head ?? process.env.NX_HEAD,
      from: options.base ?? process.env.NX_BASE,
      gitCommit: true,
      gitCommitMessage: "chore(release): Publish monorepo release updates",
      createRelease: "github"
    });

    writeInfo("Tagging commit with git", config);

    const changedProjects = Object.keys(projectsVersionData).filter(
      key => projectsVersionData[key]?.newVersion
    );
    if (changedProjects.length > 0) {
      writeInfo(
        `Publishing release for ${changedProjects.length} ${changedProjects.length === 1 ? "project" : "projects"}:
${changedProjects.map(changedProject => `  - ${changedProject}`).join("\n")}
`,
        config
      );

      const result = await releasePublish({
        dryRun: !!options.dryRun,
        verbose: true
      });

      const failedProjects = Object.keys(result).filter(
        key => result[key]?.code && result[key]?.code > 0
      );
      if (failedProjects.length > 0) {
        throw new Error(
          `The Storm release process was not completed successfully! One or more errors occured while running the \`nx-release-publish\` executor tasks.

Please review the workflow details for the following project(s):
${failedProjects.map(failedProject => `  - ${failedProject} (Error Code: ${result[failedProject]?.code})`).join("\n")}
`
        );
      }
    } else {
      writeWarning("Skipped publishing packages.", config);
    }

    writeSuccess("Completed the Storm workspace release process!", config);
  } catch (error) {
    writeFatal(
      "An exception was thrown while running the Storm release workflow.",
      config
    );
    error.message &&
      writeError(
        `${error.name ? `${error.name}: ` : ""}${error.message}${
          error.stack ? `\n${error.stack}` : ""
        }`,
        config
      );

    throw error;
  }
};
