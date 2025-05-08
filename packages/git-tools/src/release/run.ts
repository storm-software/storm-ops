import {
  createProjectGraphAsync,
  ProjectGraph,
  readCachedProjectGraph
} from "@nx/devkit";
import type { StormWorkspaceConfig } from "@storm-software/config";
import {
  isVerbose,
  joinPaths,
  parseCargoToml,
  stringifyCargoToml,
  writeDebug,
  writeInfo,
  writeSuccess,
  writeTrace,
  writeWarning
} from "@storm-software/config-tools";
import defu from "defu";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import type { ReleaseOptions } from "nx/src/command-line/release/command-object.js";
import { createAPI as createReleasePublishAPI } from "nx/src/command-line/release/publish.js";
import type {
  ReleaseVersion,
  VersionData
} from "nx/src/command-line/release/utils/shared.js";
import { createAPI as createReleaseVersionAPI } from "nx/src/command-line/release/version.js";
import { NxReleaseConfiguration, readNxJson } from "nx/src/config/nx-json.js";
import { createAPI as createReleaseChangelogAPI } from "./changelog";
import { DEFAULT_RELEASE_CONFIG, DEFAULT_RELEASE_GROUP_CONFIG } from "./config";

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

export type StormReleaseOptions = ReleaseOptions & {
  project?: string;
  head?: string;
  base?: string;
  dryRun?: boolean;
};

export const runRelease = async (
  config: StormWorkspaceConfig,
  options: StormReleaseOptions
) => {
  process.env.GIT_AUTHOR_NAME = process.env.GITHUB_ACTOR;
  process.env.GIT_AUTHOR_EMAIL = `${process.env.GITHUB_ACTOR}@users.noreply.github.com`;

  process.env.GIT_COMMITTER_NAME = config.bot.name;
  process.env.GIT_COMMITTER_EMAIL =
    config.bot.email || config.bot.name
      ? `${config.bot.name}@users.noreply.github.com`
      : "bot@stormsoftware.com";

  process.env.NODE_AUTH_TOKEN = process.env.NPM_TOKEN;
  process.env.NPM_AUTH_TOKEN = process.env.NPM_TOKEN;
  process.env.NPM_CONFIG_PROVENANCE = "true";

  writeDebug("Creating workspace Project Graph data...", config);

  const nxJson = readNxJson();

  writeDebug("Reading in the workspaces release configuration", config);

  const to = options.head || process.env.NX_HEAD;
  const from = options.base || process.env.NX_BASE;

  writeDebug(
    `Using the following Git SHAs to determine the release content:
 - From: ${from}
 - To: ${to}
`,
    config
  );

  if (nxJson.release?.groups) {
    nxJson.release.groups = Object.keys(nxJson.release.groups).reduce(
      (ret, groupName) => {
        const groupConfig = nxJson.release?.groups?.[groupName];

        ret[groupName] = defu(groupConfig, DEFAULT_RELEASE_GROUP_CONFIG);
        return ret;
      },
      {}
    );
  }

  const nxReleaseConfig = defu(
    nxJson.release,
    DEFAULT_RELEASE_CONFIG
  ) as NxReleaseConfiguration;

  writeInfo(
    "Using the following `nx.json` release configuration values",
    config
  );
  writeInfo(nxReleaseConfig, config);

  const releaseVersion = createReleaseVersionAPI(nxReleaseConfig);
  const releaseChangelog = createReleaseChangelogAPI(nxReleaseConfig);
  const releasePublish = createReleasePublishAPI(nxReleaseConfig);

  writeDebug("Determining the current release versions...", config);

  const { workspaceVersion, projectsVersionData } = await releaseVersion({
    dryRun: false,
    verbose: isVerbose(config.logLevel),
    preid: config.preid,
    deleteVersionPlans: false,
    stageChanges: true,
    gitCommit: false
  });

  await releaseChangelog({
    ...options,
    version:
      nxReleaseConfig?.projectsRelationship !== "fixed"
        ? undefined
        : workspaceVersion,
    versionData: projectsVersionData,
    dryRun: false,
    verbose: isVerbose(config.logLevel),
    to,
    from,
    gitCommit: true,
    gitCommitMessage: "release(monorepo): Publish workspace release updates"
  });

  writeDebug("Tagging commit with git", config);

  if (options.skipPublish) {
    writeWarning(
      "Skipping publishing packages since `skipPublish` was provided as `true` in the release options.",
      config
    );
  } else {
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

      await updatePackageManifests(projectsVersionData, config);

      const result = await releasePublish({
        ...options,
        dryRun: !!options.dryRun,
        verbose: isVerbose(config.logLevel)
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
  }

  writeSuccess("Completed the Storm workspace release process!", config);
};

async function updatePackageManifests(
  projectsVersionData: VersionData,
  config: StormWorkspaceConfig
) {
  let projectGraph!: ProjectGraph;
  try {
    projectGraph = readCachedProjectGraph();
  } catch {
    await createProjectGraphAsync();
    projectGraph = readCachedProjectGraph();
  }

  if (projectGraph) {
    await Promise.all(
      Object.keys(projectsVersionData).map(async node => {
        const projectNode = projectGraph.nodes[node];
        if (!projectNode?.data.root) {
          writeWarning(
            `Project node ${node} not found in the project graph. Skipping manifest update.`,
            config
          );
          return;
        }

        const versionData = projectsVersionData[node];
        if (projectNode?.data.root && versionData) {
          writeTrace(
            `Writing version ${versionData.newVersion} update to manifest file for ${node}
        `,
            config
          );

          const projectRoot = joinPaths(
            config.workspaceRoot,
            projectNode.data.root
          );

          const packageJsonPath = joinPaths(projectRoot, "package.json");
          const cargoTomlPath = joinPaths(projectRoot, "Cargo.toml");

          if (existsSync(packageJsonPath)) {
            const packageJsonContent = await readFile(packageJsonPath, "utf8");
            const packageJson = JSON.parse(packageJsonContent);

            packageJson.version = versionData.newVersion;
            await writeFile(packageJsonPath, JSON.stringify(packageJson));
          } else if (existsSync(cargoTomlPath)) {
            const cargoToml = parseCargoToml(
              await readFile(cargoTomlPath, "utf8")
            );

            cargoToml.package ??= {};
            cargoToml.package.version = versionData.newVersion;
            await writeFile(cargoTomlPath, stringifyCargoToml(cargoToml));
          }
        }
      })
    );
  } else {
    writeWarning("No project nodes found. Skipping manifest updates.", config);
  }
}
