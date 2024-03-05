import type { Options } from "tsup";
import type {
  Program,
  Diagnostic,
  TransformerFactory,
  SourceFile,
  ParsedCommandLine
} from "typescript";

export interface TsupContext {
  projectRoot: string;
  sourceRoot: string;
  projectName: string;
  main: string;
}

export type BuildOptions = Options;
export type Entry = string | string[] | Record<string, string>;
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
  getTransform?: (program: Program, diagnostics: Diagnostic[]) => TransformerFactory<SourceFile>;
};

export type TsupGetConfigOptions = Omit<TypeScriptBuildOptions, "banner" | "entry"> & {
  banner?: { js?: string; css?: string };
  dtsTsConfig: ParsedCommandLine;
  entry: Entry;
};

export type Platform = "browser" | "node" | "neutral";

export type FileInputOutput = {
  input: string;
  output: string;
};
export type AssetGlob = FileInputOutput & {
  glob: string;
  ignore?: string[];
  dot?: boolean;
};

export interface AdditionalCLIOptions {
  projectRoot: string;
  sourceRoot: string;
  projectName: string;
}

export interface TypeScriptBuildOptions extends AdditionalCLIOptions {
  additionalEntryPoints?: string[];
  assets: (AssetGlob | string)[];
  bundle?: boolean;
  deleteOutputPath?: boolean;
  esbuildOptions?: Record<string, any>;
  esbuildConfig?: string;
  external?: string[];
  outputFileName?: string;
  outputHashing?: "none" | "all";
  outputPath: string;
  platform?: "node" | "browser" | "neutral";
  sourcemap?: boolean | "linked" | "inline" | "external" | "both";
  target?: string;
  tsConfig: string;
  watch?: boolean;
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
  plugins?: any[];
  shims?: boolean;
  splitting?: boolean;
  treeshake?: boolean;
  generatePackageJson?: boolean;
  emitOnAll?: boolean;
  getConfig: (params: GetConfigParams) => Options;
  format?: string[];
  metafile?: boolean;
  minify?: boolean;
  skipNativeModulesPlugin?: boolean;
  useJsxModule?: boolean;
}
