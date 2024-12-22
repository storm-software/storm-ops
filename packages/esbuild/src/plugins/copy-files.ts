/*-------------------------------------------------------------------

                  ⚡ Storm Software - Storm Stack

 This code was released as part of the Storm Stack project. Storm Stack
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/storm-ops
 Documentation:   https://stormsoftware.com/projects/storm-ops/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/storm-ops/license

 -------------------------------------------------------------------*/

import { hfs } from "@humanfs/node";
import type { Plugin } from "esbuild";

/**
 * Copies the specified files after the build is done.
 */
const copyFilesPlugin = (actions: { from: string; to: string }[]): Plugin => ({
  name: "storm:copy-files",
  setup(build) {
    build.onEnd(async () => {
      await Promise.all(
        actions.map(action => hfs.copy(action.from, action.to))
      );
    });
  }
});

export { copyFilesPlugin };
