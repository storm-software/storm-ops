import { ExecutorContext } from "@nx/devkit";

import executor from "./executor";
import { DestroyExecutorSchema } from "./schema";

const options: DestroyExecutorSchema = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false
};

describe("Destroy Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
