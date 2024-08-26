import executor from "./executor";
import { UnbuildExecutorSchema } from "./schema";

const options: UnbuildExecutorSchema = {};

describe("Unbuild Executor", () => {
  it("can run", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
