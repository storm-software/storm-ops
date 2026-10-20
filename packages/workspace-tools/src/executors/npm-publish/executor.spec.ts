import {
  isPreviouslyStagedVersionError,
  waitForPublishedVersion
} from "./publish-status";

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

  describe("waitForPublishedVersion", () => {
    it("keeps checking when npm processing takes longer than five minutes", async () => {
      let attempts = 0;
      const wait = jest.fn().mockResolvedValue(undefined);

      await expect(
        waitForPublishedVersion({
          version: "0.0.73",
          tag: "latest",
          gitHead: "release-commit",
          getMetadata: () => {
            attempts++;
            if (attempts <= 60) {
              throw new Error("E404: npm is still processing the version");
            }
            return {
              version: "0.0.73",
              "dist-tags": { latest: "0.0.73" },
              gitHead: "release-commit"
            };
          },
          wait
        })
      ).resolves.toBe(true);
      expect(attempts).toBe(61);
    });

    it("waits until the expected version, tag, and git head are visible", async () => {
      const getMetadata = jest
        .fn()
        .mockRejectedValueOnce(new Error("not visible"))
        .mockReturnValueOnce({
          version: "0.0.73",
          "dist-tags": { latest: "0.0.73" },
          gitHead: "release-commit"
        });
      const wait = jest.fn().mockResolvedValue(undefined);

      await expect(
        waitForPublishedVersion({
          version: "0.0.73",
          tag: "latest",
          gitHead: "release-commit",
          attempts: 2,
          intervalMs: 1,
          getMetadata,
          wait
        })
      ).resolves.toBe(true);
      expect(getMetadata).toHaveBeenCalledTimes(2);
      expect(wait).toHaveBeenCalledWith(1);
    });

    it("does not accept a different artifact at the same version and tag", async () => {
      await expect(
        waitForPublishedVersion({
          version: "0.0.73",
          tag: "latest",
          gitHead: "release-commit",
          attempts: 1,
          intervalMs: 1,
          getMetadata: () => ({
            version: "0.0.73",
            "dist-tags": { latest: "0.0.73" },
            gitHead: "different-commit"
          }),
          wait: jest.fn()
        })
      ).resolves.toBe(false);
    });
  });
});
