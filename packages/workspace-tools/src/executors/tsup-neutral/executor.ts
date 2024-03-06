import type { ExecutorContext } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config";
import { withRunExecutor } from "../../base/base-executor";
import {
  getFileBanner,
  neutralConfig,
  applyDefaultOptions as baseApplyDefaultOptions
} from "@storm-software/build-tools";
import { tsupExecutorFn } from "../tsup/executor";
import type { TsupNeutralExecutorSchema } from "./schema";

export const tsupNeutralBuildExecutorFn = (
  options: TsupNeutralExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) => {
  return tsupExecutorFn(
    {
      ...options,
      platform: "neutral",
      banner: getFileBanner(
        context.projectName
          ? context.projectName
              .split(/(?=[A-Z])|[\.\-\s_]/)
              .map((s) => s.trim())
              .filter((s) => !!s)
              .map((s) => (s ? s.toUpperCase()[0] + s.toLowerCase().slice(1) : ""))
              .join(" ")
          : "TypeScript (Neutral Platform)"
      ),
      define: {
        ...options.define,
        process: `{ env: ${JSON.stringify(process.env)} }`
      },
      env: {
        ...process.env
      },
      getConfig: neutralConfig
    },
    context,
    config
  );
};

const applyDefaultOptions = (options: TsupNeutralExecutorSchema): TsupNeutralExecutorSchema => {
  return {
    ...baseApplyDefaultOptions({
      plugins: [],
      ...options,
      platform: "neutral",
      getConfig: neutralConfig
    })
  } as TsupNeutralExecutorSchema;
};

export default withRunExecutor<TsupNeutralExecutorSchema>(
  "TypeScript Build (Neutral Platform)",
  tsupNeutralBuildExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions
    }
  }
);
