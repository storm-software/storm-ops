import { declarePackage } from "../testing-tools/src/jest/declare-package";

export default declarePackage({
  projectRoot: "packages/npm-tools",
  isNode: true,
  displayName: "npm-tools"
});
