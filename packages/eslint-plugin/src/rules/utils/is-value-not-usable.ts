import { isExpressionStatement } from "../ast/index";

export const isValueNotUsable = node => isExpressionStatement(node.parent);
export default isValueNotUsable;
