import { ExecutorContext } from "@nx/devkit";

import executor from "./executor";
import { SizeLimitExecutorSchema } from "./schema.d";

const options: SizeLimitExecutorSchema = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false,
};

describe("SizeLimit Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
