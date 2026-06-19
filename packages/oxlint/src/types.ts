export type Awaitable<T> = T | Promise<T>;

export type { ConfigNames } from "./typegen";

export type LintLevel = "off" | "warn" | "error" | "deny" | 0 | 1 | 2;

export type BuiltinPluginName =
  | "eslint"
  | "react"
  | "unicorn"
  | "typescript"
  | "oxc"
  | "import"
  | "jsdoc"
  | "jest"
  | "vitest"
  | "jsx-a11y"
  | "nextjs"
  | "react-perf"
  | "promise"
  | "node"
  | "vue";

export interface JsPluginWithAlias {
  name: string;
  specifier: string;
}

export type JsPlugin = string | JsPluginWithAlias;

export type RuleValue = LintLevel | [LintLevel, ...unknown[]];

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
}

export interface TypedConfigOverride extends OptionsFiles {
  env?: Record<string, boolean>;
  globals?: Record<string, "readonly" | "writable" | "off" | boolean>;
  plugins?: BuiltinPluginName[];
  jsPlugins?: JsPlugin[];
  rules?: Record<string, RuleValue>;
  settings?: Record<string, unknown>;
}

export interface TypedConfigItem {
  $schema?: string;
  name?: string;
  categories?: Partial<
    Record<
      | "correctness"
      | "nursery"
      | "pedantic"
      | "perf"
      | "restriction"
      | "style"
      | "suspicious",
      LintLevel
    >
  >;
  env?: Record<string, boolean>;
  extends?: string[];
  globals?: Record<string, "readonly" | "writable" | "off" | boolean>;
  ignorePatterns?: string[];
  jsPlugins?: JsPlugin[];
  options?: {
    denyWarnings?: boolean;
    maxWarnings?: number;
    reportUnusedDisableDirectives?: LintLevel;
    respectEslintDisableDirectives?: boolean;
    typeAware?: boolean;
    typeCheck?: boolean;
  };
  overrides?: TypedConfigOverride[];
  plugins?: BuiltinPluginName[];
  rules?: Record<string, RuleValue>;
  settings?: Record<string, unknown>;
}

export interface OptionsNext {
  coreWebVitals?: boolean;
  rootDir?: string | string[];
}

export interface OptionsReact {
  typeAware?: boolean;
  version?: string;
}

export interface OptionsTypeScript {
  typeAware?: boolean;
  typeCheck?: boolean;
}

export interface OptionsTest {
  testFiles?: string[];
}

export interface OptionsStorybook {
  files?: string[];
}

export interface OptionsPNPM {
  ignore?: string[];
}

export interface OptionsTSDoc {
  /**
   * The TSDoc ESLint rule severity.
   *
   * @defaultValue "error"
   */
  severity?: "error" | "warn" | "off";

  /**
   * The type of Storm Software TSDoc configuration to use.
   *
   * @defaultValue "recommended"
   */
  type?:
    | "base"
    | "typedoc"
    | "api-extractor"
    | "core"
    | "callouts"
    | "recommended";

  /**
   * The path to a TSDoc config file.
   */
  configFile?: string;
}

export interface OptionsBanner {
  name: string;
  license?: string;
  organization?: string;
  licensing?: string;
  repository?: string;
  docs?: string;
  homepage?: string;
  commentStyle?: "block" | "line" | string;
  newlines?: number;
  lineEndings?: "unix" | "windows";
}

export interface OptionsConfig extends TypedConfigItem {
  /**
   * Configure banner options for generated files.
   */
  banner?: boolean | OptionsBanner;

  /**
   * Enable automatic `.gitignore` file generation and handling.
   */
  gitignore?: boolean;

  /**
   * Custom ignore patterns for files and directories.
   */
  ignores?: string[];

  /**
   * Enable JavaScript linting rules.
   */
  javascript?: boolean;

  /**
   * Enable TypeScript linting rules with optional configuration.
   */
  typescript?: boolean | OptionsTypeScript;

  /**
   * Enable import statement linting rules.
   */
  imports?: boolean;

  /**
   * Enable JSX syntax support and linting.
   */
  jsx?: boolean;

  /**
   * Enable React-specific linting rules with optional configuration.
   */
  react?: boolean | OptionsReact;

  /**
   * Enable React performance linting rules.
   */
  "react-perf"?: boolean;

  /**
   * Enable Next.js-specific linting rules with optional configuration.
   */
  next?: boolean | OptionsNext;

  /**
   * Enable JSDoc comment linting rules.
   */
  jsdoc?: boolean;

  /**
   * Enable Node.js environment linting rules.
   */
  node?: boolean;

  /**
   * Enable PNPM-specific linting rules with optional configuration.
   */
  pnpm?: boolean | OptionsPNPM;

  /**
   * Enable Promise linting rules.
   */
  promise?: boolean;

  /**
   * Enable Prettier code formatting integration.
   */
  prettier?: boolean;

  /**
   * Enable Unicorn linting rules for code quality improvements.
   */
  unicorn?: boolean;

  /**
   * Enable test file linting with optional configuration.
   */
  test?: boolean | OptionsTest;

  /**
   * Enable Vitest testing framework support.
   */
  vitest?: boolean;

  /**
   * Enable Jest testing framework support.
   */
  jest?: boolean;

  /**
   * Enable regular expression linting rules.
   */
  regexp?: boolean;

  /**
   * Enable Storybook component documentation support with optional configuration.
   */
  storybook?: boolean | OptionsStorybook;

  /**
   * Enable TSDoc comment linting with optional configuration.
   */
  tsdoc?: boolean | OptionsTSDoc;
}
