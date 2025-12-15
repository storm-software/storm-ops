import { ExecutorContext } from "@nx/devkit";

import executor from "./executor";
import { CargoCheckExecutorSchema } from "./schema.d";

const options: CargoCheckExecutorSchema = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false
};

describe("CargoCheck Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
