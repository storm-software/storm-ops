import { TsupBrowserExecutorSchema } from "./schema";
import executor from "./executor";

const options: TsupBrowserExecutorSchema = {};

describe("TsupBrowser Executor", () => {
  it("can run", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
