import importFrom from "import-from";
import { dirname } from "node:path";
import { getWorkspaceRoot } from "./utils";

export const loadParserConfig = async (
  { preset, config, parserOpts, presetConfig },
  { cwd }
) => {
  let loadedConfig;
  const __dirname = dirname(getWorkspaceRoot());

  if (preset) {
    const presetPackage = `conventional-changelog-${preset.toLowerCase()}`;
    loadedConfig = await (
      importFrom.silent(__dirname, presetPackage) ||
      importFrom(cwd, presetPackage)
    )(presetConfig);
  } else if (config) {
    loadedConfig = await (
      importFrom.silent(__dirname, config) || importFrom(cwd, config)
    )();
  }

  return { ...loadedConfig.parserOpts, ...parserOpts };
};
