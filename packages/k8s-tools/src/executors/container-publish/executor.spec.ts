import { ExecutorContext } from "@nx/devkit";

import executor from "./executor";
import { ContainerPublishExecutorSchema } from "./schema";

const options: ContainerPublishExecutorSchema = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false
};

describe("ContainerPublish Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
