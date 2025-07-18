import type { Linter } from "eslint";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";
import {
  astro,
  disables,
  formatters,
  graphql,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  next,
  node,
  nx,
  perfectionist,
  react,
  regexp,
  sortPackageJson,
  sortTsconfig,
  storybook,
  stylistic,
  test,
  toml,
  typescript,
  unicorn,
  unocss,
  yaml
} from "./configs";
import { cspell } from "./configs/cspell";
import { mdx } from "./configs/mdx";
import { pnpm } from "./configs/pnpm";
import { prettier } from "./configs/prettier";
import { reactNative } from "./configs/react-native";
import { secrets } from "./configs/secrets";
import { tsdoc } from "./configs/tsdoc";
import { RuleOptions } from "./typegen";
import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem
} from "./types";
import { interopDefault, isInEditorEnv } from "./utils/helpers";
import { getTsConfigPath } from "./utils/tsconfig-path";

const flatConfigProps = [
  "name",
  "languageOptions",
  "linterOptions",
  "processor",
  "plugins",
  "rules",
  "settings"
] satisfies (keyof TypedFlatConfigItem)[];

export const defaultPluginRenaming = {
  "@eslint-react": "react",
  "@eslint-react/dom": "react-dom",
  "@eslint-react/hooks-extra": "react-hooks-extra",
  "@eslint-react/naming-convention": "react-naming-convention",

  "@stylistic": "style",
  "@typescript-eslint": "ts",
  "import-x": "import",
  "n": "node",
  "vitest": "test",
  "yml": "yaml"
};

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K
): ResolvedOptions<OptionsConfig[K]> {
  return (
    typeof options[key] === "boolean" ? {} : options[key] || {}
  ) as ResolvedOptions<OptionsConfig[K]>;
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key);

  return ("overrides" in sub ? sub.overrides : {}) as Partial<
    Linter.RulesRecord & RuleOptions
  >;
}

/**
 * Get the ESLint configuration for a Storm workspace.
 *
 * @param options - The preset options.
 * @param userConfigs - Additional ESLint configurations.
 */
export function getStormConfig(
  options: OptionsConfig & Omit<TypedFlatConfigItem, "files">,
  ...userConfigs: Awaitable<
    | TypedFlatConfigItem
    | TypedFlatConfigItem[]
    | FlatConfigComposer<object, string>
    | Linter.Config[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    name,
    globals = {},
    lineEndings = "unix",
    astro: enableAstro = false,
    autoRenamePlugins = true,
    componentExts = [],
    gitignore: enableGitignore = true,
    jsx: enableJsx = true,
    cspell: enableCSpell = true,
    react: enableReact = false,
    "react-native": enableReactNative = false,
    regexp: enableRegexp = true,
    next: enableNext = false,
    graphql: enableGraphQL = false,
    storybook: enableStorybook = false,
    typescript: enableTypeScript = isPackageExists("typescript"),
    unicorn: enableUnicorn = true,
    tsdoc: enableTSDoc = true,
    unocss: enableUnoCSS = false
  } = options;

  let isInEditor = options.isInEditor;
  if (isInEditor == null) {
    isInEditor = isInEditorEnv();
    if (isInEditor)
      // eslint-disable-next-line no-console
      console.log(
        "[@storm-software/eslint] Detected running in editor, some rules are disabled."
      );
  }

  const stylisticOptions = !options.stylistic
    ? false
    : typeof options.stylistic === "object"
      ? options.stylistic
      : {};

  if (stylisticOptions && !("jsx" in stylisticOptions))
    stylisticOptions.jsx = enableJsx;

  const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

  if (enableGitignore) {
    if (typeof enableGitignore !== "boolean") {
      configs.push(
        interopDefault(import("eslint-config-flat-gitignore")).then(r => [
          r({
            name: "storm/gitignore",
            ...enableGitignore
          })
        ])
      );
    } else {
      configs.push(
        interopDefault(import("eslint-config-flat-gitignore")).then(r => [
          r({
            name: "storm/gitignore",
            strict: false
          })
        ])
      );
    }
  }

  const typescriptOptions = resolveSubOptions(options, "typescript");
  let tsconfigPath =
    "tsconfigPath" in typescriptOptions
      ? typescriptOptions.tsconfigPath
      : undefined;
  if (!tsconfigPath) {
    tsconfigPath = getTsConfigPath();
  }

  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({
      name,
      globals,
      lineEndings,
      isInEditor,
      overrides: getOverrides(options, "javascript")
    }),
    node(),
    jsdoc({
      stylistic: stylisticOptions
    }),
    imports({
      stylistic: stylisticOptions
    }),
    nx(resolveSubOptions(options, "nx")),
    perfectionist(),
    secrets({ json: options.jsonc !== false })
  );

  if (!stylisticOptions) {
    configs.push(prettier());
  }

  if (enableCSpell) {
    configs.push(cspell(resolveSubOptions(options, "cspell")));
  }

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn));
  }

  if (enableTSDoc) {
    configs.push(
      tsdoc({
        ...resolveSubOptions(options, "tsdoc"),
        overrides: getOverrides(options, "tsdoc")
      })
    );
  }

  if (enableJsx) {
    configs.push(jsx());
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...typescriptOptions,
        componentExts,
        overrides: getOverrides(options, "typescript"),
        type: options.type
      })
    );
  }

  if (stylisticOptions) {
    configs.push(
      stylistic({
        ...stylisticOptions,
        lineEndings,
        lessOpinionated: options.lessOpinionated,
        overrides: getOverrides(options, "stylistic")
      })
    );
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === "boolean" ? {} : enableRegexp));
  }

  if (options.test ?? true) {
    configs.push(
      test({
        isInEditor,
        overrides: getOverrides(options, "test")
      })
    );
  }

  if (enableGraphQL) {
    configs.push(graphql(resolveSubOptions(options, "graphql")));
  }

  if (enableReact) {
    configs.push(
      react({
        ...typescriptOptions,
        overrides: getOverrides(options, "react"),
        tsconfigPath
      })
    );
  }

  if (enableReactNative) {
    configs.push(
      reactNative({
        ...resolveSubOptions(options, "react-native"),
        overrides: getOverrides(options, "react-native")
      })
    );
  }

  if (enableNext) {
    configs.push(next(resolveSubOptions(options, "next")));
  }

  if (enableStorybook) {
    configs.push(storybook(resolveSubOptions(options, "storybook")));
  }

  if (enableUnoCSS) {
    configs.push(
      unocss({
        ...resolveSubOptions(options, "unocss"),
        overrides: getOverrides(options, "unocss")
      })
    );
  }

  if (enableAstro) {
    configs.push(
      astro({
        overrides: getOverrides(options, "astro"),
        stylistic: stylisticOptions
      })
    );
  }

  if (options.pnpm ?? true) {
    configs.push(
      pnpm({
        overrides: getOverrides(options, "pnpm"),
        ignore:
          typeof options.pnpm !== "boolean" ? options.pnpm?.ignore : undefined
      })
    );
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, "jsonc"),
        stylistic: stylisticOptions
      }),
      sortTsconfig()
    );

    if (stylisticOptions) {
      configs.push(sortPackageJson());
    }
  }

  if (options.yaml ?? true) {
    configs.push(
      yaml({
        overrides: getOverrides(options, "yaml"),
        stylistic: stylisticOptions
      })
    );
  }

  if (options.toml ?? true) {
    configs.push(
      toml({
        overrides: getOverrides(options, "toml"),
        stylistic: stylisticOptions
      })
    );
  }

  if (options.markdown === true) {
    configs.push(
      markdown({
        componentExts,
        overrides: getOverrides(options, "markdown")
      })
    );
  }

  if (options.mdx ?? true) {
    configs.push(
      mdx({
        overrides: getOverrides(options, "mdx")
      })
    );
  }

  if (options.formatters) {
    configs.push(
      formatters(
        options.formatters,
        typeof stylisticOptions === "boolean" ? {} : stylisticOptions
      )
    );
  }

  configs.push(disables());

  if ("files" in options) {
    throw new Error(
      '[@storm-software/eslint] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.'
    );
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      acc[key] = options[key] as any;
    }

    return acc;
  }, {} as TypedFlatConfigItem);
  if (Object.keys(fusedConfig).length) configs.push([fusedConfig]);

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();
  composer = composer.append(
    ...configs,
    ...(userConfigs as Linter.Config<Linter.RulesRecord>[])
  );

  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming);
  }

  if (isInEditor) {
    composer = composer.disableRulesFix(["test/no-only-tests"], {
      builtinRules: () =>
        import(["eslint", "use-at-your-own-risk"].join("/")).then(
          r => r.builtinRules
        )
    });
  }

  return composer;
}

export default getStormConfig;
