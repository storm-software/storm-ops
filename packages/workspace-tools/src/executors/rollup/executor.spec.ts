import { ExecutorContext } from "@nx/devkit";

import executor from "./executor";
import { RollupExecutorSchema } from "./schema";

const options: RollupExecutorSchema = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false
};

describe("Rollup Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
