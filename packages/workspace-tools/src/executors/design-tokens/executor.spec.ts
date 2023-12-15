import executor from "./executor";
import { DesignTokensExecutorSchema } from "./schema";

const options: DesignTokensExecutorSchema = {};

describe("DesignTokens Executor", () => {
  it("can run", async () => {
    const output = await executor(options, {} as any);
    expect(output.success).toBe(true);
  });
});
