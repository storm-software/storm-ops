import { UnbuildExecutorSchema } from "./schema";
import executor from "./executor";

const options: UnbuildExecutorSchema = {};

describe("Unbuild Executor", () => {
  it("can run", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
