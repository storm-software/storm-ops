import type Rolldown from "rolldown";
import type { Plugin } from "rolldown";
import type { Options } from "tsup";
import type {
  Diagnostic,
  ParsedCommandLine,
  Program,
  SourceFile,
  TransformerFactory
} from "typescript";
import type {
  BuildOptions as UnbuildOptions,
  RollupBuildOptions as UnbuildRollupBuildOptions
} from "unbuild";

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
  getTransform?: (
    program: Program,
    diagnostics: Diagnostic[]
  ) => TransformerFactory<SourceFile>;
};

export type TsupGetConfigOptions = Omit<
  TypeScriptBuildOptions,
  "banner" | "entry"
> & {
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
  platform?: "node" | "browser" | "neutral" | "worker";
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

export type RolldownFormat = "cjs" | "es";
export const RolldownFormat = {
  COMMONJS: "cjs" as RolldownFormat,
  ES_MODULE: "es" as RolldownFormat
};

export type IsExternal = (
  source: string,
  importer: string | undefined,
  isResolved: boolean
) => boolean;

export type RolldownResolveOptions = Omit<BindingResolveOptions, "alias"> & {
  alias?: Record<string, string>;
};

export interface BindingResolveOptions {
  alias?: Record<string, string[]>;
  aliasFields?: string[][];
  conditionNames?: string[];
  exportsFields?: string[][];
  extensions?: string[];
  mainFields?: string[];
  mainFiles?: string[];
  modules?: string[];
  symlinks?: boolean;
  tsconfigFilename?: string;
}

export interface RenderedModule {
  readonly code: string | null;
  originalLength: number;
  removedExports: string[];
  renderedExports: string[];
  renderedLength: number;
}

export interface PreRenderedChunk {
  exports: string[];
  facadeModuleId: string | null;
  isDynamicEntry: boolean;
  isEntry: boolean;
  isImplicitEntry: boolean;
  moduleIds: string[];
  name: string;
  type: "chunk";
}

export interface RenderedChunk extends PreRenderedChunk {
  dynamicImports: string[];
  fileName: string;
  implicitlyLoadedBefore: string[];
  importedBindings: {
    [imported: string]: string[];
  };
  imports: string[];
  modules: {
    [id: string]: RenderedModule;
  };
  referencedFiles: string[];
}

type InputOption = string | string[] | { [entryAlias: string]: string };

export interface InputOptions {
  input?: InputOption;
  plugins?: Plugin[];
  external?: IsExternal;
  resolve?: RolldownResolveOptions;
  cwd: string;
  platform: Platform;
  treeshake: boolean;
}

export interface OutputOptions extends Rolldown.OutputOptions {
  dir?: string;
  format?: "es";
  exports?: "named";
  sourcemap?: boolean | "inline" | "hidden";
  banner?: string | ((chunk: RenderedChunk) => string | Promise<string>);
  footer?: string | ((chunk: RenderedChunk) => string | Promise<string>);
}

export interface RolldownBuildOptions extends InputOptions {
  output?: OutputOptions;
}

export type RolldownUserDefinedConfig =
  | string
  | RolldownBuildOptions
  | ((
      config: RolldownBuildOptions
    ) => RolldownBuildOptions | Promise<RolldownBuildOptions>);

export type RolldownOptions = AdditionalCLIOptions & {
  clean: boolean;
  watch: boolean;
  entry: string;
  additionalEntryPoints?: string[];
  assets: (AssetGlob | string)[];
  generatePackageJson: boolean;
  includeSrc: boolean;
  banner?: OutputOptions["banner"];
  footer?: OutputOptions["footer"];
  outputPath: string;
  skipTypeCheck: boolean;
  verbose: boolean;
  tsConfig: string;
  minify: boolean;
  treeshake: boolean;
  extractCss: boolean;
  sourcemap?: OutputOptions["sourcemap"];
  exports?: OutputOptions["exports"];
  platform: InputOptions["platform"];
  resolve: InputOptions["resolve"];
  external: InputOptions["external"];
  plugins: Plugin[];
  rolldownConfig?: RolldownUserDefinedConfig | RolldownUserDefinedConfig[];
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type UnbuildBuildOptions = AdditionalCLIOptions &
  Omit<
    UnbuildOptions,
    "name" | "rootDir" | "entries" | "externals" | "outDir"
  > & {
    clean: boolean;
    watch: boolean;
    verbose: boolean;
    minify: boolean;
    tsLibs: string[];
    includeSrc: boolean;
    generatePackageJson: boolean;
    tsConfig: string;
    platform: TypeScriptBuildOptions["platform"];
    outputPath: string;
    entry?: string;
    additionalEntryPoints?: string[];
    external?: (string | RegExp)[];
    assets: (AssetGlob | string)[];
    banner?: OutputOptions["banner"];
    footer?: OutputOptions["footer"];
    rollupConfig?: DeepPartial<UnbuildRollupBuildOptions> | string;
    configPath?: string;
  };
