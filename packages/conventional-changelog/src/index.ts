import { COMMIT_TYPES } from "./commit-types";
import { createParserOpts } from "./parser";
import { PresetConfig } from "./types/config";
import { StormSoftwarePreset } from "./types/preset";
import { CHANGELOG_COMMITS } from "./utilities/constants";
import { resolveOptions } from "./utilities/options";
import { createWhatBump } from "./whatBump";
import { createWriterOpts } from "./writer";

export { CHANGELOG_COMMITS as CHANGELOG_COMMIT_TYPES, COMMIT_TYPES };

/**
 * Create a preset configuration for Storm Software changelog conventions.
 *
 * @param config - The configuration object.
 * @returns The preset configuration.
 */
export default async function createPreset(
  config: PresetConfig = {}
): Promise<StormSoftwarePreset> {
  const options = await resolveOptions(config);

  return {
    commits: {
      ignore: config.ignoreCommits,
      merges: false
    },
    parser: createParserOpts(options.workspace.variant),
    writer: await createWriterOpts(options),
    whatBump: createWhatBump(options)
  };
}
