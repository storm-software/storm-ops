import { describe, expect, it } from "@jest/globals";
import {
  extractPackageVersion,
  filterBenignPackageManagerStderr
} from "./get-version";

describe("filterBenignPackageManagerStderr", () => {
  it("removes bun env file timing output", () => {
    expect(
      filterBenignPackageManagerStderr('[0.04ms] ".env.local", ".env"\n')
    ).toBe("");
  });

  it("removes bun system call diagnostics", () => {
    expect(
      filterBenignPackageManagerStderr(
        "[SYS] read(3, 4096) = 4096 (0.019ms)\n[SYS] close(3)\n"
      )
    ).toBe("");
  });

  it("keeps real error output", () => {
    expect(
      filterBenignPackageManagerStderr(
        '[0.04ms] ".env.local", ".env"\n404 Not Found - GET https://registry.npmjs.org/missing'
      )
    ).toBe("404 Not Found - GET https://registry.npmjs.org/missing");
  });
});

describe("extractPackageVersion", () => {
  it("returns the last valid semver line", () => {
    expect(
      extractPackageVersion(
        '[0.04ms] ".env.local", ".env"\n1.2.3\n'
      )
    ).toBe("1.2.3");
  });
});
