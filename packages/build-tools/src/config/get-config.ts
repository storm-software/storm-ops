import type {
  BuildOptions,
  GetConfigParams,
  TsupGetConfigOptions
} from "../types";

export const getConfig = (
  workspaceRoot: string,
  projectRoot: string,
  getConfigFn: (options: GetConfigParams) => BuildOptions,
  { outputPath, tsConfig, platform, ...rest }: TsupGetConfigOptions
) => {
  return getConfigFn({
    ...rest,
    additionalEntryPoints: [],
    outDir: outputPath,
    tsconfig: tsConfig,
    workspaceRoot,
    projectRoot,
    platform
  });
};
