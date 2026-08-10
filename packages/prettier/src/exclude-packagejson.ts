import * as prettierPluginJsdoc from "prettier-plugin-jsdoc";
import prettierPluginOrganizeImports from "prettier-plugin-organize-imports";
import prettierPluginSh from "prettier-plugin-sh";
import prettierPluginToml from "prettier-plugin-toml";
import excludePackagejson from "./exclude-packagejson.json" with { type: "json" };

const { plugins: _, ...config } = excludePackagejson;

export default {
  ...config,
  plugins: [
    prettierPluginSh,
    prettierPluginToml,
    prettierPluginJsdoc,
    prettierPluginOrganizeImports
  ]
};
