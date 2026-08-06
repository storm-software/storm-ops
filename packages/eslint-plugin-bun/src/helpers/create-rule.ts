import type {
  RuleListener,
  RuleWithMeta,
  RuleWithMetaAndName
} from "@typescript-eslint/utils/eslint-utils";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import defu from "defu";
import type { Rule } from "eslint";

export type RuleModule<T extends readonly unknown[]> = Rule.RuleModule & {
  defaultOptions: T;
};

/**
 * Creates reusable function to create rules with default options and docs URLs.
 *
 * @param urlCreator - Creates a documentation URL for a given rule name.
 * @returns Function to create a rule with the docs URL format.
 */
function RuleCreator(urlCreator: (name: string) => string) {
  return function createNamedRule<
    TOptions extends readonly any[],
    TMessageIds extends string
  >({
    name,
    meta,
    ...rule
  }: Readonly<
    RuleWithMetaAndName<TOptions, TMessageIds>
  >): RuleModule<TOptions> {
    return createRuleInfo<TOptions, TMessageIds>({
      meta: {
        ...meta,
        docs: {
          ...meta.docs,
          url: urlCreator(name)
        }
      },
      ...rule
    });
  };
}

/**
 * Creates a well-typed TSESLint custom ESLint rule without a docs URL.
 *
 * @returns Well-typed TSESLint custom ESLint rule.
 */
function createRuleInfo<
  TOptions extends readonly any[],
  TMessageIds extends string
>({
  create,
  defaultOptions,
  meta
}: Readonly<RuleWithMeta<TOptions, TMessageIds>>): RuleModule<TOptions> {
  return {
    create: ((
      context: Readonly<RuleContext<TMessageIds, TOptions>>
    ): RuleListener => {
      const optionsWithDefault = context.options.map((options, index) => {
        return defu(defaultOptions?.[index] ?? {}, options);
      }) as unknown as TOptions;

      return create(context, optionsWithDefault);
    }) as any,
    defaultOptions: (defaultOptions ?? {}) as TOptions,
    meta: meta as any
  };
}

export const createRule = RuleCreator(
  ruleName =>
    `https://docs.stormsoftware.com/projects/storm-ops/eslint-plugin-bun/rules/${ruleName}.md`
) as any as <TOptions extends readonly unknown[], TMessageIds extends string>({
  name,
  meta,
  ...rule
}: Readonly<
  RuleWithMetaAndName<TOptions, TMessageIds>
>) => RuleModule<TOptions>;
