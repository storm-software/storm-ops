import prettier from "prettier";
import prettierConfig from "../prettier/src/config.json" with { type: "json" };

/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  postprocess: content =>
    prettier.format(content, { ...prettierConfig, parser: "markdown" }),
  configEmoji: [["recommended", "🌟"]],
  ruleDocSectionInclude: ["Rule Details", "Version", "Options", "Config"]
};

export default config;
