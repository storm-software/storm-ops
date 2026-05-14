import type { StormWorkspaceConfig } from "@storm-software/config";
import type { Options } from "tsup";
import { BaseExecutorSchema } from "./base/base-executor.schema.d";
import { BaseGeneratorSchema } from "./base/base-generator.schema.d";

export enum TypescriptProjectLinkingType {
  ALIAS = "alias",
  REFERENCE = "reference"
}

export interface BaseTypescriptPluginOptions {
  /**
   * The project linking type to use for TypeScript projects.
   *
   * @see https://nx.dev/docs/concepts/typescript-project-linking
   * @see https://nx.dev/docs/technologies/typescript/guides/switch-to-workspaces-project-references
   *
   * @defaultValue "reference"
   */
  projectLinks?: TypescriptProjectLinkingType;
}

export interface TsupContext {
  projectRoot: string;
  sourceRoot: string;
  projectName: string;
  main: string;
}

export type BuildOptions = Options;
export type Entry = string | string[] | Record<string, string>;

export interface WorkspaceToolHooks<TSchema = any> {
  applyDefaultOptions?: (
    options: Partial<TSchema>,
    config?: StormWorkspaceConfig
  ) => Promise<TSchema> | TSchema;
  preProcess?: (
    options: TSchema,
    config?: StormWorkspaceConfig
  ) => Promise<void> | void;
  postProcess?: (config?: StormWorkspaceConfig) => Promise<void> | void;
}

export interface BaseWorkspaceToolOptions<TSchema = any> {
  skipReadingConfig?: boolean;
  hooks?: WorkspaceToolHooks<TSchema>;
}

export type BaseExecutorOptions<
  TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema
> = BaseWorkspaceToolOptions<TExecutorSchema>;

export interface BaseExecutorResult {
  error?: Error;
  success?: boolean;
}

export type BaseGeneratorOptions<
  TGeneratorSchema extends BaseGeneratorSchema = BaseGeneratorSchema
> = BaseWorkspaceToolOptions<TGeneratorSchema>;

export interface BaseGeneratorResult extends Record<string, any> {
  error?: Error;
  success?: boolean;
  data?: any;
}

// export type TypeScriptLibraryGeneratorSchema = Omit<
//   LibraryGeneratorSchema,
//   | "js"
//   | "pascalCaseFiles"
//   | "skipFormat"
//   | "skipTsConfig"
//   | "skipPackageJson"
//   | "includeBabelRc"
//   | "unitTestRunner"
//   | "platform"
//   | "linter"
//   | "testEnvironment"
//   | "config"
//   | "compiler"
//   | "bundler"
//   | "skipTypeCheck"
//   | "minimal"
// > & {
//   name: string;
//   description: string;
//   buildExecutor: string;
//   platform?: "neutral" | "node" | "browser" | "worker";
//   devDependencies?: Record<string, string>;
//   peerDependencies?: Record<string, string>;
//   peerDependenciesMeta?: Record<string, any>;
//   tsConfigOptions?: Record<string, any>;
// };

export * from "@storm-software/package-constants/types";
