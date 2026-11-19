import { ExecutorContext } from "@nx/devkit";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildCargoCommand } from "../../utils/cargo";

describe("Cargo package selection", () => {
  it("selects the manifest package name from a project directory", () => {
    const root = mkdtempSync(join(tmpdir(), "storm-cargo-command-"));
    try {
      mkdirSync(join(root, "crates/example"), { recursive: true });
      writeFileSync(
        join(root, "crates/example/Cargo.toml"),
        '[package]\nname = "actual-crate"\nversion = "1.0.0"\n'
      );
      const context = {
        root,
        projectName: "nx-project",
        projectsConfigurations: {
          projects: { "nx-project": { root: "crates/example" } }
        }
      } as unknown as ExecutorContext;
      expect(
        buildCargoCommand("build", { profile: "release" }, context)
      ).toEqual(["build", "--profile", "release", "-p", "actual-crate"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
