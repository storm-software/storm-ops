import type { Linter } from "eslint";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";
import {
  astro,
  banner,
  cspell,
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
  mdx,
  next,
  node,
  nx,
  perfectionist,
  pnpm,
  prettier,
  react,
  reactNative,
  regexp,
  secrets,
  sortPackageJson,
  sortTsconfig,
  storybook,
  stylistic,
  test,
  toml,
  tsdoc,
  typescript,
  unicorn,
  unocss,
  yaml,
  zod
} from "./configs";
import { RuleOptions } from "./typegen";
import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  OptionsTypescript,
  PresetConfig,
  PresetResult,
  TypedFlatConfigItem,
  UserConfig
} from "./types";
import { interopDefault, isInEditorEnv } from "./utils/helpers";
import { getTsConfigPath } from "./utils/tsconfig";

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
  n: "node",
  vitest: "test",
  yml: "yaml"
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
export function preset(
  options: PresetConfig<OptionsConfig>,
  ...userConfigs: UserConfig[]
): PresetResult {
  const {
    name,
    globals = {},
    banner: enableBanner = true,
    astro: enableAstro = false,
    autoRenamePlugins = true,
    componentExts = [],
    gitignore: enableGitignore = true,
    jsx: enableJsx = true,
    mdx: enableMdx = true,
    cspell: enableCSpell = true,
    react: enableReact = false,
    "react-native": enableReactNative = false,
    regexp: enableRegexp = true,
    next: enableNext = false,
    graphql: enableGraphQL = false,
    storybook: enableStorybook = false,
    typescript: enableTypeScript = isPackageExists("typescript"),
    unicorn: enableUnicorn = true,
    jsdoc: enableJSDoc = false,
    tsdoc: enableTSDoc = true,
    test: enableTest = true,
    unocss: enableUnoCSS = false,
    zod: enableZod = false
  } = options;

  let isInEditor = options.isInEditor;
  if (!isInEditor) {
    isInEditor = isInEditorEnv();
    if (isInEditor) {
      // eslint-disable-next-line no-console
      console.log(
        "[@storm-software/eslint] Detected running in editor, some rules are disabled."
      );
    }
  }

  const stylisticOptions = !options.stylistic
    ? false
    : typeof options.stylistic === "object"
      ? options.stylistic
      : {};

  if (stylisticOptions && !("jsx" in stylisticOptions)) {
    stylisticOptions.jsx = enableJsx;
  }

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

  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({
      globals,
      isInEditor,
      overrides: getOverrides(options, "javascript")
    }),
    node(),
    imports({
      stylistic: stylisticOptions
    }),
    nx(resolveSubOptions(options, "nx")),
    perfectionist(),
    secrets({ json: options.jsonc !== false })
  );

  let typescriptOptions = {} as OptionsTypescript;
  if (enableTypeScript) {
    typescriptOptions = resolveSubOptions(options, "typescript");
    if (typescriptOptions.tsconfigPath !== false) {
      typescriptOptions.tsconfigPath = getTsConfigPath(
        typescriptOptions.tsconfigPath,
        options.type
      );
    }
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...typescriptOptions,
        tsconfigPath:
          typescriptOptions.tsconfigPath === false
            ? undefined
            : typescriptOptions.tsconfigPath,
        componentExts,
        overrides: getOverrides(options, "typescript"),
        type: options.type
      })
    );
  }

  if (enableBanner) {
    configs.push(
      banner({
        ...resolveSubOptions(options, "banner"),
        name,
        overrides: getOverrides(options, "banner")
      })
    );
  }

  if (!stylisticOptions) {
    configs.push(prettier());
  }

  if (enableCSpell) {
    configs.push(cspell(resolveSubOptions(options, "cspell")));
  }

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn));
  }

  if (enableJSDoc) {
    configs.push(
      jsdoc({
        ...resolveSubOptions(options, "jsdoc"),
        overrides: getOverrides(options, "jsdoc")
      })
    );
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

  if (enableZod) {
    configs.push(
      zod({
        overrides: getOverrides(options, "zod")
      })
    );
  }

  if (stylisticOptions) {
    configs.push(
      stylistic({
        ...stylisticOptions,
        lineEndings: stylisticOptions.lineEndings ?? "unix",
        lessOpinionated: options.lessOpinionated,
        overrides: getOverrides(options, "stylistic")
      })
    );
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === "boolean" ? {} : enableRegexp));
  }

  if (enableTest) {
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
        tsconfigPath:
          typescriptOptions.tsconfigPath === false
            ? undefined
            : typescriptOptions.tsconfigPath,
        ...(typeof enableReact === "boolean" ? { strict: false } : enableReact),
        overrides: getOverrides(options, "react")
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

  if (enableMdx) {
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

export const getConfig = preset;
export const defineConfig = preset;
export default preset;
