import config from "eslint-plugin-prettier/recommended";
import { TypedConfigItem } from "../types";

/**
 * Config for Prettier eslint integration
 */
export function prettier(): TypedConfigItem {
  return {
    jsPlugins: ["eslint-plugin-prettier"],
    rules: {
      ...config.rules,
      "prettier/prettier": "error",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off"
    }
  };
}
