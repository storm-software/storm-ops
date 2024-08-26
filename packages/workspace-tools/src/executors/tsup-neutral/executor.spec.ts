import executor from "./executor";
import { TsBuildExecutorSchema } from "./schema";

const options: TsBuildExecutorSchema = {};

describe("TsBuild Executor", () => {
  it("can run", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
