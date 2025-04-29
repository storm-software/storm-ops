import {
  writeError,
  writeTrace
} from "@storm-software/config-tools/logger/console";
import { watch as createWatcher } from "chokidar";
import { debounce } from "es-toolkit";
import { BuildContext } from "esbuild";
import { type ESBuildOptions } from "./types";
import { handle } from "./utilities/helpers";

/**
 * Executes the build and rebuilds what is necessary
 *
 * @param context - the build context
 * @param options - the build options
 * @returns the build result
 */
export const watch = (context: BuildContext, options: ESBuildOptions) => {
  if (!options.watch) {
    return context;
  }

  // common chokidar options for the watchers
  const config = {
    ignoreInitial: true,
    useFsEvents: true,
    ignored: ["./src/__tests__/**/*", "./package.json"]
  };

  // prepare the incremental builds watcher
  const changeWatcher = createWatcher(["./src/**/*"], config);

  // triggers quick rebuild on file change
  const fastRebuild = debounce(async () => {
    const timeBefore = Date.now();

    // we handle possible rebuild exceptions
    const rebuildResult = await handle.async(() => {
      return context.rebuild();
    });

    if (rebuildResult instanceof Error) {
      writeError(rebuildResult.message);
    }

    writeTrace(`${Date.now() - timeBefore}ms [${options.name ?? ""}]`);
  }, 10);

  changeWatcher.on("change", fastRebuild);

  return undefined;
};
