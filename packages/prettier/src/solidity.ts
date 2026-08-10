import prettierPluginOrganizeImports from "prettier-plugin-organize-imports";
import prettierPluginPackagejson from "prettier-plugin-packagejson";
import prettierPluginPrisma from "prettier-plugin-prisma";
import prettierPluginSh from "prettier-plugin-sh";
import prettierPluginSolidity from "prettier-plugin-solidity";
import prettierPluginToml from "prettier-plugin-toml";
import solidity from "./solidity.json" with { type: "json" };

const { plugins: _, ...config } = solidity;

export default {
  ...config,
  plugins: [
    prettierPluginSh,
    prettierPluginPackagejson,
    prettierPluginToml,
    prettierPluginPrisma,
    prettierPluginOrganizeImports,
    prettierPluginSolidity
  ]
};
