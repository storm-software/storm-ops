import { isPreviouslyStagedVersionError } from "./publish-status";

describe("NpmPublish Executor", () => {
  describe("isPreviouslyStagedVersionError", () => {
    it("matches the npm deferred-processing conflict for the expected version", () => {
      const error = {
        stdout: Buffer.from(
          JSON.stringify({
            error: {
              code: "E409",
              summary:
                '409 Conflict - Cannot publish over previously staged version "0.0.73".'
            }
          })
        ),
        stderr: Buffer.from("")
      };

      expect(isPreviouslyStagedVersionError(error, "0.0.73")).toBe(true);
      expect(isPreviouslyStagedVersionError(error, "0.0.74")).toBe(false);
      expect(
        isPreviouslyStagedVersionError(
          {
            stderr:
              'npm error code E409\nnpm error Cannot publish over previously staged version "0.0.73".'
          },
          "0.0.73"
        )
      ).toBe(true);
    });
  });
});
