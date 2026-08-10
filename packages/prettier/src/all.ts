import * as prettierPluginJsdoc from "prettier-plugin-jsdoc";
import prettierPluginOrganizeImports from "prettier-plugin-organize-imports";
import prettierPluginPackagejson from "prettier-plugin-packagejson";
import prettierPluginPrisma from "prettier-plugin-prisma";
import prettierPluginSh from "prettier-plugin-sh";
import prettierPluginSolidity from "prettier-plugin-solidity";
import * as prettierPluginTailwindcss from "prettier-plugin-tailwindcss";
import prettierPluginToml from "prettier-plugin-toml";
import all from "./all.json" with { type: "json" };

const { plugins: _, ...config } = all;

export default {
  ...config,
  plugins: [
    prettierPluginSh,
    prettierPluginPackagejson,
    prettierPluginJsdoc,
    prettierPluginToml,
    prettierPluginPrisma,
    prettierPluginOrganizeImports,
    prettierPluginSolidity,
    prettierPluginTailwindcss
  ]
};
