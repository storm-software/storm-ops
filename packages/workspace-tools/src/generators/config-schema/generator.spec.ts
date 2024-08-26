import { Tree, readProjectConfiguration } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";

import { configSchemaGenerator } from "./generator";
import { ConfigSchemaGeneratorSchema } from "./schema";

describe("config-schema generator", () => {
  let tree: Tree;
  const options: ConfigSchemaGeneratorSchema = { name: "test" };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it("should run successfully", async () => {
    await configSchemaGenerator(tree, options);
    const config = readProjectConfiguration(tree, "test");
    expect(config).toBeDefined();
  });
});
