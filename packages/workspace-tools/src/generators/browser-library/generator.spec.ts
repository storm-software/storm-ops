import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { Tree, readProjectConfiguration } from "@nx/devkit";

import { browserLibraryGenerator } from "./generator";
import { BrowserLibraryGeneratorSchema } from "./schema";

describe("browser-library generator", () => {
  let tree: Tree;
  const options: BrowserLibraryGeneratorSchema = { name: "test" };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it("should run successfully", async () => {
    await browserLibraryGenerator(tree, options);
    const config = readProjectConfiguration(tree, "test");
    expect(config).toBeDefined();
  });
});
