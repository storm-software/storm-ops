import defu from "defu";
import type {
  OptionsFormatters,
  StylisticConfig,
  TypedFlatConfigItem
} from "../types";
import {
  GLOB_ASTRO,
  GLOB_ASTRO_TS,
  GLOB_CSS,
  GLOB_GRAPHQL,
  GLOB_HTML,
  GLOB_LESS,
  GLOB_MARKDOWN,
  GLOB_POSTCSS,
  GLOB_SCSS,
  GLOB_SVG,
  GLOB_XML
} from "../utils/constants";
import {
  ensurePackages,
  interopDefault,
  isPackageInScope,
  parserPlain
} from "../utils/helpers";
import type {
  VendoredPrettierOptions,
  VendoredPrettierRuleOptions
} from "../vendor/prettier-types";
import { StylisticConfigDefaults } from "./stylistic";

function mergePrettierOptions(
  options: VendoredPrettierOptions,
  overrides: VendoredPrettierRuleOptions = {}
): VendoredPrettierRuleOptions {
  return {
    ...options,
    ...overrides,
    plugins: [...(overrides.plugins || []), ...(options.plugins || [])]
  };
}

export async function formatters(
  options: OptionsFormatters | true = {},
  stylistic: StylisticConfig = {}
): Promise<TypedFlatConfigItem[]> {
  if (options === true) {
    const isPrettierPluginXmlInScope = isPackageInScope("@prettier/plugin-xml");
    options = {
      astro: isPackageInScope("prettier-plugin-astro"),
      css: true,
      graphql: true,
      html: true,
      markdown: true,
      svg: isPrettierPluginXmlInScope,
      xml: isPrettierPluginXmlInScope
    };
  }

  await ensurePackages([
    "eslint-plugin-format",
    options.astro ? "prettier-plugin-astro" : undefined,
    options.xml || options.svg ? "@prettier/plugin-xml" : undefined
  ]);

  const {
    indent = 2,
    quotes = "double",
    semi = true
  } = {
    ...StylisticConfigDefaults,
    ...stylistic
  };

  const prettierOptions: VendoredPrettierOptions = defu(
    {
      proseWrap: "always",
      quoteProps: "preserve",
      bracketSameLine: true,
      bracketSpacing: true,
      arrowParens: "avoid",
      endOfLine: "lf",
      printWidth: 120,
      semi,
      singleQuote: quotes === "single",
      tabWidth: typeof indent === "number" ? indent : 2,
      trailingComma: "none",
      useTabs: indent === "tab"
    } satisfies VendoredPrettierOptions,
    options.prettierOptions ?? {}
  );

  const prettierXmlOptions: VendoredPrettierOptions = {
    xmlQuoteAttributes: "double",
    xmlSelfClosingSpace: true,
    xmlSortAttributesByKey: false,
    xmlWhitespaceSensitivity: "ignore"
  };

  const dprintOptions = defu(
    {
      indentWidth: typeof indent === "number" ? indent : 2,
      quoteStyle: quotes === "single" ? "preferSingle" : "preferDouble",
      useTabs: indent === "tab"
    },
    options.dprintOptions ?? {}
  );

  const pluginFormat = await interopDefault(import("eslint-plugin-format"));

  const configs: TypedFlatConfigItem[] = [
    {
      name: "storm/formatter/setup",
      plugins: {
        format: pluginFormat
      }
    }
  ];

  if (options.css) {
    configs.push(
      {
        files: [GLOB_CSS, GLOB_POSTCSS],
        languageOptions: {
          parser: parserPlain
        },
        name: "storm/formatter/css",
        rules: {
          "format/prettier": [
            "error",
            mergePrettierOptions(prettierOptions, {
              parser: "css"
            })
          ]
        }
      },
      {
        files: [GLOB_SCSS],
        languageOptions: {
          parser: parserPlain
        },
        name: "storm/formatter/scss",
        rules: {
          "format/prettier": [
            "error",
            mergePrettierOptions(prettierOptions, {
              parser: "scss"
            })
          ]
        }
      },
      {
        files: [GLOB_LESS],
        languageOptions: {
          parser: parserPlain
        },
        name: "storm/formatter/less",
        rules: {
          "format/prettier": [
            "error",
            mergePrettierOptions(prettierOptions, {
              parser: "less"
            })
          ]
        }
      }
    );
  }

  if (options.html) {
    configs.push({
      files: [GLOB_HTML],
      languageOptions: {
        parser: parserPlain
      },
      name: "storm/formatter/html",
      rules: {
        "format/prettier": [
          "error",
          mergePrettierOptions(prettierOptions, {
            parser: "html"
          })
        ]
      }
    });
  }

  if (options.xml) {
    configs.push({
      files: [GLOB_XML],
      languageOptions: {
        parser: parserPlain
      },
      name: "storm/formatter/xml",
      rules: {
        "format/prettier": [
          "error",
          mergePrettierOptions(
            { ...prettierXmlOptions, ...prettierOptions },
            {
              parser: "xml",
              plugins: ["@prettier/plugin-xml"]
            }
          )
        ]
      }
    });
  }
  if (options.svg) {
    configs.push({
      files: [GLOB_SVG],
      languageOptions: {
        parser: parserPlain
      },
      name: "storm/formatter/svg",
      rules: {
        "format/prettier": [
          "error",
          mergePrettierOptions(
            { ...prettierXmlOptions, ...prettierOptions },
            {
              parser: "xml",
              plugins: ["@prettier/plugin-xml"]
            }
          )
        ]
      }
    });
  }

  if (options.markdown) {
    const formater = options.markdown === true ? "prettier" : options.markdown;

    configs.push({
      files: [GLOB_MARKDOWN],
      languageOptions: {
        parser: parserPlain
      },
      name: "storm/formatter/markdown",
      rules: {
        [`format/${formater}`]: [
          "error",
          formater === "prettier"
            ? mergePrettierOptions(prettierOptions, {
                embeddedLanguageFormatting: "off",
                parser: "markdown"
              })
            : {
                ...dprintOptions,
                language: "markdown"
              }
        ]
      }
    });
  }

  if (options.astro) {
    configs.push({
      files: [GLOB_ASTRO],
      languageOptions: {
        parser: parserPlain
      },
      name: "storm/formatter/astro",
      rules: {
        "format/prettier": [
          "error",
          mergePrettierOptions(prettierOptions, {
            parser: "astro",
            plugins: ["prettier-plugin-astro"]
          })
        ]
      }
    });

    configs.push({
      files: [GLOB_ASTRO, GLOB_ASTRO_TS],
      name: "storm/formatter/astro/disables",
      rules: {
        "style/arrow-parens": "off",
        "style/block-spacing": "off",
        "style/comma-dangle": "off",
        "style/indent": "off",
        "style/no-multi-spaces": "off",
        "style/quotes": "off",
        "style/semi": "off"
      }
    });
  }

  if (options.graphql) {
    configs.push({
      files: [GLOB_GRAPHQL],
      languageOptions: {
        parser: parserPlain
      },
      name: "storm/formatter/graphql",
      rules: {
        "format/prettier": [
          "error",
          mergePrettierOptions(prettierOptions, {
            parser: "graphql"
          })
        ]
      }
    });
  }

  return configs;
}
