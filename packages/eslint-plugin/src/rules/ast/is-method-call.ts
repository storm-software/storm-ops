import callOrNewExpression from "./call-or-new-expression";
import isMemberExpression from "./is-member-expression";

export function isMethodCall(
  node: any,
  options:
    | {
        // `isCallExpression` options
        argumentsLength?: number;
        minimumArguments?: number;
        maximumArguments?: number;
        optionalCall?: boolean;
        allowSpreadElement?: boolean;

        // `isMemberExpression` options
        method?: string;
        methods?: string[];
        object?: string;
        objects?: string[];
        optionalMember?: boolean;
        computed?: boolean;
      }
    | string
    | string[]
) {
  if (typeof options === "string") {
    options = { methods: [options] };
  }

  if (Array.isArray(options)) {
    options = { methods: options };
  }

  const { optionalCall, optionalMember, method, methods } = {
    method: "",
    methods: [],
    ...options
  };

  return (
    callOrNewExpression.isCallExpression(node, {
      argumentsLength: options.argumentsLength,
      minimumArguments: options.minimumArguments,
      maximumArguments: options.maximumArguments,
      allowSpreadElement: options.allowSpreadElement,
      optional: optionalCall
    }) &&
    isMemberExpression(node.callee, {
      object: options.object,
      objects: options.objects,
      computed: options.computed,
      property: method,
      properties: methods,
      optional: optionalMember
    })
  );
}

export default isMethodCall;
