import { DepConstraint } from "@nx/eslint-plugin/src/utils/runtime-lint-utils";
import type { StylisticCustomizeOptions } from "@stylistic/eslint-plugin";
import type { ParserOptions } from "@typescript-eslint/parser";
import type { Linter } from "eslint";
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";
import type { ConfigNames, RuleOptions } from "./typegen";
import type { VendoredPrettierOptions } from "./vendor/prettier-types";

export type Awaitable<T> = T | Promise<T>;

export type Rules = RuleOptions;

export type { ConfigNames };

export type TypedFlatConfigItem = Omit<
  Linter.Config<Linter.RulesRecord & Rules>,
  "plugins"
> & {
  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>;
};

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
}

export type OptionsTypescript =
  | (OptionsTypeScriptWithTypes & OptionsOverrides)
  | (OptionsTypeScriptParserOptions & OptionsOverrides);

export interface OptionsFormatters {
  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   *
   * Currently only support Prettier.
   */
  css?: "prettier" | boolean;

  /**
   * Enable formatting support for HTML.
   *
   * Currently only support Prettier.
   */
  html?: "prettier" | boolean;

  /**
   * Enable formatting support for XML.
   *
   * Currently only support Prettier.
   */
  xml?: "prettier" | boolean;

  /**
   * Enable formatting support for SVG.
   *
   * Currently only support Prettier.
   */
  svg?: "prettier" | boolean;

  /**
   * Enable formatting support for Markdown.
   *
   * Support both Prettier and dprint.
   *
   * When set to `true`, it will use Prettier.
   */
  markdown?: "prettier" | "dprint" | boolean;

  /**
   * Enable formatting support for GraphQL.
   */
  graphql?: "prettier" | boolean;

  /**
   * Custom options for Prettier.
   *
   * By default it's controlled by our own config.
   */
  prettierOptions?: VendoredPrettierOptions;

  /**
   * Custom options for dprint.
   *
   * By default it's controlled by our own config.
   */
  dprintOptions?: boolean;

  /**
   * Enable formatting support for Astro.
   *
   * Currently only support Prettier.
   */
  astro?: "prettier" | boolean;
}

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[];
}

export interface OptionsUnicorn {
  /**
   * Include all rules recommended by `eslint-plugin-unicorn`, instead of only ones picked by Anthony.
   *
   * @default false
   */
  allRecommended?: boolean;
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>;

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[];

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[];
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string;

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem["rules"];
}

export interface OptionsHasTypeScript {
  typescript?: boolean;
}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig;
}

export interface StylisticConfig
  extends Pick<
    StylisticCustomizeOptions,
    "indent" | "quotes" | "jsx" | "semi"
  > {}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem["rules"];
}

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default 'app'
   */
  type?: "app" | "lib";
}

export interface OptionsRegExp {
  /**
   * Override rulelevels
   */
  level?: "error" | "warn";
}

export interface OptionsIsInEditor {
  isInEditor?: boolean;
}

export interface OptionsUnoCSS extends OptionsOverrides {
  /**
   * Enable attributify support.
   * @default true
   */
  attributify?: boolean;
  /**
   * Enable strict mode by throwing errors about blocklisted classes.
   * @default false
   */
  strict?: boolean;
}

export interface OptionsNext extends OptionsOverrides {
  /**
   * Enable [core-web-vitals](https://nextjs.org/docs/app/api-reference/config/eslint#with-core-web-vitals) support.
   *
   * @see https://nextjs.org/docs/app/api-reference/config/eslint#with-core-web-vitals
   *
   * @default true
   */
  coreWebVitals?: boolean;

  /**
   * Specify the root directory of the Next.js project for scenarios where Next.js isn't installed in your root directory (such as a monorepo).
   *
   * @see https://nextjs.org/docs/app/api-reference/config/eslint#specifying-a-root-directory-within-a-monorepo
   */
  rootDir?: string;
}

export interface OptionsGraphQL extends OptionsOverrides {
  /**
   * Enable schema type GraphQL ESLint rules
   *
   * @see https://the-guild.dev/graphql/eslint/rules
   *
   * @default true
   */
  schema?: boolean;

  /**
   * Enable operations type GraphQL ESLint rules
   *
   * @see https://the-guild.dev/graphql/eslint/rules
   *
   * @default true
   */
  operations?: boolean;

  /**
   * Enable [Relay](https://relay.dev/) support.
   *
   * @see https://github.com/relayjs/eslint-plugin-relay
   *
   * @default true
   */
  relay?: boolean;
}

export interface OptionsStorybook extends OptionsOverrides {
  /**
   * A option to control the strictness of the Component Story Format (CSF) ESLint rules
   *
   * @see https://storybook.js.org/docs/api/csf
   *
   * @default "loose"
   */
  csf?: "none" | "loose" | "strict";
}

export interface OptionsNxDependencyChecks extends OptionsOverrides {
  /**
   * List of build target names
   *
   * @default ['build-base', 'build']
   */
  buildTargets: string[];

  /**
   * Disable to skip checking for missing dependencies
   *
   * @default true
   */
  checkMissingDependencies: boolean;

  /**
   * Disable to skip checking for unused dependencies
   *
   * @default true
   */
  checkObsoleteDependencies: boolean;

  /**
   * Disable to skip checking if version specifier matches installed version
   *
   * @default true
   */
  checkVersionMismatches: boolean;

  /**
   * List of dependencies to ignore for checks
   *
   * @default []
   */
  ignoredDependencies: string[];

  /**
   * List of files to ignore when collecting dependencies. The default value will be set based on the selected executor during the generation.
   *
   * @default []
   */
  ignoredFiles: string[];

  /**
   * Enable to collect dependencies of children projects
   *
   * @default false
   */
  includeTransitiveDependencies: boolean;

  /**
   * Set workspace dependencies as relative file:// paths. Useful for monorepos that link via file:// in package.json files.
   *
   * @default false
   */
  useLocalPathsForWorkspaceDependencies: boolean;
}

export interface OptionsNxEnforceModuleBoundaries extends OptionsOverrides {
  /**
   * List of imports that should be allowed without any checks
   *
   * @default []
   */
  allow: string[];

  /**
   * List of build target names
   *
   * @default ['build-base', 'build']
   */
  buildTargets: string[];

  /**
   * List of dependency constraints between projects
   *
   * @default true
   */
  depConstraints: DepConstraint[];

  /**
   * Enable to restrict the buildable libs from importing non-buildable libraries
   *
   * @default true
   */
  enforceBuildableLibDependency: boolean;

  /**
   * Disable check for self circular dependency when project imports from itself via alias path
   *
   * @default false
   */
  allowCircularSelfDependency: boolean;

  /**
   * List of project pairs that should be skipped from Circular dependencies checks, including the self-circular dependency check. E.g. ['feature-project-a', 'myapp']. Project name can be replaced by catch all * for more generic matches.
   *
   * @default []
   */
  ignoredCircularDependencies: Array<[string, string]>;

  /**
   * List of imports that should be skipped for Imports of lazy-loaded libraries forbidden checks. E.g. ['@myorg/lazy-project/component/*', '@myorg/other-project']
   *
   * @default []
   */
  checkDynamicDependenciesExceptions: string[];

  /**
   * Ban import of dependencies that were not specified in the root or project's package.json
   *
   * @default false
   */
  banTransitiveDependencies: boolean;

  /**
   * Enable to enforce the check for banned external imports in the nested packages. Check [Dependency constraints](https://nx.dev/nx-api/eslint-plugin/documents/enforce-module-boundaries#dependency-constraints) for more information
   *
   * @default false
   */
  checkNestedExternalImports: boolean;
}

export interface OptionsNx extends OptionsOverrides {
  /**
   * Enables us to discover mismatches between dependencies specified in a project's package.json and the dependencies that your project depends on.
   */
  depsCheck?: OptionsNxDependencyChecks | false;

  /**
   * Enables us to define strict rules for accessing resources between different projects in the repository. Enforcing strict boundaries helps to prevent unplanned cross-dependencies.
   */
  moduleBoundaries?: OptionsNxEnforceModuleBoundaries | false;
}

export interface OptionsCSpell extends OptionsOverrides {
  /**
   * A path to a CSpell configuration file
   *
   * @default "./.vscode/cspell.json"
   */
  configFile?: string;
}

/**
 * The ESLint globals property value.
 */
export type ESLintGlobalsPropValue =
  | boolean
  | "readonly"
  | "readable"
  | "writable"
  | "writeable";

export interface OptionsJavascript {
  /**
   * The name of the repository used in adding the banner comments
   */
  name: string;

  /**
   * An object containing a list of extra global variables to include in the configuration.
   */
  globals?: Record<string, ESLintGlobalsPropValue>;
}

export interface OptionsConfig
  extends OptionsComponentExts,
    OptionsJavascript,
    OptionsProjectType {
  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @default true
   */
  gitignore?: boolean | FlatGitignoreOptions;

  /**
   * Disable some opinionated rules to Anthony's preference.
   *
   * @default false
   */
  lessOpinionated?: boolean;

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides;

  /**
   * Enable cspell rules.
   *
   * Requires installing:
   * - `@cspell/eslint-plugin`
   *
   * @default true
   */
  cspell?: boolean | OptionsCSpell;

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript;

  /**
   * Enable Nx monorepo support.
   */
  nx?: OptionsNx;

  /**
   * Enable JSX related rules.
   *
   * Currently only stylistic rules are included.
   *
   * @default true
   */
  jsx?: boolean;

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | OptionsUnicorn;

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean | OptionsOverrides;

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | OptionsOverrides;

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean | OptionsOverrides;

  /**
   * Enable TOML support.
   *
   * @default true
   */
  toml?: boolean | OptionsOverrides;

  /**
   * Enable ASTRO support.
   *
   * Requires installing:
   * - `eslint-plugin-astro`
   *
   * Requires installing for formatting .astro:
   * - `prettier-plugin-astro`
   *
   * @default false
   */
  astro?: boolean | OptionsOverrides;

  /**
   * Enable linting for **code snippets** in Markdown.
   *
   * For formatting Markdown content, enable also `formatters.markdown`.
   *
   * @default true
   */
  markdown?: boolean | OptionsOverrides;

  /**
   * Enable stylistic rules.
   *
   * @see https://eslint.style/
   * @default true
   */
  stylistic?: boolean | (StylisticConfig & OptionsOverrides);

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @default true
   */
  regexp?: boolean | (OptionsRegExp & OptionsOverrides);

  /**
   * Enable GraphQL support.
   *
   * @default false
   */
  graphql?: boolean | OptionsGraphQL;

  /**
   * Enable Storybook support.
   *
   * @default false
   */
  storybook?: boolean | OptionsStorybook;

  /**
   * Enable react rules.
   *
   * Requires installing:
   * - `@eslint-react/eslint-plugin`
   * - `eslint-plugin-react-hooks`
   * - `eslint-plugin-react-refresh`
   *
   * @default false
   */
  react?: boolean | OptionsOverrides;

  /**
   * Enable next rules.
   *
   * Requires installing:
   * - `@next/eslint-plugin`
   *
   * @default false
   */
  next?: boolean | OptionsNext;

  /**
   * Enable unocss rules.
   *
   * Requires installing:
   * - `@unocss/eslint-plugin`
   *
   * @default false
   */
  unocss?: boolean | OptionsUnoCSS;

  /**
   * Use external formatters to format files.
   *
   * Requires installing:
   * - `eslint-plugin-format`
   *
   * When set to `true`, it will enable all formatters.
   *
   * @default false
   */
  formatters?: boolean | OptionsFormatters;

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  isInEditor?: boolean;

  /**
   * Automatically rename plugins in the config.
   *
   * @default true
   */
  autoRenamePlugins?: boolean;
}
