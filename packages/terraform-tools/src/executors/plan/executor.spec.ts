import { ExecutorContext } from "@nx/devkit";

import executor from "./executor";
import { PlanExecutorSchema } from "./schema";

const options: PlanExecutorSchema = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false
};

describe("Plan Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
