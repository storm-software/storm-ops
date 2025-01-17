// import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
// import { type Tree, readProjectConfiguration } from "@nx/devkit";

// import { releaseVersionGenerator } from "./generator";
// import type { ReleaseVersionGeneratorSchema } from "./schema.d";

// describe("release-version generator", () => {
//   let tree: Tree;
//   const options: ReleaseVersionGeneratorSchema = { name: "test" };

//   beforeEach(() => {
//     tree = createTreeWithEmptyWorkspace();
//   });

//   it("should run successfully", async () => {
//     await releaseVersionGenerator(tree, options);
//     const config = readProjectConfiguration(tree, "test");
//     expect(config).toBeDefined();
//   });
// });
