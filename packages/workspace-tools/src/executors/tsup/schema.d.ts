import type { EsBuildExecutorOptions } from "@nx/esbuild/src/executors/esbuild/schema.d.ts";
import type { GetConfigParams } from "@storm-software/build-tools";

export type Platform = "browser" | "neutral" | "node" | "worker";

export type TsupExecutorSchema = Omit<
  EsBuildExecutorOptions,
  | "main"
  | "outputFileName"
  | "metafile"
  | "generatePackageJson"
  | "sourcemap"
  | "minify"
  | "format"
  | "target"
  | "thirdParty"
  | "skipTypeCheck"
  | "esbuildOptions"
  | "esbuildConfig"
  | "platform"
> & {
  entry: string;
  options?: Options;
  clean?: boolean;
  debug?: boolean;
  banner?: string;
  verbose?: boolean;
  define?: Record<string, string | undefined | null>;
  env?: Record<string, string | undefined | null>;
  apiReport?: boolean;
  docModel?: boolean;
  tsdocMetadata?: boolean;
  includeSrc?: boolean;
  platform?: Platform;
  plugins?: any[];
  shims?: boolean;
  splitting?: boolean;
  treeshake?: boolean;
  generatePackageJson?: boolean;
  emitOnAll?: boolean;
  getConfig: (params: GetConfigParams) => any;
  format?: string[];
  metafile?: boolean;
  minify?: boolean;
  skipNativeModulesPlugin?: boolean;
  useJsxModule?: boolean;
};
