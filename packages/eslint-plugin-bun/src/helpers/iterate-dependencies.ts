import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";

export function getPackageJsonRootNode(
  context: RuleContext<string, unknown[]>
): any | undefined {
  if (!context.filename.endsWith("package.json")) {
    return undefined;
  }

  const ast = context.sourceCode.ast;
  const root = ast.body[0] as any;

  if (root?.expression?.type === "JSONObjectExpression") {
    return root.expression;
  }

  return undefined;
}

export function* iterateDependencies(
  context: RuleContext<string, unknown[]>,
  fields: string[]
) {
  const root = getPackageJsonRootNode(context);
  if (!root) {
    return;
  }

  for (const fieldName of fields) {
    const path = fieldName.split(".");
    let node: any = root;

    for (const segment of path) {
      const item = node.properties?.find(
        (property: any) =>
          property.key.type === "JSONLiteral" && property.key.value === segment
      );
      if (!item?.value || item.value.type !== "JSONObjectExpression") {
        node = undefined;
        break;
      }
      node = item.value;
    }

    if (!node || node === root || !node.properties) {
      continue;
    }

    for (const property of node.properties) {
      if (
        property.value.type !== "JSONLiteral" ||
        property.key.type !== "JSONLiteral"
      ) {
        continue;
      }
      if (typeof property.value.value !== "string") {
        continue;
      }

      yield {
        packageName: String(property.key.value),
        specifier: String(property.value.value),
        property
      };
    }
  }
}

export function getObjectPath(
  obj: Record<string, unknown>,
  path: string[]
): Record<string, string> | undefined {
  let current: unknown = obj;
  for (const key of path) {
    if (!current || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
    if (!current) {
      return undefined;
    }
  }
  return current as Record<string, string>;
}
