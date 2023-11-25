import { EsBuildExecutorOptions } from "@nx/esbuild/src/executors/esbuild/schema.d.ts";
import { Options } from "tsup";

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
  entry?: string;
  options: Options;
  clean: boolean;
  debug: boolean;
  banner?: string;
  verbose: boolean;
  define?: Record<string, string>;
  env?: Record<string, string>;
  apiReport?: boolean;
  docModel?: boolean;
  tsdocMetadata?: boolean;
  includeSrc?: boolean;
  platform?: Platform;
};
