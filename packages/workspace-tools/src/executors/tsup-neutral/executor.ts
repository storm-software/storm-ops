import { ExecutorContext } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { getFileBanner } from "../../utils/get-file-banner";
import {
  applyDefault as tsupApplyDefault,
  tsupExecutorFn
} from "../tsup/executor";
import { TsupNeutralExecutorSchema } from "./schema";

export const tsNeutralBuildExecutorFn = (
  options: TsupNeutralExecutorSchema,
  context: ExecutorContext,
  config?: any
) => {
  options.plugins ??= [];

  return tsupExecutorFn(
    {
      ...options,
      platform: "neutral",
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
          : "TypeScript (Neutral Platform)"
      ),
      define: {
        ...options.define,
        __STORM_CONFIG: config
      },
      env: {
        __STORM_CONFIG: config,
        ...process.env
      }
    },
    context
  );
};

const applyDefault = (
  options: TsupNeutralExecutorSchema
): TsupNeutralExecutorSchema => {
  options = tsupApplyDefault({ ...options, platform: "neutral" });
  options.plugins ??= [];

  return options;
};

export default withRunExecutor<TsupNeutralExecutorSchema>(
  "TypeScript Build (Neutral Platform)",
  tsNeutralBuildExecutorFn,
  {
    skipReadingConfig: false,
    applyDefaultFn: applyDefault
  }
);
