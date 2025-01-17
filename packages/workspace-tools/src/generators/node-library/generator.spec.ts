import { Tree, readProjectConfiguration } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";

import { nodeLibraryGenerator } from "./generator";
import { NodeLibraryGeneratorSchema } from "./schema.d";

describe("node-library generator", () => {
  let tree: Tree;
  const options: NodeLibraryGeneratorSchema = { name: "test" };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it("should run successfully", async () => {
    await nodeLibraryGenerator(tree, options);
    const config = readProjectConfiguration(tree, "test");
    expect(config).toBeDefined();
  });
});
