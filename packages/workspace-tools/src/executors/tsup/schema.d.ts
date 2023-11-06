import { EsBuildExecutorOptions } from "@nx/esbuild/src/executors/esbuild/schema.d.ts";
import { Options } from "tsup";

export type TsupExecutorSchema = Omit<
  EsBuildExecutorOptions,
  | "outputFileName"
  | "metafile"
  | "generatePackageJson"
  | "sourcemap"
  | "format"
  | "target"
  | "thirdParty"
  | "skipTypeCheck"
  | "esbuildOptions"
  | "esbuildConfig"
> & {
  options: Options;
  clean: boolean;
};
