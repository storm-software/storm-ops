import { RolldownExecutorSchema } from "./schema";
import executor from "./executor";

const options: RolldownExecutorSchema = {};

describe("Rolldown Executor", () => {
  it("can run", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
