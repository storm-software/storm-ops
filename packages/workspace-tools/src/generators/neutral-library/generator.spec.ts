import { Tree, readProjectConfiguration } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";

import { neutralLibraryGenerator } from "./generator";
import { NeutralLibraryGeneratorSchema } from "./schema";

describe("neutral-library generator", () => {
  let tree: Tree;
  const options: NeutralLibraryGeneratorSchema = { name: "test" };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it("should run successfully", async () => {
    await neutralLibraryGenerator(tree, options);
    const config = readProjectConfiguration(tree, "test");
    expect(config).toBeDefined();
  });
});
