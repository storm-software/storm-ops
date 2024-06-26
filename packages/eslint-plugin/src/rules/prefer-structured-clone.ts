import { isCallExpression, isMethodCall } from "./ast";
import { removeParentheses } from "./fix";
import { getCallExpressionTokens, isNodeMatchesNameOrPath } from "./utils";

const MESSAGE_ID_ERROR = "prefer-structured-clone/error";
const MESSAGE_ID_SUGGESTION = "prefer-structured-clone/suggestion";
const messages = {
  [MESSAGE_ID_ERROR]:
    "Prefer `structuredClone(…)` over `{{description}}` to create a deep clone.",
  [MESSAGE_ID_SUGGESTION]: "Switch to `structuredClone(…)`."
};

const lodashCloneDeepFunctions = ["_.cloneDeep", "lodash.cloneDeep"];

/** @param {import('eslint').Rule.RuleContext} context */
const create = context => {
  const createOptions = {
    functions: [],
    ...context.options[0]
  };
  const functions = [...createOptions.functions, ...lodashCloneDeepFunctions];

  // `JSON.parse(JSON.stringify(…))`
  context.on("CallExpression", callExpression => {
    if (
      !(
        // `JSON.stringify()`
        (
          isMethodCall(callExpression, {
            object: "JSON",
            method: "parse",
            argumentsLength: 1,
            optionalCall: false,
            optionalMember: false
          }) &&
          // `JSON.parse()`
          isMethodCall(callExpression.arguments[0], {
            object: "JSON",
            method: "stringify",
            argumentsLength: 1,
            optionalCall: false,
            optionalMember: false
          })
        )
      )
    ) {
      return;
    }

    const jsonParse = callExpression;
    const jsonStringify = callExpression.arguments[0];

    return {
      node: jsonParse,
      loc: {
        start: jsonParse.loc.start,
        end: jsonStringify.callee.loc.end
      },
      messageId: MESSAGE_ID_ERROR,
      data: {
        description: "JSON.parse(JSON.stringify(…))"
      },
      suggest: [
        {
          messageId: MESSAGE_ID_SUGGESTION,
          *fix(fixer) {
            yield fixer.replaceText(jsonParse.callee, "structuredClone");

            const { sourceCode } = context;

            yield fixer.remove(jsonStringify.callee);
            yield* removeParentheses(jsonStringify.callee, fixer, sourceCode);

            const {
              openingParenthesisToken,
              closingParenthesisToken,
              trailingCommaToken
            } = getCallExpressionTokens(sourceCode, jsonStringify);

            yield fixer.remove(openingParenthesisToken);
            yield fixer.remove(closingParenthesisToken);
            if (trailingCommaToken) {
              yield fixer.remove(trailingCommaToken);
            }
          }
        }
      ]
    };
  });

  // `_.cloneDeep(foo)`
  context.on("CallExpression", callExpression => {
    if (
      !isCallExpression(callExpression, {
        argumentsLength: 1,
        optional: false
      })
    ) {
      return;
    }

    const { callee } = callExpression;
    const matchedFunction = functions.find(nameOrPath =>
      isNodeMatchesNameOrPath(callee, nameOrPath)
    );

    if (!matchedFunction) {
      return;
    }

    return {
      node: callee,
      messageId: MESSAGE_ID_ERROR,
      data: {
        description: `${matchedFunction.trim()}(…)`
      },
      suggest: [
        {
          messageId: MESSAGE_ID_SUGGESTION,
          fix: fixer => fixer.replaceText(callee, "structuredClone")
        }
      ]
    };
  });
};

const schema = [
  {
    type: "object",
    additionalProperties: false,
    properties: {
      functions: {
        type: "array",
        uniqueItems: true
      }
    }
  }
];

/** @type {import('eslint').Rule.RuleModule} */
export default {
  create,
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer using `structuredClone` to create a deep clone.",
      recommended: true
    },
    hasSuggestions: true,
    schema,
    messages
  }
};
