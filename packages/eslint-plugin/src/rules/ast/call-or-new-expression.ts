export type CallOrNewExpressionCheckOptions =
  | {
      name?: string;
      names?: string[];
      argumentsLength?: number;
      minimumArguments?: number;
      maximumArguments?: number;
      allowSpreadElement?: boolean;
      optionalCall?: boolean;
      optionalMember?: boolean;
      optional?: boolean;
    }
  | string
  | string[];

function create(
  node: any,
  options?: CallOrNewExpressionCheckOptions,
  types: string[] = []
) {
  if (!types.includes(node?.type)) {
    return false;
  }

  if (typeof options === "string") {
    options = { names: [options] };
  }

  if (Array.isArray(options)) {
    options = { names: options };
  }

  let {
    name,
    names,
    argumentsLength,
    minimumArguments,
    maximumArguments,
    allowSpreadElement,
    optional
  } = {
    minimumArguments: 0,
    maximumArguments: Number.POSITIVE_INFINITY,
    allowSpreadElement: false,
    ...options
  };

  if (name) {
    names = [name];
  }

  if (
    (optional === true && node.optional !== optional) ||
    (optional === false &&
      // `node.optional` can be `undefined` in some parsers
      node.optional)
  ) {
    return false;
  }

  if (
    typeof argumentsLength === "number" &&
    node.arguments.length !== argumentsLength
  ) {
    return false;
  }

  if (minimumArguments !== 0 && node.arguments.length < minimumArguments) {
    return false;
  }

  if (
    Number.isFinite(maximumArguments) &&
    node.arguments.length > maximumArguments
  ) {
    return false;
  }

  if (!allowSpreadElement) {
    const maximumArgumentsLength = Number.isFinite(maximumArguments)
      ? maximumArguments
      : argumentsLength;
    if (
      typeof maximumArgumentsLength === "number" &&
      node.arguments.some(
        (node, index) =>
          node.type === "SpreadElement" && index < maximumArgumentsLength
      )
    ) {
      return false;
    }
  }

  if (
    Array.isArray(names) &&
    names.length > 0 &&
    (node.callee.type !== "Identifier" || !names.includes(node.callee.name))
  ) {
    return false;
  }

  return true;
}

/**
@param {CallOrNewExpressionCheckOptions} [options]
@returns {boolean}
*/
export const isCallExpression = (
  node: any,
  options?: CallOrNewExpressionCheckOptions
) => create(node, options, ["CallExpression"]);

/**
@param {CallOrNewExpressionCheckOptions} [options]
@returns {boolean}
*/
export const isNewExpression = (
  node: any,
  options?: CallOrNewExpressionCheckOptions
) => {
  if (
    typeof options !== "string" &&
    !Array.isArray(options) &&
    typeof options?.optional === "boolean"
  ) {
    throw new TypeError("Cannot check node.optional in `isNewExpression`.");
  }

  return create(node, options, ["NewExpression"]);
};

/**
@param {CallOrNewExpressionCheckOptions} [options]
@returns {boolean}
*/
export const isCallOrNewExpression = (
  node: any,
  options?: CallOrNewExpressionCheckOptions
) => create(node, options, ["CallExpression", "NewExpression"]);

export default {
  isCallExpression,
  isNewExpression,
  isCallOrNewExpression
};
