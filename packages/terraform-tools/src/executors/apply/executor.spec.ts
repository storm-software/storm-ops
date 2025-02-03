import { ExecutorContext } from "@nx/devkit";

import executor from "./executor";
import { ApplyExecutorSchema } from "./schema";

const options: ApplyExecutorSchema = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false,
};

describe("Apply Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
