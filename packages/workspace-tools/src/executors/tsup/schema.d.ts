import { EsBuildExecutorOptions } from "@nx/esbuild/src/executors/esbuild/schema.d.ts";
import { Options } from "tsup";

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
> & {
  options: Options;
  clean: boolean;
  debug: boolean;
  banner?: string;
  verbose: boolean;
};
