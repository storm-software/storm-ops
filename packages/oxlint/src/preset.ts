import { tryGetWorkspaceConfig } from "@storm-software/config-tools";
import { banner } from "./configs/banner";
import { imports } from "./configs/imports";
import { javascript } from "./configs/javascript";
import { jsdoc } from "./configs/jsdoc";
import { jsx } from "./configs/jsx";
import { next } from "./configs/next";
import { node } from "./configs/node";
import { pnpm } from "./configs/pnpm";
import { prettier } from "./configs/prettier";
import { promise } from "./configs/promise";
import { react } from "./configs/react";
import { reactPerf } from "./configs/react-perf";
import { regexp } from "./configs/regexp";
import { storybook } from "./configs/storybook";
import { test } from "./configs/test";
import { tsdoc } from "./configs/tsdoc";
import { typescript } from "./configs/typescript";
import { unicorn } from "./configs/unicorn";
import type { Awaitable, OptionsConfig, TypedConfigItem } from "./types";
import { combine } from "./utils/combine";
import { GLOB_EXCLUDE } from "./utils/constants";

const oxlintConfigKeys = [
  "categories",
  "env",
  "extends",
  "globals",
  "ignorePatterns",
  "jsPlugins",
  "options",
  "overrides",
  "plugins",
  "rules",
  "settings"
] as const satisfies (keyof TypedConfigItem)[];

function resolveSubOptions<T>(value: boolean | T | undefined): T {
  return (typeof value === "boolean" ? {} : value || {}) as T;
}

/**
 * Get the Oxlint configuration for a Storm workspace.
 */
export async function getStormConfig(
  options: OptionsConfig = {},
  ...userConfigs: Awaitable<TypedConfigItem>[]
): Promise<TypedConfigItem> {
  const {
    banner: enableBanner = false,
    gitignore = true,
    javascript: enableJavascript = true,
    typescript: enableTypeScript = true,
    imports: enableImports = true,
    react: enableReact = false,
    "react-perf": enableReactPerf = enableReact,
    jsx: enableJsx = enableReact,
    next: enableNext = false,
    jsdoc: enableJsdoc = true,
    node: enableNode = true,
    promise: enablePromise = true,
    prettier: enablePrettier = true,
    pnpm: enablePnpm = true,
    tsdoc: enableTSDoc = true,
    unicorn: enableUnicorn = true,
    test: enableTest = true,
    vitest: enableVitest = !!enableTest,
    jest: enableJest = false,
    regexp: enableRegexp = true,
    storybook: enableStorybook = false
  } = options;

  const configs: Awaitable<TypedConfigItem | undefined>[] = [];
  const workspaceConfig = await tryGetWorkspaceConfig(true, {
    useDefault: true
  });

  if (enableBanner) {
    configs.push(banner(resolveSubOptions(options.banner), workspaceConfig));
  }

  if (gitignore) {
    configs.push({
      ignorePatterns: [...GLOB_EXCLUDE, ...(options.ignores || [])]
    });
  }

  if (enableJavascript) {
    configs.push(javascript());
  }

  if (enableNode) {
    configs.push(node());
  }

  if (enableImports) {
    configs.push(imports());
  }

  if (enableJsx) {
    configs.push(jsx());
  }

  if (enableTypeScript) {
    configs.push(typescript(resolveSubOptions(enableTypeScript)));
  }

  if (enableReact) {
    configs.push(
      ...react({
        typeAware: enableTypeScript !== false,
        ...resolveSubOptions(enableReact)
      })
    );
  }

  if (enableReactPerf) {
    configs.push(reactPerf());
  }

  if (enableNext) {
    configs.push(next(resolveSubOptions(enableNext)));
  }

  if (enableJsdoc) {
    configs.push(jsdoc());
  }

  if (enableTSDoc) {
    configs.push(tsdoc(resolveSubOptions(enableTSDoc)));
  }

  if (enablePnpm) {
    configs.push(pnpm(resolveSubOptions(enablePnpm)));
  }

  if (enablePromise) {
    configs.push(promise());
  }

  if (enablePrettier) {
    configs.push(prettier());
  }

  if (enableUnicorn) {
    configs.push(unicorn());
  }

  if (enableTest) {
    configs.push(
      test(resolveSubOptions(enableTest), {
        vitest: !!enableVitest,
        jest: !!enableJest
      })
    );
  }

  if (enableRegexp) {
    configs.push(regexp());
  }

  if (enableStorybook) {
    configs.push(storybook(resolveSubOptions(enableStorybook)));
  }

  configs.push({
    rules: {
      "no-empty-pattern": "off",
      "unicorn/prefer-module": "off"
    }
  });

  const combined = await combine(...configs, ...userConfigs);

  const fusedConfig = oxlintConfigKeys.reduce<TypedConfigItem>((acc, key) => {
    if (key in options && options[key] != null) {
      acc[key] = options[key] as never;
    }

    return acc;
  }, {});

  return combine(
    {
      $schema: "./node_modules/oxlint/configuration_schema.json"
    },
    combined,
    fusedConfig
  );
}

export const getConfig = getStormConfig;
export const defineConfig = getStormConfig;

export default getStormConfig;
