import { ProjectGraph } from "@nx/devkit";
import { StormWorkspaceConfig } from "@storm-software/config";
import { NxReleaseConfig } from "nx/src/command-line/release/config/config";
import { ReleaseGroupWithName } from "nx/src/command-line/release/config/filter-release-groups";
import { sanitizeProjectNameForGitTag } from "nx/src/command-line/release/utils/git";
import { ReleaseGraph as NxReleaseGraph } from "nx/src/command-line/release/utils/release-graph";
import { deriveSpecifierFromConventionalCommits } from "nx/src/command-line/release/version/derive-specifier-from-conventional-commits";
import { ProjectLogger } from "nx/src/command-line/release/version/project-logger";
import { prerelease } from "semver";
import { getLatestGitTagForPattern } from "../utilities/git-utils";
import { ReleaseGraph } from "./release-graph";

/**
 * Read-only check before building release artifacts. Use the same tag, scope,
 * affected-project and commit-type rules as versioning, without loading version
 * actions (which may themselves need to be built first).
 *
 * Release modes that cannot be decided from conventional commits proceed through
 * the normal release path rather than risking a false no-op.
 */
export async function hasReleaseChanges(
  projectGraph: ProjectGraph,
  releaseConfig: NxReleaseConfig,
  workspaceConfig: StormWorkspaceConfig
): Promise<boolean> {
  if (releaseConfig.docker || !Object.keys(releaseConfig.groups ?? {}).length) {
    return true;
  }
  const groups: ReleaseGroupWithName[] = Object.entries(
    releaseConfig.groups ?? {}
  ).map(([name, group]) => ({
    ...group,
    name,
    resolvedVersionPlans: group.versionPlans ? [] : false
  }));
  const graph = new ReleaseGraph(groups, {}, workspaceConfig);

  for (const group of groups) {
    if (
      group.versionPlans ||
      group.docker ||
      group.projectsRelationship !== "independent"
    ) {
      return true;
    }
    for (const project of group.projects) {
      const node = projectGraph.nodes[project]!;
      const config = ReleaseGraph.resolveFinalConfigForProject(
        group,
        node,
        false
      );
      if (
        config.specifierSource !== "conventional-commits" ||
        config.currentVersionResolver !== "git-tag"
      ) {
        return true;
      }
      const tag = await getLatestGitTagForPattern(
        workspaceConfig,
        group.releaseTag.pattern,
        {
          projectName: sanitizeProjectNameForGitTag(project),
          releaseGroupName: group.name
        },
        graph.resolveRepositoryTags.bind(graph),
        { ...group.releaseTag, preid: workspaceConfig.preid }
      );
      if (!tag) {
        return true;
      }
      const bump = await deriveSpecifierFromConventionalCommits(
        { ...releaseConfig, git: releaseConfig.git ?? {} },
        projectGraph,
        new ProjectLogger(project),
        group,
        node,
        !!prerelease(tag.extractedVersion),
        tag,
        graph as unknown as NxReleaseGraph,
        config.fallbackCurrentVersionResolver,
        workspaceConfig.preid ?? ""
      );
      if (bump !== "none") {
        return true;
      }
    }
  }
  return false;
}
