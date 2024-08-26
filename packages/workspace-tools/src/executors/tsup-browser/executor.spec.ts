import executor from "./executor";
import { TsupBrowserExecutorSchema } from "./schema";

const options: TsupBrowserExecutorSchema = {};

describe("TsupBrowser Executor", () => {
  it("can run", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
