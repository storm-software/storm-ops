import { createRule } from "../helpers/create-rule";
import { getBunWorkspace } from "../helpers/bun-workspace";
import { iterateDependencies } from "../helpers/iterate-dependencies";

const RULE_NAME = "json-valid-catalog";

const DEFAULT_FIELDS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
  "resolutions",
  "overrides"
];

type Options = [
  {
    autoInsert?: boolean;
    autoInsertDefaultSpecifier?: string;
    autofix?: boolean;
    fields?: string[];
  }
];

export default createRule<Options, "invalidCatalog">({
  name: RULE_NAME,
  meta: {
    type: "layout",
    docs: {
      description:
        "Enforce using valid Bun catalog references in `package.json`"
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          autoInsert: {
            type: "boolean",
            description: "Whether to auto insert to catalog if missing",
            default: true
          },
          autoInsertDefaultSpecifier: {
            type: "string",
            description:
              "Default specifier to use when auto inserting to catalog",
            default: "^0.0.0"
          },
          autofix: {
            type: "boolean",
            description: "Whether to autofix the linting error",
            default: true
          },
          fields: {
            type: "array",
            description: "Fields to check for catalog",
            default: DEFAULT_FIELDS
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      invalidCatalog:
        'Catalog "{{specifier}}" for package "{{packageName}}" is not defined in the workspace root `package.json`.'
    }
  },
  defaultOptions: [{}],
  create(context, [options = {}]) {
    const {
      autoInsert = true,
      autofix = true,
      autoInsertDefaultSpecifier = "^0.0.0",
      fields = DEFAULT_FIELDS
    } = options || {};

    for (const { packageName, specifier, property } of iterateDependencies(
      context as any,
      fields
    )) {
      if (!specifier.startsWith("catalog:")) {
        continue;
      }

      let workspace;
      try {
        workspace = getBunWorkspace();
      } catch {
        return {};
      }

      const currentCatalog =
        specifier.replace(/^catalog:/, "").trim() || "default";
      const existingCatalogs = workspace.getPackageCatalogs(packageName);

      if (!existingCatalogs.includes(currentCatalog)) {
        context.report({
          node: property.value as any,
          messageId: "invalidCatalog",
          data: {
            specifier,
            packageName
          },
          fix:
            !autofix || (!autoInsert && !existingCatalogs.length)
              ? undefined
              : fixer => {
                  let catalog = existingCatalogs[0];
                  if (!catalog && autoInsert) {
                    catalog = currentCatalog;
                    workspace.queueChange(() => {
                      workspace.setPackage(
                        catalog!,
                        packageName,
                        autoInsertDefaultSpecifier
                      );
                    }, "pre");
                  }
                  return fixer.replaceText(
                    property.value as any,
                    catalog === "default"
                      ? JSON.stringify("catalog:")
                      : JSON.stringify(`catalog:${catalog}`)
                  );
                }
        });
      }
    }

    return {};
  }
});
