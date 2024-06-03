import { CODE_FILE, JS_FILES } from "./constants";

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
  ignorePatterns: ["next-env.d.ts"],
  extends: ["plugin:@next/next/recommended"],
  overrides: [
    {
      files: CODE_FILE,
      extends: "./react-base"
    },
    {
      files: [
        "**/pages/**", // Next.js pages directory use default export
        "next.config.{js,mjs}",
        "**/*.stories.tsx",
        ".storybook/main.ts"
      ],
      rules: {
        "import/no-default-export": "off"
      }
    },
    {
      files: ["next.config.{js,mjs}"],
      env: {
        node: true
      }
    },
    {
      files: JS_FILES,
      parserOptions: { babelOptions }
    }
  ]
};

export default config;
