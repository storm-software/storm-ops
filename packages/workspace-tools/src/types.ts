import type { StormConfig } from "@storm-software/config";
import type { Options } from "tsup";
import { BaseExecutorSchema } from "./base/base-executor.d";
import { BaseGeneratorSchema } from "./base/base-generator.d";

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
    config?: StormConfig
  ) => Promise<TSchema> | TSchema;
  preProcess?: (options: TSchema, config?: StormConfig) => Promise<void> | void;
  postProcess?: (config?: StormConfig) => Promise<void> | void;
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

export type ProjectTagVariant =
  | "language"
  | "type"
  | "dist-style"
  | "provider"
  | "platform"
  | "registry"
  | "plugin";
export const ProjectTagVariant = {
  LANGUAGE: "language" as ProjectTagVariant,
  TYPE: "type" as ProjectTagVariant,
  DIST_STYLE: "dist-style" as ProjectTagVariant,
  PROVIDER: "provider" as ProjectTagVariant,
  PLATFORM: "platform" as ProjectTagVariant,
  REGISTRY: "registry" as ProjectTagVariant,
  PLUGIN: "plugin" as ProjectTagVariant
};

export type ProjectTagLanguageValue = "typescript" | "rust";
export const ProjectTagLanguageValue = {
  TYPESCRIPT: "typescript" as ProjectTagLanguageValue,
  RUST: "rust" as ProjectTagLanguageValue
};

export type ProjectTagTypeValue = "library" | "application";
export const ProjectTagTypeValue = {
  LIBRARY: "library" as ProjectTagTypeValue,
  APPLICATION: "application" as ProjectTagTypeValue
};

export type ProjectTagDistStyleValue = "normal" | "clean";
export const ProjectTagDistStyleValue = {
  NORMAL: "normal" as ProjectTagDistStyleValue,
  CLEAN: "clean" as ProjectTagDistStyleValue
};

export type ProjectTagPlatformValue = "node" | "browser" | "neutral" | "worker";
export const ProjectTagPlatformValue = {
  NODE: "node" as ProjectTagPlatformValue,
  BROWSER: "browser" as ProjectTagPlatformValue,
  NEUTRAL: "neutral" as ProjectTagPlatformValue,
  WORKER: "worker" as ProjectTagPlatformValue
};

export type ProjectTagRegistryValue = "cargo" | "npm" | "container" | "cyclone";
export const ProjectTagRegistryValue = {
  CARGO: "cargo" as ProjectTagRegistryValue,
  NPM: "npm" as ProjectTagRegistryValue,
  CONTAINER: "container" as ProjectTagRegistryValue,
  CYCLONE: "cyclone" as ProjectTagRegistryValue
};
