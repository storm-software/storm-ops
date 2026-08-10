import prettierPluginOrganizeImports from "prettier-plugin-organize-imports";
import prettierPluginPackagejson from "prettier-plugin-packagejson";
import prettierPluginPrisma from "prettier-plugin-prisma";
import prettierPluginSh from "prettier-plugin-sh";
import prettierPluginToml from "prettier-plugin-toml";
import prisma from "./prisma.json" with { type: "json" };

const { plugins: _, ...config } = prisma;

export default {
  ...config,
  plugins: [
    prettierPluginSh,
    prettierPluginPackagejson,
    prettierPluginToml,
    prettierPluginOrganizeImports,
    prettierPluginPrisma
  ]
};
