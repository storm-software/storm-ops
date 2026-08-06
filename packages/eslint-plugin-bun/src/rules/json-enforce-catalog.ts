import { createRule } from "../helpers/create-rule";
import { getBunWorkspace } from "../helpers/bun-workspace";
import { iterateDependencies } from "../helpers/iterate-dependencies";

const RULE_NAME = "json-enforce-catalog";

const DEFAULT_FIELDS = ["dependencies", "devDependencies"];
const IGNORED_DEPENDENCIES = ["typescript"];

type Options = [
  {
    allowedProtocols?: string[];
    autofix?: boolean;
    defaultCatalog?: string;
    reuseExistingCatalog?: boolean;
    conflicts?: "new-catalog" | "overrides" | "error";
    fields?: string[];
    ignore?: string[];
  }
];

export default createRule<Options, "expectCatalog">({
  name: RULE_NAME,
  meta: {
    type: "layout",
    docs: {
      description:
        'Enforce using "catalog:" in `package.json` and write versions to the Bun workspace root catalog'
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          allowedProtocols: {
            type: "array",
            description:
              "Allowed protocols in specifier to not be converted to catalog",
            items: { type: "string" }
          },
          autofix: {
            type: "boolean",
            description: "Whether to autofix the linting error",
            default: true
          },
          defaultCatalog: {
            type: "string",
            description:
              "Default catalog to use when moving version to catalog with autofix"
          },
          reuseExistingCatalog: {
            type: "boolean",
            description:
              "Whether to reuse existing catalog when moving version to catalog with autofix",
            default: true
          },
          conflicts: {
            type: "string",
            description:
              "Strategy to handle conflicts when adding packages to catalogs",
            enum: ["new-catalog", "overrides", "error"],
            default: "new-catalog"
          },
          fields: {
            type: "array",
            description: "Fields to check for catalog",
            items: { type: "string" },
            default: DEFAULT_FIELDS
          },
          ignore: {
            type: "array",
            description: "A list of dependencies to ignore",
            items: { type: "string" },
            default: IGNORED_DEPENDENCIES
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      expectCatalog:
        'Expect to use catalog instead of plain specifier, got "{{specifier}}" for package "{{packageName}}".'
    }
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const {
      allowedProtocols = ["workspace", "link", "file"],
      defaultCatalog = "default",
      autofix = true,
      reuseExistingCatalog = true,
      conflicts = "new-catalog",
      fields = DEFAULT_FIELDS,
      ignore = IGNORED_DEPENDENCIES
    } = options || {};

    for (const { packageName, specifier, property } of iterateDependencies(
      context as any,
      fields
    )) {
      if (ignore?.some(name => name === packageName)) {
        continue;
      }
      if (specifier.startsWith("catalog:")) {
        continue;
      }
      if (allowedProtocols?.some(protocol => specifier.startsWith(protocol))) {
        continue;
      }

      let workspace;
      try {
        workspace = getBunWorkspace();
      } catch {
        return {};
      }

      let targetCatalog = reuseExistingCatalog
        ? workspace.getPackageCatalogs(packageName)[0] || defaultCatalog
        : defaultCatalog;

      const resolvedConflicts = workspace.hasSpecifierConflicts(
        targetCatalog,
        packageName,
        specifier
      );

      let shouldFix = autofix;
      if (conflicts === "error" && resolvedConflicts.conflicts) {
        shouldFix = false;
      }
      if (conflicts === "new-catalog" && resolvedConflicts.conflicts) {
        targetCatalog = resolvedConflicts.newCatalogName;
      }
      if (conflicts === "overrides") {
        // Keep target catalog; setPackage overwrites existing specifier.
      }

      context.report({
        node: property.value as any,
        messageId: "expectCatalog",
        data: {
          specifier,
          packageName
        },
        fix: shouldFix
          ? fixer => {
              workspace.queueChange(() => {
                workspace.setPackage(targetCatalog, packageName, specifier);
              });
              return fixer.replaceText(
                property.value as any,
                targetCatalog === "default"
                  ? JSON.stringify("catalog:")
                  : JSON.stringify(`catalog:${targetCatalog}`)
              );
            }
          : undefined
      });
    }

    return {};
  }
});
