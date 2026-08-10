import prettierPluginOrganizeImports from "prettier-plugin-organize-imports";
import prettierPluginPackagejson from "prettier-plugin-packagejson";
import prettierPluginSh from "prettier-plugin-sh";
import base from "./base.json" with { type: "json" };

const { plugins: _, ...config } = base;

export default {
  ...config,
  plugins: [
    prettierPluginSh,
    prettierPluginPackagejson,
    prettierPluginOrganizeImports
  ]
};
