import executor from "./executor";
import { RolldownExecutorSchema } from "./schema.d";

const options: RolldownExecutorSchema = {};

describe("Rolldown Executor", () => {
  it("can run", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
