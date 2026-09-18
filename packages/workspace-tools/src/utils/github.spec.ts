import { createJiti } from "jiti";

import { getGitHubTools } from "./github";

jest.mock("jiti", () => ({ createJiti: jest.fn() }));

describe("getGitHubTools", () => {
  it("resolves @actions/core with ESM conditions before importing it", async () => {
    const core = {
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
      getIDToken: jest.fn()
    };
    const esmResolve = jest.fn(() => "/virtual/@actions/core/lib/core.js");
    const importModule = jest.fn(async () => core);
    jest.mocked(createJiti).mockReturnValue({
      esmResolve,
      import: importModule
    } as never);

    const tools = await getGitHubTools({
      workspaceRoot: process.cwd(),
      skipCache: true,
      directories: {}
    } as never);

    expect(esmResolve).toHaveBeenCalledWith("@actions/core");
    expect(importModule).toHaveBeenCalledWith(
      "/virtual/@actions/core/lib/core.js"
    );
    expect(tools.getIDToken).toBe(core.getIDToken);
  });
});
