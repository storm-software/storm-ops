import { declarePackage } from "@storm-software/testing-tools/jest/declare-package";

export default declarePackage({
  projectRoot: "packages/pnpm-plugin",
  isNode: true,
  displayName: "pnpm-plugin"
});
