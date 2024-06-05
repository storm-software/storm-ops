import { FlatCompat } from "@eslint/eslintrc";
import { eslintPlugin } from "./index.cts";

export interface ApplyOptions {
  baseDirectory: string;
  useReact?: boolean;
  useNext?: boolean;
}

export const apply = ({ baseDirectory, useReact, useNext }: ApplyOptions) => {
  const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: eslintPlugin.configs.recommended
  });

  const typescriptExtends = ["plugin:@storm-software/typescript"];
  if (useReact) {
    typescriptExtends.push("plugin:@storm-software/react");
  }
  if (useNext) {
    typescriptExtends.push("plugin:@storm-software/next");
  }

  return [
    { plugins: { "@storm-software": eslintPlugin } },
    ...compat
      .config({
        parser: "jsonc-eslint-parser",
        extends: ["plugin:@storm-software/json"]
      })
      .map(config => ({
        ...config,
        files: ["**/*.json", "**/*.jsonc"],
        rules: {}
      })),
    ...compat
      .config({ extends: ["plugin:@storm-software/yml"] })
      .map(config => ({
        ...config,
        files: ["**/*.yaml", "**/*.yml"],
        rules: {}
      })),
    ...compat
      .config({ extends: ["plugin:@storm-software/mdx"] })
      .map(config => ({
        ...config,
        files: ["**/*.md", "**/*.mdx"],
        rules: {}
      })),
    ...compat
      .config({ extends: ["plugin:@storm-software/javascript"] })
      .map(config => ({
        ...config,
        files: ["**/*.js", "**/*.jsx"],
        rules: {}
      })),
    ...compat
      .config({ extends: ["plugin:@storm-software/jest"] })
      .map(config => ({
        ...config,
        files: [
          "**/*.test.ts",
          "**/*.test.tsx",
          "**/*.spec.ts",
          "**/*.spec.tsx",
          "**/*.spec.js",
          "**/*.spec.jsx"
        ],
        rules: {}
      })),
    ...compat.config({ extends: typescriptExtends }).map(config => ({
      ...config,
      files: ["**/*.ts", "**/*.mts", "**/*.cts", "**/*.tsx"],
      rules: {}
    })),
    ...compat
      .config({ extends: ["plugin:@storm-software/graphql"] })
      .map(config => ({
        ...config,
        files: ["**/*.gql", "**/*.graphql"],
        rules: {}
      }))
  ];
};
