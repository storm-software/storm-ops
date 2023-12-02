import { TsBuildExecutorSchema } from "./schema";
import executor from "./executor";

const options: TsBuildExecutorSchema = {};

describe("TsBuild Executor", () => {
  it("can run", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
