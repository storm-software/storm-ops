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

import { writeError } from "@storm-software/config-tools";
import type * as esbuild from "esbuild";
import { ESBuildOptions, ESBuildResolvedOptions } from "../types";

/**
 * Causes esbuild to exit immediately with an error code.
 */
export const onErrorPlugin = (
  options: ESBuildOptions,
  resolvedOptions: ESBuildResolvedOptions
): esbuild.Plugin => ({
  name: "storm:on-error",
  setup(build) {
    build.onEnd(result => {
      // if there were errors found on the build
      if (result.errors.length > 0 && process.env.WATCH !== "true") {
        writeError(
          `The following errors occurred during the build:
${result.errors.map(error => error.text).join("\n")}

`,
          resolvedOptions.config
        );

        throw new Error("Storm esbuild process failed with errors.");
      }
    });
  }
});
