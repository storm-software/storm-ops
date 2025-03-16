import type { StormConfig } from "@storm-software/config";
import { ReleaseVersion } from "nx/src/command-line/release/utils/shared";
import { format, resolveConfig } from "prettier";

export async function generateChangelogContent(
  releaseVersion: ReleaseVersion,
  filepath: string,
  newContent: string,
  currentContent?: string,
  project?: string | null,
  workspaceConfig?: StormConfig | null
): Promise<string> {
  const formatOptions = (await resolveConfig(filepath)) ?? {};

  const header = await format(
    `${
      workspaceConfig?.release.banner
        ? `![Storm Software](${workspaceConfig?.release.banner})

`
        : ""
    }# Changelog ${project || workspaceConfig?.name ? "for" : ""}${workspaceConfig?.name ? ` ${titleCase(workspaceConfig.name)}` : ""}${project ? `${workspaceConfig?.name ? " -" : ""} ${titleCase(project)}` : ""}

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

export const titleCase = (input?: string): string | undefined => {
  if (!input) {
    return "";
  }

  return (
    input
      // eslint-disable-next-line no-useless-escape
      .split(/(?=[A-Z])|[\.\-\s_]/)
      .map(s => s.trim())
      .filter(s => !!s)
      .map(s =>
        s
          ? s.toLowerCase().charAt(0).toUpperCase() + s.toLowerCase().slice(1)
          : s
      )
      .join(" ")
  );
};

export function generateChangelogTitle(
  version: string,
  project?: string | null,
  workspaceConfig?: StormConfig | null
): string {
  if (!workspaceConfig?.name || !project) {
    return version;
  }

  return `[${version}](https://github.com/${workspaceConfig.organization}/${workspaceConfig.name}/releases/tag/${project}%40${version}) (${new Date().toISOString().slice(0, 10)})`;
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

  const headings = [...contents.matchAll(CHANGELOG_RELEASE_HEAD_RE)];
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
