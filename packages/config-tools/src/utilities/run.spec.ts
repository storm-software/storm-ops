import { runAsync } from "./run";

describe("runAsync", () => {
  it("settles after the command exits", async () => {
    const started = Date.now();

    await runAsync({}, "node -e \"setTimeout(() => {}, 300)\"");

    expect(Date.now() - started).toBeGreaterThanOrEqual(250);
  });

  it("rejects when the command exits non-zero", async () => {
    await expect(runAsync({}, "node -e \"process.exit(2)\"")).rejects.toThrow(
      /exit code 2/
    );
  });
});
