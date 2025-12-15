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

import { TypeScriptBuildOptions } from "@storm-software/build-tools";
import { PluginOptions } from "vite-plugin-dts";

export type MaybePromise<T> = T | Promise<T>;

export type ViteOptions = Partial<
  Pick<
    TypeScriptBuildOptions,
    | "name"
    | "outputPath"
    | "assets"
    | "format"
    | "sourceRoot"
    | "debug"
    | "tsconfig"
  >
> &
  Pick<PluginOptions, "beforeWriteFile"> & {
    /**
     * Entry file, e.g. `./src/index.ts`
     */
    entry: string | Array<string>;

    /**
     * Excluded from type generation, e.g. `[./src/tests]`
     */
    exclude?: Array<string>;

    /**
     * Additional dependencies to externalize if not detected by `vite-plugin-externalize-deps`
     */
    external?: string | RegExp | Array<string | RegExp>;

    /**
     * Dependencies to bundle. Will be passed to the except argument of `vite-plugin-externalize-deps`
     */
    bundled?: Array<string | RegExp>;

    /**
     * Hook called prior to writing each declaration file; allows to transform the content
     *
     * @param filePath - The path to the declaration file
     * @param content - The content of the declaration file
     * @returns The transformed content, or `false` to skip writing the file
     */
    beforeWriteDeclarationFile?: (filePath: string, content: string) => string;
  };
