import { createRule } from "../helpers/create-rule";
import {
  getBunWorkspace,
  isRootWorkspacePackageJson
} from "../helpers/bun-workspace";
import { getPackageJsonRootNode } from "../helpers/iterate-dependencies";

const RULE_NAME = "json-no-duplicate-catalog-item";

type Options = [
  {
    allow?: string[];
  }
];

function getProperty(node: any, key: string): any | undefined {
  return node?.properties?.find(
    (property: any) =>
      property.key.type === "JSONLiteral" && property.key.value === key
  );
}

export default createRule<Options, "duplicateCatalogItem">({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow duplicate catalog items in the Bun workspace root `package.json`"
    },
    schema: [
      {
        type: "object",
        properties: {
          allow: {
            type: "array",
            items: { type: "string" }
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      duplicateCatalogItem:
        'Catalog item "{{name}}" is already defined in the "{{existingCatalog}}" catalog. You may want to remove one of them.'
    }
  },
  defaultOptions: [{}],
  create(context, [options = {}]) {
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

    const { allow = [] } = options;
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

    const exists = new Map<string, string>();
    const catalogEntries: Array<{ catalogName: string; property: any }> = [];

    if (catalogNode?.value?.type === "JSONObjectExpression") {
      for (const property of catalogNode.value.properties || []) {
        catalogEntries.push({ catalogName: "default", property });
      }
    }

    if (catalogsNode?.value?.type === "JSONObjectExpression") {
      for (const named of catalogsNode.value.properties || []) {
        if (named.value.type !== "JSONObjectExpression") {
          continue;
        }
        const catalogName = String(named.key.value);
        for (const property of named.value.properties || []) {
          catalogEntries.push({ catalogName, property });
        }
      }
    }

    for (const { catalogName, property } of catalogEntries) {
      const key = String(property.key.value);
      if (allow.includes(key)) {
        continue;
      }

      if (exists.has(key)) {
        context.report({
          node: property.value,
          messageId: "duplicateCatalogItem",
          data: {
            name: key,
            currentCatalog: catalogName,
            existingCatalog: exists.get(key)!
          }
        });
      } else {
        exists.set(key, catalogName);
      }
    }

    return {};
  }
});
