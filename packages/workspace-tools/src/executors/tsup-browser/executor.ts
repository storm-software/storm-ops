import type { ExecutorContext } from "@nx/devkit";
import {
  applyDefaultOptions,
  browserConfig,
  getFileBanner
} from "@storm-software/build-tools";
import { StormConfig } from "@storm-software/config";
import { withRunExecutor } from "../../base/base-executor";
import { tsupExecutorFn } from "../tsup/executor";
import type { TsupBrowserExecutorSchema } from "./schema.d";

export const tsupBrowserBuildExecutorFn = (
  options: TsupBrowserExecutorSchema,
  context: ExecutorContext,
  config: StormConfig
) => {
  return tsupExecutorFn(
    {
      ...options,
      platform: "browser",
      banner: getFileBanner(
        context.projectName
          ? context.projectName
              .split(/(?=[A-Z])|[\.\-\s_]/)
              .map(s => s.trim())
              .filter(s => !!s)
              .map(s =>
                s ? s.toUpperCase()[0] + s.toLowerCase().slice(1) : ""
              )
              .join(" ")
          : "TypeScript (Browser Platforms)"
      ),
      define: {
        ...options.define
      },
      env: {
        ...process.env
      },
      getConfig: browserConfig
    },
    context,
    config
  );
};

export default withRunExecutor<TsupBrowserExecutorSchema>(
  "TypeScript Build (Browser Platforms)",
  tsupBrowserBuildExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (
        options: TsupBrowserExecutorSchema
      ): TsupBrowserExecutorSchema => {
        return {
          ...applyDefaultOptions({
            plugins: [],
            ...options,
            platform: "browser"
          }),
          getConfig: browserConfig
        };
      }
    }
  }
);
