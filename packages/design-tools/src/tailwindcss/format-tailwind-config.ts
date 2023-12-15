import type { Config, Dictionary } from "style-dictionary/types";
import {
  DESIGN_COMPONENT_LIST,
  SYS_TOKEN_PREFIX,
  type SdTailwindConfigType,
  type TailwindFormatObjType
} from "../types";
import { isReferenceToken, isSystemToken } from "../utilities/token-formats";
import { getTemplateConfigByType } from "./tailwind-utilities";

const formatTokens = (
  tokens: Dictionary["allTokens"],
  isVariables: SdTailwindConfigType["isVariables"],
  excludeCompTokensOnType: SdTailwindConfigType["excludeCompTokensOnType"]
) => {
  const result = tokens.reduce<Record<string, Record<string, string>>>(
    (config, token) => {
      if (token.attributes === undefined) {
        throw new Error(`Token ${token.name} has no attributes`);
      }

      return addTokenToTailwindConfig(
        config,
        token.name,
        token.name,
        token.attributes.type ?? token["type"],
        isVariables,
        excludeCompTokensOnType
      );
    },
    {}
  );

  return JSON.stringify(result, null, 2);
};

const addTokenToTailwindConfig = (
  config: Record<string, Record<string, string>>,
  tokenName: string,
  tokenValue: string,
  tokenCategory: string,
  isVariables = true,
  excludeCompTokensOnType: SdTailwindConfigType["excludeCompTokensOnType"] = []
): Record<string, Record<string, string>> => {
  if (tokenCategory && !isReferenceToken(tokenName)) {
    const value = isVariables ? `var(--${tokenName})` : tokenValue;
    const name = tokenName.replace(`${SYS_TOKEN_PREFIX}-`, "");
    if (
      isSystemToken(tokenName) &&
      !excludeCompTokensOnType.includes(tokenCategory)
    ) {
      Object.assign([], DESIGN_COMPONENT_LIST).forEach(DESIGN_COMPONENT => {
        const componentTokenName = tokenName.replace(
          SYS_TOKEN_PREFIX,
          DESIGN_COMPONENT
        );

        if (
          !config[tokenCategory] ||
          !(componentTokenName in config[tokenCategory])
        ) {
          config = addTokenToTailwindConfig(
            config,
            componentTokenName,
            value,
            tokenCategory,
            false
          );
        }
      });
    }

    if (tokenCategory in config) {
      config[tokenCategory][name] = value;
    } else {
      config[tokenCategory] = { [name]: value };
    }
  }

  return config;
};

const getConfigValue = <T>(value: T | undefined, defaultValue: T) => {
  if (value === undefined) {
    return defaultValue;
  }

  return value;
};

export const getTailwindFormat = ({
  dictionary: { allTokens },
  isVariables,
  isPreset = true,
  excludeCompTokensOnType = [],
  tailwind
}: TailwindFormatObjType) => {
  const config = formatTokens(allTokens, isVariables, excludeCompTokensOnType);

  const darkMode = getConfigValue(tailwind?.darkMode, [
    "class",
    "[data-mode='dark']"
  ]);

  const tailwindContent = getConfigValue(
    Array.isArray(tailwind?.content)
      ? tailwind?.content.map(content => `"${content}"`)
      : tailwind?.content,
    [`"./src/**/*.{ts,tsx}"`]
  );

  const plugins = getConfigValue(
    tailwind?.plugins?.map(plugin => {
      return `require("@tailwindcss/${plugin}")`;
    }),
    []
  );

  return getTemplateConfigByType(
    config,
    isPreset,
    darkMode,
    tailwindContent,
    plugins
  );
};

export const formatTailwindConfig = ({
  type = "all",
  formatType = "js",
  isVariables = true,
  isPreset = false,
  excludeCompTokensOnType = [],
  source,
  transforms,
  buildPath,
  tailwind
}: SdTailwindConfigType): Config => {
  if (formatType !== "js" && formatType !== "cjs") {
    throw new Error('formatType must be "js" or "cjs"');
  }

  return {
    source: getConfigValue(source, ["src/tokens/**/*.json"]),
    format: {
      tailwindFormat: ({ dictionary }: { dictionary: Dictionary }) => {
        return getTailwindFormat({
          dictionary,
          formatType,
          isVariables,
          isPreset,
          excludeCompTokensOnType,
          tailwind
        });
      }
    },
    platforms: {
      [type !== "all" ? `tailwind/${type}` : "tailwind"]: {
        transforms: getConfigValue(transforms, [
          "attribute/cti",
          "name/cti/kebab"
        ]),
        buildPath: getConfigValue(buildPath, "./"),
        files: [
          {
            destination:
              type !== "all"
                ? `${type}.tailwind.js`
                : `tailwind.config.${formatType}`,
            format: "tailwindFormat"
          }
        ]
      }
    }
  };
};
