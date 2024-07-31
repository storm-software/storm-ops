import pluginPlugin from "eslint-plugin-eslint-plugin";
import stormPlugin from "./dist/plugins/eslint/index.mjs";

export default [
  ...stormPlugin.configs.recommended,
  {
    ...pluginPlugin.configs.recommended,
    plugins: {
      "eslint-plugin": pluginPlugin
    },
    files: ["packages/{eslint-plugin,eslint-plugin-*}/**/*"]
  }
];
