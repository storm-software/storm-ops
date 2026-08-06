import fs from "node:fs";
import { createRule } from "../helpers/create-rule";
import {
  collectWorkspacePackageJsonPaths,
  getBunWorkspace,
  isRootWorkspacePackageJson
} from "../helpers/bun-workspace";
import {
  getObjectPath,
  getPackageJsonRootNode
} from "../helpers/iterate-dependencies";

const RULE_NAME = "json-no-unused-catalog-item";

const FIELDS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
  "overrides",
  "resolutions"
];

function getProperty(node: any, key: string): any | undefined {
  return node?.properties?.find(
    (property: any) =>
      property.key.type === "JSONLiteral" && property.key.value === key
  );
}

export default createRule<[], "unusedCatalogItem">({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow unused catalog items in the Bun workspace root `package.json`"
    },
    schema: [],
    messages: {
      unusedCatalogItem:
        'Catalog item "{{catalogItem}}" is not used in any package.json.'
    }
  },
  defaultOptions: [],
  create(context) {
    if (!isRootWorkspacePackageJson(context.filename)) {
      return {};
    }

    let workspace;
    try {
      workspace = getBunWorkspace();
    } catch {
      return {};
    }

    if (workspace.hasChanged() || workspace.hasQueue()) {
      return {};
    }

    workspace.setContent(context.sourceCode.text);
    const root = getPackageJsonRootNode(context as any);
    if (!root) {
      return {};
    }

    const topCatalog = getProperty(root, "catalog");
    const topCatalogs = getProperty(root, "catalogs");
    const workspaces = getProperty(root, "workspaces");
    const workspacesCatalog =
      workspaces?.value?.type === "JSONObjectExpression"
        ? getProperty(workspaces.value, "catalog")
        : undefined;
    const workspacesCatalogs =
      workspaces?.value?.type === "JSONObjectExpression"
        ? getProperty(workspaces.value, "catalogs")
        : undefined;

    const catalogNode = topCatalog ?? workspacesCatalog;
    const catalogsNode = topCatalogs ?? workspacesCatalogs;

    const entries = new Map<string, any>();

    if (catalogNode?.value?.type === "JSONObjectExpression") {
      for (const property of catalogNode.value.properties || []) {
        entries.set(`${String(property.key.value)}:default`, property);
      }
    }

    if (catalogsNode?.value?.type === "JSONObjectExpression") {
      for (const named of catalogsNode.value.properties || []) {
        if (named.value.type !== "JSONObjectExpression") {
          continue;
        }
        const catalogName = String(named.key.value);
        for (const property of named.value.properties || []) {
          entries.set(`${String(property.key.value)}:${catalogName}`, property);
        }
      }
    }

    if (entries.size === 0) {
      return {};
    }

    const packages = collectWorkspacePackageJsonPaths(workspace);

    for (const path of packages) {
      const pkg = JSON.parse(fs.readFileSync(path, "utf8")) as Record<
        string,
        unknown
      >;

      for (const field of FIELDS) {
        const map = getObjectPath(pkg, field.split("."));
        if (!map) {
          continue;
        }

        for (const [name, value] of Object.entries(map)) {
          if (typeof value !== "string" || !value.startsWith("catalog:")) {
            continue;
          }
          const catalogName = value.slice(8) || "default";
          entries.delete(`${name}:${catalogName}`);
        }
      }
    }

    if (entries.size > 0) {
      for (const [key, property] of Array.from(entries.entries()).sort(
        (a, b) => a[0].localeCompare(b[0])
      )) {
        context.report({
          node: property.value,
          messageId: "unusedCatalogItem",
          data: { catalogItem: key }
        });
      }
    }

    return {};
  }
});
