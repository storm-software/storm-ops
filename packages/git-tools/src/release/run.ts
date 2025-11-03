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
  writeFatal,
  writeInfo,
  writeSuccess,
  writeTrace,
  writeWarning
} from "@storm-software/config-tools";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import type {
  ReleaseVersion,
  VersionData
} from "nx/src/command-line/release/utils/shared.js";
import { ReleaseConfig } from "../types";
import { isUserAnOrganizationMember } from "./github";
import { StormReleaseClient } from "./release-client";

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

export type ReleaseOptions = Partial<ReleaseConfig> & {
  project?: string;
  head?: string;
  base?: string;
  dryRun?: boolean;
  skipPublish?: boolean;
  ignoreNxJsonConfig?: boolean;
};

export const runRelease = async (
  config: StormWorkspaceConfig,
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    project,
    head,
    base,
    dryRun = false,
    skipPublish = false,
    ignoreNxJsonConfig = false,
    ...releaseConfig
  }: ReleaseOptions
) => {
  if (!process.env.GITHUB_ACTOR) {
    throw new Error("The `GITHUB_ACTOR` environment variable is not set.");
  }

  if (!(await isUserAnOrganizationMember(process.env.GITHUB_ACTOR, config))) {
    writeFatal(
      "You must be a member of the Storm Software organization to run the release process.",
      config
    );
    throw new Error(
      `The GitHub actor "${
        process.env.GITHUB_ACTOR
      }" is not a member of the organization "${
        typeof config.organization === "string"
          ? config.organization
          : config.organization?.name
      }". Only members of the organization can initiate releases.`
    );
  }

  const name = config.bot.name;
  const email = config.bot.email
    ? config.bot.email
    : config.bot.name
      ? `${config.bot.name}@users.noreply.github.com`
      : "bot@stormsoftware.com";

  process.env.GIT_AUTHOR_NAME = name;
  process.env.GIT_AUTHOR_EMAIL = email;
  process.env.GIT_COMMITTER_NAME = name;
  process.env.GIT_COMMITTER_EMAIL = email;

  process.env.NODE_AUTH_TOKEN = process.env.NPM_TOKEN;
  process.env.NPM_AUTH_TOKEN = process.env.NPM_TOKEN;
  process.env.NPM_CONFIG_PROVENANCE = "true";

  writeDebug("Creating Storm release client...", config);

  const releaseClient = await StormReleaseClient.create(
    releaseConfig,
    ignoreNxJsonConfig,
    config
  );

  writeDebug("Reading in the workspaces release configuration", config);

  const to = head || process.env.NX_HEAD;
  const from = base || process.env.NX_BASE;

  writeDebug(
    `Using the following Git SHAs to determine the release content:
 - From: ${from}
 - To: ${to}
`,
    config
  );

  writeDebug("Determining the current release versions...", config);

  const { workspaceVersion, projectsVersionData, releaseGraph } =
    await releaseClient.releaseVersion({
      dryRun: false,
      verbose: isVerbose(config.logLevel),
      preid: config.preid,
      deleteVersionPlans: false,
      stageChanges: true,
      gitCommit: false
    });

  await releaseClient.releaseChangelog({
    version:
      releaseConfig?.projectsRelationship === "fixed"
        ? workspaceVersion
        : undefined,
    versionData: projectsVersionData,
    dryRun: false,
    verbose: isVerbose(config.logLevel),
    to,
    from,
    releaseGraph
  });

  writeDebug("Tagging commit with git", config);

  if (skipPublish) {
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

      const result = await releaseClient.releasePublish({
        dryRun: !!dryRun,
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
        if (
          projectNode?.data.root &&
          versionData &&
          versionData.newVersion !== null
        ) {
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
