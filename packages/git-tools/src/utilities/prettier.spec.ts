import { Tree } from "@nx/devkit";
import { formatChangedFiles } from "./prettier";

describe("formatChangedFiles", () => {
  it("does not inspect changed files when formatting is skipped", async () => {
    const tree = {
      listChanges: () => {
        throw new Error("Changes should not be inspected");
      }
    } as unknown as Tree;

    await formatChangedFiles(tree, true);
  });
});
