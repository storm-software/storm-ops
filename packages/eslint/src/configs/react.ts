import {
  GLOB_ASTRO_TS,
  GLOB_MARKDOWN,
  GLOB_SRC,
  GLOB_SRC_FILE,
  GLOB_TS,
  GLOB_TSX
} from "@storm-software/package-constants/globs";
import { isPackageExists } from "local-pkg";
import type {
  OptionsComponentExts,
  OptionsFiles,
  OptionsReact,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
  TypedFlatConfigItem
} from "../types";
import { findWorkspaceRoot } from "../utils/find-workspace-root";
import { ensurePackages, interopDefault } from "../utils/helpers";

// react refresh
const ReactRefreshAllowConstantExportPackages = ["vite"];
const ReactRouterPackages = [
  "@react-router/node",
  "@react-router/react",
  "@react-router/serve",
  "@react-router/dev"
];

function renameRules(
  config: TypedFlatConfigItem
): TypedFlatConfigItem["rules"] {
  const renamedRules: TypedFlatConfigItem["rules"] = {};
  for (const [ruleName, ruleConfig] of Object.entries(config.rules || {})) {
    if (ruleName.startsWith("@eslint-react/dom-")) {
      renamedRules[`react-dom/${ruleName.slice("@eslint-react/dom-".length)}`] =
        ruleConfig;
    } else if (ruleName.startsWith("@eslint-react/web-api-")) {
      renamedRules[
        `react-web-api/${ruleName.slice("@eslint-react/web-api-".length)}`
      ] = ruleConfig;
    } else if (ruleName.startsWith("@eslint-react/jsx-")) {
      renamedRules[`react-jsx/${ruleName.slice("@eslint-react/jsx-".length)}`] =
        ruleConfig;
    } else if (ruleName.startsWith("@eslint-react/rsc-")) {
      renamedRules[`react-rsc/${ruleName.slice("@eslint-react/rsc-".length)}`] =
        ruleConfig;
    } else if (ruleName.startsWith("@eslint-react/naming-convention-")) {
      renamedRules[
        `react-naming-convention/${ruleName.slice(
          "@eslint-react/naming-convention-".length
        )}`
      ] = ruleConfig;
    } else if (ruleName.startsWith("@eslint-react/x-")) {
      renamedRules[`react/${ruleName.slice("@eslint-react/x-".length)}`] =
        ruleConfig;
    } else if (ruleName.startsWith("@eslint-react/")) {
      renamedRules[`react/${ruleName.slice("@eslint-react/".length)}`] =
        ruleConfig;
    } else {
      renamedRules[ruleName] = ruleConfig;
    }
  }

  return renamedRules;
}

export async function react(
  options: OptionsComponentExts &
    Omit<OptionsTypeScriptParserOptions, "tsconfigPath"> &
    OptionsTypeScriptWithTypes &
    OptionsReact &
    OptionsFiles = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    filesTypeAware = [GLOB_TS, GLOB_TSX],
    ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS],
    strict = false,
    overrides = {},
    componentExts = [],
    tsconfigPath
  } = options;

  await ensurePackages([
    "@eslint-react/eslint-plugin",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react-refresh",
    "eslint-plugin-react-compiler",
    "eslint-plugin-react-dom",
    "eslint-plugin-react-jsx",
    "eslint-plugin-react-naming-convention",
    "eslint-plugin-react-rsc",
    "eslint-plugin-react-web-api",
    "eslint-plugin-react-x"
  ]);

  const [
    pluginReact,
    pluginReactHooks,
    pluginReactRefresh,
    pluginReactCompiler,
    pluginReactDom,
    pluginReactJsx,
    pluginReactNamingConvention,
    pluginReactRsc,
    pluginReactWebApi,
    pluginReactX
  ] = await Promise.all([
    interopDefault(import("@eslint-react/eslint-plugin")),
    interopDefault(import("eslint-plugin-react-hooks")),
    interopDefault(import("eslint-plugin-react-refresh")),
    interopDefault(import("eslint-plugin-react-compiler")),
    interopDefault(import("eslint-plugin-react-dom")),
    interopDefault(import("eslint-plugin-react-jsx")),
    interopDefault(import("eslint-plugin-react-naming-convention")),
    interopDefault(import("eslint-plugin-react-rsc")),
    interopDefault(import("eslint-plugin-react-web-api")),
    interopDefault(import("eslint-plugin-react-x"))
  ] as const);

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(
    i => isPackageExists(i)
  );
  const isUsingReactRouter = ReactRouterPackages.some(i => isPackageExists(i));

  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import("@typescript-eslint/eslint-plugin")),
    interopDefault(import("@typescript-eslint/parser"))
  ] as const);

  return [
    {
      name: "storm/react/setup",
      plugins: {
        react: pluginReactX,
        "react-hooks": pluginReactHooks,
        "react-refresh": pluginReactRefresh,
        "react-compiler": pluginReactCompiler,
        "react-dom": pluginReactDom,
        "react-jsx": pluginReactJsx,
        "react-naming-convention": pluginReactNamingConvention,
        "react-rsc": pluginReactRsc,
        "react-web-api": pluginReactWebApi
      }
    },

    pluginReactHooks.configs.flat["recommended-latest"],
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        },
        sourceType: "module"
      },
      name: "storm/react/rules",
      rules: {
        ...renameRules(
          strict
            ? pluginReact.configs["strict"]
            : pluginReact.configs["recommended"]
        ),

        "react-hooks/exhaustive-deps": strict ? "error" : "warn",
        "react-hooks/rules-of-hooks": "error",

        "react-refresh/only-export-components": [
          "warn",
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              "dynamic",
              "dynamicParams",
              "revalidate",
              "fetchCache",
              "runtime",
              "preferredRegion",
              "maxDuration",
              "config",
              "generateStaticParams",
              "metadata",
              "generateMetadata",
              "viewport",
              "generateViewport"
            ].concat(
              isUsingReactRouter
                ? ["meta", "links", "headers", "loader", "action"]
                : []
            )
          }
        ],

        "react-compiler/react-compiler": "error",

        "react-dom/no-void-elements-with-children": "warn",
        "react-dom/no-dangerously-set-innerhtml": "warn",
        "react-dom/no-dangerously-set-innerhtml-with-children": "error",
        "react-dom/no-find-dom-node": "error",
        "react-dom/no-missing-button-type": "warn",
        "react-dom/no-missing-iframe-sandbox": "warn",
        "react-dom/no-render-return-value": "error",
        "react-dom/no-script-url": "warn",
        "react-dom/no-unsafe-iframe-sandbox": "warn",
        "react-dom/no-unsafe-target-blank": "warn",

        "react-web-api/no-leaked-event-listener": "warn",
        "react-web-api/no-leaked-interval": "warn",
        "react-web-api/no-leaked-resize-observer": "warn",
        "react-web-api/no-leaked-timeout": "warn",

        "react-jsx/no-namespace": "error",
        "react-jsx/no-comment-textnodes": "warn",

        "react/error-boundaries": "error",
        "react/no-access-state-in-setstate": "error",
        "react/no-array-index-key": "warn",
        "react/no-children-count": "warn",
        "react/no-children-for-each": "warn",
        "react/no-children-map": "warn",
        "react/no-children-only": "warn",
        "react/no-children-to-array": "warn",
        "react/no-clone-element": "warn",
        "react/no-component-will-mount": "error",
        "react/no-component-will-receive-props": "error",
        "react/no-component-will-update": "error",
        "react/no-context-provider": "warn",
        "react/no-create-ref": "error",
        "react/no-direct-mutation-state": "error",
        "react/no-duplicate-key": "error",
        "react/no-forward-ref": "warn",
        "react/no-missing-key": "error",
        "react/no-nested-component-definitions": "error",
        "react/no-set-state-in-component-did-mount": "warn",
        "react/no-set-state-in-component-did-update": "warn",
        "react/no-set-state-in-component-will-update": "warn",
        "react/no-unsafe-component-will-mount": "warn",
        "react/no-unsafe-component-will-receive-props": "warn",
        "react/no-unsafe-component-will-update": "warn",
        "react/no-unstable-context-value": "warn",
        "react/no-unstable-default-props": "warn",
        "react/no-unused-class-component-members": "warn",
        "react/no-unused-state": "warn",

        ...overrides
      }
    },
    ...(!!tsconfigPath
      ? [
          {
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            languageOptions: {
              parser: parserTs,
              parserOptions: {
                extraFileExtensions: componentExts.map(ext => `.${ext}`),
                ecmaFeatures: { jsx: true },
                ecmaVersion: 2022,
                sourceType: "module",
                projectService: {
                  allowDefaultProject: [GLOB_SRC_FILE],
                  defaultProject: tsconfigPath
                },
                tsconfigRootDir: findWorkspaceRoot()
              }
            },
            name: "storm/react/type-aware-rules",
            rules: {
              ...renameRules(
                strict
                  ? pluginReact.configs["strict-type-checked"]
                  : pluginReact.configs["recommended-type-checked"]
              ),
              "react/no-leaked-conditional-rendering": "warn",
              "react/no-implicit-key": "warn",
              "react/no-unused-props": strict ? "error" : "warn"
            }
          }
        ]
      : [])
  ];
}
