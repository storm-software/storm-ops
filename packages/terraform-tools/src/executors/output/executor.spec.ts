import { ExecutorContext } from "@nx/devkit";

import executor from "./executor";
import { FmtExecutorSchema } from "./schema";

const options: FmtExecutorSchema = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false,
};

describe("Fmt Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
