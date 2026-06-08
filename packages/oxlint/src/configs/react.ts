import type { OptionsReact, TypedConfigItem } from "../types";

export function react(options: OptionsReact = {}): TypedConfigItem {
  return {
    plugins: ["react"],
    rules: {
      "react/jsx-key": "error",
      "react/jsx-no-target-blank": "warn",
      "react/no-danger": "warn",
      "react/no-unknown-property": "error"
    },
    settings: {
      react: {
        version: options.version || "detect"
      }
    }
  };
}
