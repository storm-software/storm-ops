import * as prettierPluginJsdoc from "prettier-plugin-jsdoc";
import prettierPluginOrganizeImports from "prettier-plugin-organize-imports";
import prettierPluginPackagejson from "prettier-plugin-packagejson";
import prettierPluginSh from "prettier-plugin-sh";
import prettierPluginToml from "prettier-plugin-toml";
import configJson from "./config.json" with { type: "json" };

const { plugins: _, ...config } = configJson;

export default {
  ...config,
  plugins: [
    prettierPluginSh,
    prettierPluginPackagejson,
    prettierPluginToml,
    prettierPluginJsdoc,
    prettierPluginOrganizeImports
  ]
};
