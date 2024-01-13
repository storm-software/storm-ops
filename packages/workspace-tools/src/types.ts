import { StormConfig } from "@storm-software/config-tools";
import * as ts from "typescript";
import { ParsedCommandLine } from "typescript";
import { TsupExecutorSchema } from "./executors/tsup/schema";

export interface WorkspaceToolHooks<TSchema = any> {
  applyDefaultOptions?: (
    options: Partial<TSchema>,
    config?: StormConfig
  ) => Promise<TSchema> | TSchema;
  preProcess?: (options: TSchema, config?: StormConfig) => Promise<void> | void;
  postProcess?: (config?: StormConfig) => Promise<void> | void;
}

export interface BaseWorkspaceToolOptions<TSchema = any> {
  skipReadingConfig?: boolean;
  hooks?: WorkspaceToolHooks<TSchema>;
}

type Entry = string | string[] | Record<string, string>;

export type TsupGetConfigOptions = Omit<
  TsupExecutorSchema,
  "banner" | "entry"
> & {
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
