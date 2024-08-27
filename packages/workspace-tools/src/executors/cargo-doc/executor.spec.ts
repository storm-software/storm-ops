import { ExecutorContext } from "@nx/devkit";

import executor from "./executor";
import { CargoDocExecutorSchema } from "./schema";

const options: CargoDocExecutorSchema = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false
};

describe("CargoDoc Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
