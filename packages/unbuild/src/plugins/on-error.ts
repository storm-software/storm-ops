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

import { writeError } from "@storm-software/config-tools/logger/console";
import type { Plugin } from "rollup";
import { UnbuildResolvedOptions } from "../types";

/**
 * Causes rollup to exit immediately with an error code.
 */
export const onErrorPlugin = (options: UnbuildResolvedOptions): Plugin => ({
  name: "storm:on-error",
  buildEnd(error?: Error | undefined) {
    if (error) {
      writeError(
        `The following errors occurred during the build:
${error ? error.message : "Unknown build error"}

    `,
        options.config,
      );

      throw new Error("Storm unbuild process failed with errors.");
    }
  },
  renderError(error?: Error | undefined) {
    writeError(
      `The following errors occurred during the build:
${error ? error.message : "Unknown build error"}

  `,
      options.config,
    );

    throw new Error("Storm unbuild process failed with errors.");
  },
});
