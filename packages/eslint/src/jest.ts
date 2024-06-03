import type { Linter } from "eslint";

const config: Linter.Config = {
  overrides: [
    {
      files: ["*.spec.ts", "*.spec.tsx", "*.spec.js", "*.spec.jsx"],
      env: {
        jest: true
      },
      rules: {}
    }
  ]
};

export default config;
