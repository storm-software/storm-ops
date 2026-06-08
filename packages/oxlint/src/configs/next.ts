import type { OptionsNext, TypedConfigItem } from "../types";

export function next(options: OptionsNext = {}): TypedConfigItem {
  const { coreWebVitals = true, rootDir } = options;

  return {
    plugins: ["nextjs"],
    rules: {
      ...(coreWebVitals
        ? {
            "nextjs/no-html-link-for-pages": "error",
            "nextjs/no-sync-scripts": "error"
          }
        : {}),
      "nextjs/no-assign-module-variable": "error",
      "nextjs/no-document-import-in-page": "error",
      "nextjs/no-head-import-in-document": "error"
    },
    settings: {
      next: rootDir ? { rootDir } : {}
    }
  };
}
