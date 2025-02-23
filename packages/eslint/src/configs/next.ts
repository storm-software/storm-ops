import { FlatCompat } from "@eslint/eslintrc";
import type { OptionsNext, TypedFlatConfigItem } from "../types";
import { ensurePackages } from "../utils/helpers";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname
});

/**
 * Config for Next.js projects.
 */
export async function next(
  options: OptionsNext = {}
): Promise<TypedFlatConfigItem[]> {
  const { coreWebVitals = true, rootDir } = options;

  await ensurePackages(["@next/eslint-plugin-next"]);

  return [
    ...compat.config({
      name: "storm/next/rules",
      extends: ["next"],
      settings: {
        next: {
          rootDir
        }
      },
      rules: {
        // warnings
        "@next/next/google-font-display": "warn",
        "@next/next/google-font-preconnect": "warn",
        "@next/next/next-script-for-ga": "warn",
        "@next/next/no-async-client-component": "warn",
        "@next/next/no-before-interactive-script-outside-document": "warn",
        "@next/next/no-css-tags": "warn",
        "@next/next/no-head-element": "warn",
        "@next/next/no-html-link-for-pages": "warn",
        "@next/next/no-img-element": "warn",
        "@next/next/no-page-custom-font": "warn",
        "@next/next/no-styled-jsx-in-document": "warn",
        "@next/next/no-sync-scripts": "warn",
        "@next/next/no-title-in-document-head": "warn",
        "@next/next/no-typos": "warn",
        "@next/next/no-unwanted-polyfillio": "warn",

        // errors
        "@next/next/inline-script-id": "error",
        "@next/next/no-assign-module-variable": "error",
        "@next/next/no-document-import-in-page": "error",
        "@next/next/no-duplicate-head": "error",
        "@next/next/no-head-import-in-document": "error",
        "@next/next/no-script-component-in-head": "error",

        // core web vitals
        ...(coreWebVitals
          ? {
              "@next/next/no-html-link-for-pages": "error",
              "@next/next/no-sync-scripts": "error"
            }
          : {})
      }
    })
  ];
}
