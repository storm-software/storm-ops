import prettierPluginOrganizeImports from "prettier-plugin-organize-imports";
import prettierPluginPackagejson from "prettier-plugin-packagejson";
import prettierPluginPrisma from "prettier-plugin-prisma";
import prettierPluginSh from "prettier-plugin-sh";
import * as prettierPluginTailwindcss from "prettier-plugin-tailwindcss";
import prettierPluginToml from "prettier-plugin-toml";
import tailwindcss from "./tailwindcss.json" with { type: "json" };

const { plugins: _, ...config } = tailwindcss;

export default {
  ...config,
  plugins: [
    prettierPluginSh,
    prettierPluginPackagejson,
    prettierPluginToml,
    prettierPluginOrganizeImports,
    prettierPluginPrisma,
    prettierPluginTailwindcss
  ]
};
