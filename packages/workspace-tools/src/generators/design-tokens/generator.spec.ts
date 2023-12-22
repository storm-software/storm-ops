import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { Tree, readProjectConfiguration } from "@nx/devkit";

import { designTokensGenerator } from "./generator";
import { DesignTokensGeneratorSchema } from "./schema";

describe("design-tokens generator", () => {
  let tree: Tree;
  const options: DesignTokensGeneratorSchema = { name: "test" };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it("should run successfully", async () => {
    await designTokensGenerator(tree, options);
    const config = readProjectConfiguration(tree, "test");
    expect(config).toBeDefined();
  });
});
