import path from "node:path";
import { ESLint, Linter } from "eslint";
import { rulesMap } from "../rules";
import getDocumentationUrl from "../rules/utils/get-documentation-url";
import { reportProblems } from "../rules/utils/rule";

function loadRuleFiles() {
  return Object.fromEntries(
    Object.keys(rulesMap).map(name => {
      const ruleId = path.basename(name, ".ts");

      return [
        ruleId,
        {
          meta: {
            // If there is are, options add `[]` so ESLint can validate that no data is passed to the rule.
            // https://github.com/not-an-aardvark/eslint-plugin-eslint-plugin/blob/master/docs/rules/require-meta-schema.md
            schema: [],
            ...rulesMap[name].meta,
            docs: {
              ...rulesMap[name].meta.docs,
              url: getDocumentationUrl(ruleId)
            }
          },
          create: reportProblems(rulesMap[name].create)
        }
      ];
    })
  );
}

export function createRules(): ESLint.Plugin["rules"] {
  const files = loadRuleFiles();

  return {
    ...files,
    "import-index": [],
    "no-array-instanceof": "storm-software/no-instanceof-array",
    "no-fn-reference-in-iterator": "storm-software/no-array-callback-reference",
    "no-reduce": "storm-software/no-array-reduce",
    "no-unsafe-regex": [],
    "prefer-dataset": "storm-software/prefer-dom-node-dataset",
    "prefer-event-key": "storm-software/prefer-keyboard-event-key",
    "prefer-exponentiation-operator": "prefer-exponentiation-operator",
    "prefer-flat-map": "storm-software/prefer-array-flat-map",
    "prefer-node-append": "storm-software/prefer-dom-node-append",
    "prefer-node-remove": "storm-software/prefer-dom-node-remove",
    "prefer-object-has-own": "prefer-object-has-own",
    "prefer-replace-all": "storm-software/prefer-string-replace-all",
    "prefer-starts-ends-with": "storm-software/prefer-string-starts-ends-with",
    "prefer-text-content": "storm-software/prefer-dom-node-text-content",
    "prefer-trim-start-end": "storm-software/prefer-string-trim-start-end",
    "regex-shorthand": "storm-software/better-regex"
  } as any;
}

export function createRulesConfig(): Partial<Linter.RulesRecord> {
  const files = loadRuleFiles();

  const rules = Object.fromEntries(
    Object.entries(files).map(([id, rule]) => [
      `storm-software/${id.endsWith(".ts") ? id.replaceAll(".ts", "") : id}`,
      rule.meta.docs.recommended ? "error" : "off"
    ])
  );

  return {
    // Covered by `storm-software/no-negated-condition`
    "no-negated-condition": "off",
    // Covered by `storm-software/no-nested-ternary`
    "no-nested-ternary": "off",
    ...rules
  };
}
