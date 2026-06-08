import config from "eslint-plugin-prettier/recommended";
import { RuleValue, TypedConfigItem } from "../types";

const missingPluginPrefixes = [
  "@babel",
  "@stylistic",
  "babel",
  "flowtype",
  "standard"
];

const missingEslintRules = new Set([
  "array-bracket-newline",
  "array-bracket-spacing",
  "array-element-newline",
  "arrow-parens",
  "arrow-spacing",
  "block-spacing",
  "brace-style",
  "comma-dangle",
  "comma-spacing",
  "comma-style",
  "computed-property-spacing",
  "dot-location",
  "eol-last",
  "func-call-spacing",
  "function-call-argument-newline",
  "function-paren-newline",
  "generator-star",
  "generator-star-spacing",
  "implicit-arrow-linebreak",
  "indent",
  "indent-legacy",
  "jsx-quotes",
  "key-spacing",
  "keyword-spacing",
  "linebreak-style",
  "lines-around-comment",
  "max-len",
  "max-statements-per-line",
  "multiline-ternary",
  "newline-per-chained-call",
  "new-parens",
  "no-arrow-condition",
  "no-comma-dangle",
  "no-confusing-arrow",
  "no-extra-parens",
  "no-extra-semi",
  "no-floating-decimal",
  "no-mixed-operators",
  "no-mixed-spaces-and-tabs",
  "no-multi-spaces",
  "no-multiple-empty-lines",
  "no-space-before-semi",
  "no-spaced-func",
  "no-tabs",
  "no-trailing-spaces",
  "no-whitespace-before-property",
  "no-wrap-func",
  "nonblock-statement-body-position",
  "object-curly-newline",
  "object-curly-spacing",
  "object-property-newline",
  "one-var-declaration-per-line",
  "operator-linebreak",
  "padded-blocks",
  "quote-props",
  "quotes",
  "rest-spread-spacing",
  "semi",
  "semi-spacing",
  "semi-style",
  "space-after-function-name",
  "space-after-keywords",
  "space-before-blocks",
  "space-before-function-paren",
  "space-before-function-parentheses",
  "space-before-keywords",
  "space-in-brackets",
  "space-infix-ops",
  "space-in-parens",
  "space-return-throw-case",
  "space-unary-ops",
  "space-unary-word-ops",
  "switch-colon-spacing",
  "template-curly-spacing",
  "template-tag-spacing",
  "wrap-iife",
  "wrap-regex",
  "yield-star-spacing"
]);

const missingPluginRules = new Set([
  "jsdoc/check-alignment",
  "react/jsx-child-element-spacing",
  "react/jsx-closing-bracket-location",
  "react/jsx-closing-tag-location",
  "react/jsx-curly-newline",
  "react/jsx-curly-spacing",
  "react/jsx-equals-spacing",
  "react/jsx-first-prop-new-line",
  "react/jsx-indent",
  "react/jsx-indent-props",
  "react/jsx-max-props-per-line",
  "react/jsx-newline",
  "react/jsx-one-expression-per-line",
  "react/jsx-props-no-multi-spaces",
  "react/jsx-space-before-closing",
  "react/jsx-tag-spacing",
  "react/jsx-wrap-multilines",
  "typescript/block-spacing",
  "typescript/brace-style",
  "typescript/comma-dangle",
  "typescript/comma-spacing",
  "typescript/func-call-spacing",
  "typescript/indent",
  "typescript/key-spacing",
  "typescript/keyword-spacing",
  "typescript/lines-around-comment",
  "typescript/member-delimiter-style",
  "typescript/no-extra-parens",
  "typescript/no-extra-semi",
  "typescript/object-curly-spacing",
  "typescript/quotes",
  "typescript/semi",
  "typescript/space-before-blocks",
  "typescript/space-before-function-paren",
  "typescript/space-infix-ops",
  "typescript/type-annotation-spacing",
  "unicorn/template-indent",
  "vue/array-bracket-newline",
  "vue/array-bracket-spacing",
  "vue/array-element-newline",
  "vue/arrow-spacing",
  "vue/block-spacing",
  "vue/block-tag-newline",
  "vue/brace-style",
  "vue/comma-dangle",
  "vue/comma-spacing",
  "vue/comma-style",
  "vue/dot-location",
  "vue/func-call-spacing",
  "vue/html-closing-bracket-newline",
  "vue/html-closing-bracket-spacing",
  "vue/html-end-tags",
  "vue/html-indent",
  "vue/html-quotes",
  "vue/html-self-closing",
  "vue/key-spacing",
  "vue/keyword-spacing",
  "vue/max-attributes-per-line",
  "vue/max-len",
  "vue/multiline-html-element-content-newline",
  "vue/multiline-ternary",
  "vue/mustache-interpolation-spacing",
  "vue/no-extra-parens",
  "vue/no-multi-spaces",
  "vue/no-spaces-around-equal-signs-in-attribute",
  "vue/object-curly-newline",
  "vue/object-curly-spacing",
  "vue/object-property-newline",
  "vue/operator-linebreak",
  "vue/quote-props",
  "vue/script-indent",
  "vue/singleline-html-element-content-newline",
  "vue/space-infix-ops",
  "vue/space-in-parens",
  "vue/space-unary-ops",
  "vue/template-curly-spacing"
]);

/**
 * Config for Prettier eslint integration
 */
export function prettier(): TypedConfigItem {
  const rules = Object.entries(config.rules ?? {}).reduce(
    (ret, [rule, value]) => {
      if (
        missingPluginPrefixes.some(pluginName =>
          rule.startsWith(`${pluginName}/`)
        )
      ) {
        return ret;
      }

      if (missingEslintRules.has(rule) || missingPluginRules.has(rule)) {
        return ret;
      }

      ret[rule] = value as RuleValue;
      return ret;
    },
    {} as Record<string, RuleValue>
  );

  return {
    jsPlugins: ["eslint-plugin-prettier"],
    rules: {
      ...rules,
      "prettier/prettier": "error",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off"
    }
  };
}
