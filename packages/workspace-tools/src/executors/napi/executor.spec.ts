import { ExecutorContext } from "@nx/devkit";

import executor from "./executor";
import { CargoBuildExecutorSchema } from "./schema.d";

const options: CargoBuildExecutorSchema = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false
};

describe("CargoBuild Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
