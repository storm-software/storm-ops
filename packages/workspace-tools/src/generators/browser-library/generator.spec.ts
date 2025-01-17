import { Tree, readProjectConfiguration } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";

import { browserLibraryGenerator } from "./generator";
import { BrowserLibraryGeneratorSchema } from "./schema.d";

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
