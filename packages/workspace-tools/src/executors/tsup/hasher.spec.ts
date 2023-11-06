import { TaskHasher, HasherContext } from "@nx/devkit";

import { buildHasher } from "./hasher";

describe("buildHasher", () => {
  it("should generate hash", async () => {
    const mockHasher: TaskHasher = {
      hashTask: jest.fn().mockReturnValue({ value: "hashed-task" })
    } as unknown as TaskHasher;
    const hash = await buildHasher(
      {
        id: "my-task-id",
        target: {
          project: "proj",
          target: "target"
        },
        overrides: {},
        outputs: []
      },
      {
        hasher: mockHasher
      } as unknown as HasherContext
    );
    expect(hash).toEqual({ value: "hashed-task" });
  });
});
