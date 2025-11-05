import { output, ProjectGraphProjectNode, Tree } from "@nx/devkit";
import {
  STORM_DEFAULT_RELEASE_BANNER,
  type StormWorkspaceConfig
} from "@storm-software/config";
import {
  writeDebug,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import chalk from "chalk";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { DependencyBump } from "nx/release/changelog-renderer";
import {
  ChangelogChange,
  NxReleaseChangelogResult,
  PostGitTask
} from "nx/src/command-line/release/changelog";
import { NxReleaseConfig } from "nx/src/command-line/release/config/config";
import { ReleaseGroupWithName } from "nx/src/command-line/release/config/filter-release-groups";
import { printAndFlushChanges } from "nx/src/command-line/release/utils/print-changes";
import {
  noDiffInChangelogMessage,
  ReleaseVersion,
  shouldPreferDockerVersionForReleaseGroup,
  VersionData
} from "nx/src/command-line/release/utils/shared";
import { interpolate } from "nx/src/tasks-runner/utils";
import { format, resolveConfig } from "prettier";
import StormChangelogRenderer from "../release/changelog-renderer";
import { createGithubRemoteReleaseClient } from "../release/github";
import { ChangelogOptions } from "../release/release-client";
import { ReleaseConfig } from "../types";
import { titleCase } from "./title-case";

export async function generateChangelogContent(
  releaseVersion: ReleaseVersion,
  filepath: string,
  newContent: string,
  currentContent?: string,
  project?: string | null,
  workspaceConfig?: StormWorkspaceConfig | null
): Promise<string> {
  const formatOptions = (await resolveConfig(filepath)) ?? {};

  const bannerUrl =
    typeof workspaceConfig?.release.banner === "string"
      ? workspaceConfig?.release.banner
      : workspaceConfig?.release.banner?.url;

  const header = await format(
    `![${
      (typeof workspaceConfig?.release.banner === "string"
        ? workspaceConfig.organization
          ? titleCase(
              typeof workspaceConfig.organization === "string"
                ? workspaceConfig.organization
                : workspaceConfig.organization.name
            )
          : undefined
        : workspaceConfig?.release.banner.alt) || "Branded release banner image"
    }](${bannerUrl || STORM_DEFAULT_RELEASE_BANNER})

# Changelog ${project || workspaceConfig?.name ? "for" : ""}${workspaceConfig?.name ? ` ${titleCase(workspaceConfig.name)}` : ""}${project ? `${workspaceConfig?.name ? " -" : ""} ${titleCase(project)}` : ""}

`,
    {
      ...formatOptions,
      filepath
    }
  );

  let changelogContents = (currentContent || "").replaceAll(header, "").trim();
  const changelogReleases = parseChangelogMarkdown(changelogContents).releases;

  const existingVersionToUpdate = changelogReleases.find(
    r => r.version === releaseVersion.rawVersion
  );
  if (existingVersionToUpdate) {
    changelogContents = changelogContents.replace(
      `## ${generateChangelogTitle(releaseVersion.rawVersion, project, workspaceConfig)}\n\n\n${existingVersionToUpdate.body}`,
      newContent
    );
  } else {
    // No existing version, simply prepend the new release to the top of the file
    changelogContents = `${newContent}\n\n${changelogContents}`;
  }

  return await format(
    `${header}

${changelogContents}`,
    {
      ...formatOptions,
      filepath
    }
  );
}

export function generateChangelogTitle(
  version: string,
  project?: string | null,
  workspaceConfig?: StormWorkspaceConfig | null
): string {
  if (!workspaceConfig?.name || !project) {
    return version;
  }

  return `[${version}](https://github.com/${
    typeof workspaceConfig.organization === "string"
      ? workspaceConfig.organization
      : workspaceConfig.organization?.name
  }/${workspaceConfig.name}/releases/tag/${project}%40${version}) (${
    new Date().getMonth() + 1
  }/${new Date().getDate()}/${new Date().getFullYear()})`;
}

export function parseChangelogMarkdown(contents: string) {
  /**
   * The release header may include prerelease identifiers (e.g., -alpha.13),
   * and major releases may use a single #, instead of the standard ## used
   * for minor and patch releases. This regex matches all of these cases.
   */
  const CHANGELOG_RELEASE_HEAD_RE = new RegExp(
    "^#+\\s*\\[?(\\d+\\.\\d+\\.\\d+(?:-[a-zA-Z0-9\\.]+)?)\\]?",
    "gm"
  );

  const headings = contents
    ? [...contents.matchAll(CHANGELOG_RELEASE_HEAD_RE)]
    : [];
  const releases: { version?: string; body: string }[] = [];

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    if (!heading) {
      continue; // Skip if no match found
    }

    const nextHeading = headings[i + 1];
    const version = heading[1];

    const release = {
      version: version,
      body: contents
        .slice(
          heading.index + heading[0].length,
          nextHeading ? nextHeading.index : contents.length
        )
        .trim()
    };
    releases.push(release);
  }

  return {
    releases
  };
}

export function filterHiddenChanges(
  changes: ChangelogChange[],
  conventionalCommitsConfig: NxReleaseConfig["conventionalCommits"]
): ChangelogChange[] {
  return changes.filter(change => {
    const type = change.type;

    const typeConfig = conventionalCommitsConfig.types[type];
    if (!typeConfig) {
      // don't include changes with unknown types
      return false;
    }
    return !typeConfig.changelog.hidden;
  });
}

export async function generateChangelogForProjects({
  args,
  changes,
  projectsVersionData,
  releaseGroup,
  projects,
  releaseConfig,
  projectToAdditionalDependencyBumps,
  workspaceConfig,
  ChangelogRendererClass
}: {
  tree: Tree;
  args: ChangelogOptions;
  changes: ChangelogChange[];
  projectsVersionData: VersionData;
  releaseGroup: ReleaseGroupWithName;
  projects: ProjectGraphProjectNode[];
  releaseConfig: ReleaseConfig;
  projectToAdditionalDependencyBumps: Map<string, DependencyBump[]>;
  workspaceConfig: StormWorkspaceConfig;
  ChangelogRendererClass: typeof StormChangelogRenderer;
}): Promise<NxReleaseChangelogResult["projectChangelogs"] | undefined> {
  const config = releaseGroup.changelog;
  // The entire feature is disabled at the release group level, exit early
  if (config === false) {
    return;
  }

  const dryRun = !!args.dryRun;

  const remoteReleaseClient = await createGithubRemoteReleaseClient(
    workspaceConfig,
    args.gitRemote
  );

  const projectChangelogs: NxReleaseChangelogResult["projectChangelogs"] = {};

  for (const project of projects) {
    let interpolatedTreePath = config.file || "";
    if (interpolatedTreePath) {
      interpolatedTreePath = interpolate(interpolatedTreePath, {
        projectName: project.name,
        projectRoot: project.data.root,
        workspaceRoot: "" // within the tree, workspaceRoot is the root
      });
    }

    /**
     * newVersion will be null in the case that no changes were detected (e.g. in conventional commits mode),
     * no changelog entry is relevant in that case.
     */
    if (
      !projectsVersionData[project.name] ||
      (projectsVersionData[project.name]?.newVersion === null &&
        !projectsVersionData[project.name]?.dockerVersion)
    ) {
      continue;
    }

    const preferDockerVersion =
      shouldPreferDockerVersionForReleaseGroup(releaseGroup);
    const releaseVersion = new ReleaseVersion({
      version: ((preferDockerVersion === true ||
        preferDockerVersion === "both") &&
      projectsVersionData[project.name]?.dockerVersion
        ? projectsVersionData[project.name]?.dockerVersion
        : projectsVersionData[project.name]?.newVersion)!,
      releaseTagPattern: releaseGroup.releaseTag.pattern,
      projectName: project.name
    });

    if (interpolatedTreePath) {
      const prefix = dryRun ? "Previewing" : "Generating";
      output.log({
        title: `${prefix} an entry in ${interpolatedTreePath} for ${chalk.white(
          releaseVersion.gitTag
        )}`
      });
    }

    const changelogRenderer = new ChangelogRendererClass({
      changes,
      changelogEntryVersion: releaseVersion.rawVersion,
      project: project.name,
      entryWhenNoChanges:
        typeof config.entryWhenNoChanges === "string"
          ? interpolate(config.entryWhenNoChanges, {
              projectName: project.name,
              projectRoot: project.data.root,
              workspaceRoot: "" // within the tree, workspaceRoot is the root
            })
          : false,
      changelogRenderOptions: config.renderOptions,
      isVersionPlans: !!releaseGroup.versionPlans,
      conventionalCommitsConfig: releaseConfig.conventionalCommits,
      dependencyBumps: projectToAdditionalDependencyBumps.get(project.name),
      remoteReleaseClient,
      workspaceConfig
    });
    const contents = await changelogRenderer.render();

    const postGitTask: PostGitTask | null =
      args.createRelease !== false && config.createRelease
        ? remoteReleaseClient.createPostGitTask(
            releaseVersion,
            contents,
            dryRun
          )
        : null;

    projectChangelogs[project.name] = {
      releaseVersion,
      contents,
      postGitTask
    };
  }

  for (const [projectName, projectChangelog] of Object.entries(
    projectChangelogs
  )) {
    if (!this.projectGraph.nodes[projectName]?.data.root) {
      writeWarning(
        `A changelog was generated for ${
          projectName
        }, but it could not be found in the project graph. Skipping writing changelog file.`,
        this.workspaceConfig
      );
    } else if (projectChangelog.contents) {
      const filePath = joinPaths(
        this.projectGraph.nodes[projectName].data.root,
        "CHANGELOG.md"
      );

      let currentContent: string | undefined;
      if (existsSync(filePath)) {
        currentContent = await readFile(filePath, "utf8");
      }

      writeDebug(
        `✍️  Writing changelog for project ${projectName} to ${filePath}`,
        this.workspaceConfig
      );

      const content = await generateChangelogContent(
        projectChangelog.releaseVersion,
        filePath,
        projectChangelog.contents,
        currentContent,
        projectName,
        this.workspaceConfig
      );

      this.tree.write(filePath, content);

      printAndFlushChanges(
        this.tree,
        !!args.dryRun,
        3,
        false,
        noDiffInChangelogMessage,
        // Only print the change for the current changelog file at this point
        f => f.path === filePath
      );
    }
  }

  return projectChangelogs;
}
