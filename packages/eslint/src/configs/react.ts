import {
  GLOB_ASTRO_TS,
  GLOB_MARKDOWN,
  GLOB_SRC,
  GLOB_TS,
  GLOB_TSX
} from "@storm-software/package-constants/globs";
import { isPackageExists } from "local-pkg";
import type {
  OptionsFiles,
  OptionsOverrides,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
  TypedFlatConfigItem
} from "../types";
import { ensurePackages, interopDefault } from "../utils/helpers";

// react refresh
const ReactRefreshAllowConstantExportPackages = ["vite"];
const ReactRouterPackages = [
  "@react-router/node",
  "@react-router/react",
  "@react-router/serve",
  "@react-router/dev"
];

export async function react(
  options: OptionsTypeScriptParserOptions &
    OptionsTypeScriptWithTypes &
    OptionsOverrides &
    OptionsFiles = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    filesTypeAware = [GLOB_TS, GLOB_TSX],
    ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS],
    overrides = {},
    tsconfigPath
  } = options;

  await ensurePackages([
    "@eslint-react/eslint-plugin",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react-refresh",
    "eslint-plugin-react-compiler"
  ]);

  const isTypeAware = !!tsconfigPath;

  const typeAwareRules: TypedFlatConfigItem["rules"] = {
    "react/no-leaked-conditional-rendering": "warn"
  };

  const [
    pluginReact,
    pluginReactHooks,
    pluginReactRefresh,
    pluginReactCompiler
  ] = await Promise.all([
    interopDefault(import("@eslint-react/eslint-plugin")),
    interopDefault(import("eslint-plugin-react-hooks")),
    interopDefault(import("eslint-plugin-react-refresh")),
    interopDefault(import("eslint-plugin-react-compiler"))
  ] as const);

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(
    i => isPackageExists(i)
  );
  const isUsingReactRouter = ReactRouterPackages.some(i => isPackageExists(i));

  return [
    pluginReactHooks.configs.flat["recommended-latest"],
    isTypeAware
      ? pluginReact.configs["recommended-type-checked"]
      : pluginReact.configs["recommended"],
    {
      name: "storm/react/setup",
      plugins: {
        "react-hooks": pluginReactHooks,
        "react-refresh": pluginReactRefresh,
        "react-compiler": pluginReactCompiler
      }
    },
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
        // recommended rules from @eslint-react/dom
        "@eslint-react/dom-no-void-elements-with-children": "warn",
        "@eslint-react/dom-no-dangerously-set-innerhtml": "warn",
        "@eslint-react/dom-no-dangerously-set-innerhtml-with-children": "error",
        "@eslint-react/dom-no-find-dom-node": "error",
        "@eslint-react/dom-no-missing-button-type": "warn",
        "@eslint-react/dom-no-missing-iframe-sandbox": "warn",
        "@eslint-react/dom-no-namespace": "error",
        "@eslint-react/dom-no-render-return-value": "error",
        "@eslint-react/dom-no-script-url": "warn",
        "@eslint-react/dom-no-unsafe-iframe-sandbox": "warn",
        "@eslint-react/dom-no-unsafe-target-blank": "warn",

        // recommended rules react-hooks
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks/rules-of-hooks": "error",

        // react refresh
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

        // recommended rules from @eslint-react/web-api
        "@eslint-react/web-api-no-leaked-event-listener": "warn",
        "@eslint-react/web-api-no-leaked-interval": "warn",
        "@eslint-react/web-api-no-leaked-resize-observer": "warn",
        "@eslint-react/web-api-no-leaked-timeout": "warn",

        // recommended rules from @eslint-react
        "@eslint-react/error-boundaries": "error",
        "@eslint-react/ensure-forward-ref-using-ref": "warn",
        "@eslint-react/jsx-no-duplicate-props": "warn",
        "@eslint-react/jsx-uses-vars": "warn",
        "@eslint-react/no-access-state-in-setstate": "error",
        "@eslint-react/no-array-index-key": "warn",
        "@eslint-react/no-children-count": "warn",
        "@eslint-react/no-children-for-each": "warn",
        "@eslint-react/no-children-map": "warn",
        "@eslint-react/no-children-only": "warn",
        "@eslint-react/no-children-to-array": "warn",
        "@eslint-react/no-clone-element": "warn",
        "@eslint-react/no-comment-textnodes": "warn",
        "@eslint-react/no-component-will-mount": "error",
        "@eslint-react/no-component-will-receive-props": "error",
        "@eslint-react/no-component-will-update": "error",
        "@eslint-react/no-context-provider": "warn",
        "@eslint-react/no-create-ref": "error",
        "@eslint-react/no-default-props": "error",
        "@eslint-react/no-direct-mutation-state": "error",
        "@eslint-react/no-duplicate-key": "error",
        "@eslint-react/no-forward-ref": "warn",
        "@eslint-react/no-implicit-key": "warn",
        "@eslint-react/no-missing-key": "error",
        "@eslint-react/no-nested-components": "error",
        "@eslint-react/no-prop-types": "error",
        "@eslint-react/no-redundant-should-component-update": "error",
        "@eslint-react/no-set-state-in-component-did-mount": "warn",
        "@eslint-react/no-set-state-in-component-did-update": "warn",
        "@eslint-react/no-set-state-in-component-will-update": "warn",
        "@eslint-react/no-string-refs": "error",
        "@eslint-react/no-unsafe-component-will-mount": "warn",
        "@eslint-react/no-unsafe-component-will-receive-props": "warn",
        "@eslint-react/no-unsafe-component-will-update": "warn",
        "@eslint-react/no-unstable-context-value": "warn",
        "@eslint-react/no-unstable-default-props": "warn",
        "@eslint-react/no-unused-class-component-members": "warn",
        "@eslint-react/no-unused-state": "warn",
        "@eslint-react/prefer-destructuring-assignment": "warn",
        "@eslint-react/prefer-shorthand-boolean": "warn",
        "@eslint-react/prefer-shorthand-fragment": "warn",

        // recommended rules from eslint-plugin-react-compiler
        "react-compiler/react-compiler": "error",

        // overrides
        ...overrides
      }
    },
    ...(isTypeAware
      ? [
          {
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            name: "storm/react/type-aware-rules",
            rules: {
              ...typeAwareRules
            }
          }
        ]
      : [])
  ];
}
