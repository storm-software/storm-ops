import { ExecutorContext } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { getFileBanner } from "../../utils/get-file-banner";
import {
  applyDefaultOptions as tsupApplyDefault,
  tsupExecutorFn
} from "../tsup/executor";
import { legacyBrowserConfig, modernBrowserConfig } from "./get-config";
import { TsupBrowserExecutorSchema } from "./schema";

export const tsupBrowserBuildExecutorFn = (
  options: TsupBrowserExecutorSchema,
  context: ExecutorContext,
  config?: any
) => {
  if (
    options.transports &&
    Array.isArray(options.transports) &&
    options.transports.length > 0
  ) {
    //options.plugins.push(esbuildPluginPino({ transports: options.transports }));
  }

  return tsupExecutorFn(
    {
      ...options,
      getConfig: {
        "dist/modern": modernBrowserConfig,
        "dist/legacy": legacyBrowserConfig
      },
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
      }
    },
    context
  );
};

const applyDefaultOptions = (
  options: TsupBrowserExecutorSchema
): TsupBrowserExecutorSchema => {
  return {
    ...tsupApplyDefault({ plugins: [], ...options, platform: "browser" }),
    transports: ["pino-pretty"]
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
