import { ExecutorContext } from "@nx/devkit";

import executor from "./executor";
import { CleanPublishExecutorSchema } from "./schema";

const options: CleanPublishExecutorSchema = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false
};

describe("CleanPublish Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
