import { WorkerPublishExecutorSchema } from "./schema";
import executor from "./executor";

const options: WorkerPublishExecutorSchema = {};

describe("WorkerPublish Executor", () => {
  it("can run", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
