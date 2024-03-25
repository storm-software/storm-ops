import { JS_FILES } from "../constants";

const babelOptions = {
  presets: (() => {
    try {
      require.resolve("next/babel");
      return ["next/babel"];
    } catch (_e) {
      return [];
    }
  })()
};

const config = {
  root: true,
  extends: ["plugin:@next/next/recommended"],
  overrides: [
    {
      files: JS_FILES,
      parserOptions: { babelOptions }
    }
  ]
};

export default config;
