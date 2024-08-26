import executor from "./executor";
import { TsupNodeExecutorSchema } from "./schema";

const options: TsupNodeExecutorSchema = {};

describe("TsupNode Executor", () => {
  it("can run", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
