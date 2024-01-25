import type { ExecutorContext } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { getFileBanner } from "../../utils/get-file-banner";
import { applyDefaultOptions as baseApplyDefaultOptions } from "../../utils/run-tsup-build";
import { tsupExecutorFn } from "../tsup/executor";
import { browserConfig } from "./get-config";
import type { TsupBrowserExecutorSchema } from "./schema";

export const tsupBrowserBuildExecutorFn = (
  options: TsupBrowserExecutorSchema,
  context: ExecutorContext,
  config?: any
) => {
  return tsupExecutorFn(
    {
      ...options,
      platform: "browser",
      banner: getFileBanner(
        context.projectName
          ? context.projectName
              .split(/(?=[A-Z])|[\.\-\s_]/)
              .map((s) => s.trim())
              .filter((s) => !!s)
              .map((s) => (s ? s.toUpperCase()[0] + s.toLowerCase().slice(1) : ""))
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

const applyDefaultOptions = (options: TsupBrowserExecutorSchema): TsupBrowserExecutorSchema => {
  return {
    ...baseApplyDefaultOptions({ plugins: [], ...options, platform: "browser" })
  };
};

export default withRunExecutor<TsupBrowserExecutorSchema>(
  "TypeScript Build (Browser Platforms)",
  tsupBrowserBuildExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions
    }
  }
);
