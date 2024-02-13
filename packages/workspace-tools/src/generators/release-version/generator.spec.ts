import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { Tree, readProjectConfiguration } from "@nx/devkit";

import { releaseVersionGenerator } from "./generator";
import { ReleaseVersionGeneratorSchema } from "./schema";

describe("release-version generator", () => {
  let tree: Tree;
  const options: ReleaseVersionGeneratorSchema = { name: "test" };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it("should run successfully", async () => {
    await releaseVersionGenerator(tree, options);
    const config = readProjectConfiguration(tree, "test");
    expect(config).toBeDefined();
  });
});
