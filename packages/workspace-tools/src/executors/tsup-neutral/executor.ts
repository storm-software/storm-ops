import type { ExecutorContext } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config-tools";
import { withRunExecutor } from "../../base/base-executor";
import { getFileBanner } from "../../utils/get-file-banner";
import { applyDefaultOptions as baseApplyDefaultOptions } from "../../utils/run-tsup-build";
import { tsupExecutorFn } from "../tsup/executor";
import { neutralConfig } from "./get-config";
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
        ...options.define
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
