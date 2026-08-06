import type { ESLint } from "eslint";
import packageJson from "../package.json" with { type: "json" };
import jsonEnforceCatalog from "./rules/json-enforce-catalog";
import jsonNoDuplicateCatalogItem from "./rules/json-no-duplicate-catalog-item";
import jsonNoUnusedCatalogItem from "./rules/json-no-unused-catalog-item";
import jsonValidCatalog from "./rules/json-valid-catalog";

export const plugin = {
  meta: {
    name: "bun",
    version: packageJson.version
  },
  rules: {
    "json-enforce-catalog": jsonEnforceCatalog,
    "json-valid-catalog": jsonValidCatalog,
    "json-no-unused-catalog-item": jsonNoUnusedCatalogItem,
    "json-no-duplicate-catalog-item": jsonNoDuplicateCatalogItem
  }
} satisfies ESLint.Plugin;
