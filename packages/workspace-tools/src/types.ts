import type * as ts from "typescript";
import type { ParsedCommandLine } from "typescript";
import type { TsupExecutorSchema } from "./executors/tsup/schema";

type Entry = string | string[] | Record<string, string>;

export type TsupGetConfigOptions = Omit<TsupExecutorSchema, "banner" | "entry"> & {
  banner?: { js?: string; css?: string };
  dtsTsConfig: ParsedCommandLine;
  entry: Entry;
};

export type GetConfigParams = Omit<
  TsupGetConfigOptions,
  "entry" | "assets" | "clean" | "outputPath" | "tsConfig" | "main"
> & {
  entry: Entry;
  outDir: string;
  projectRoot: string;
  workspaceRoot: string;
  tsconfig: string;
  shims?: boolean;
  apiReport?: boolean;
  docModel?: boolean;
  tsdocMetadata?: boolean;
  dtsTsConfig: ParsedCommandLine;
  getTransform?: (
    program: ts.Program,
    diagnostics: ts.Diagnostic[]
  ) => ts.TransformerFactory<ts.SourceFile>;
};
