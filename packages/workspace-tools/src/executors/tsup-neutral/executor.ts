import { ExecutorContext } from "@nx/devkit";
import { StormConfig } from "@storm-software/config-tools";
import esbuildPluginPino from "esbuild-plugin-pino";
import { withRunExecutor } from "../../base/base-executor";
import { getFileBanner } from "../../utils/get-file-banner";
import {
  applyDefaultOptions as tsupApplyDefault,
  tsupExecutorFn
} from "../tsup/executor";
import { TsupNeutralExecutorSchema } from "./schema";

export const tsNeutralBuildExecutorFn = (
  options: TsupNeutralExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) => {
  if (
    options.transports &&
    Array.isArray(options.transports) &&
    options.transports.length > 0
  ) {
    options.plugins.push(esbuildPluginPino({ transports: options.transports }));
  }

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
  options: TsupNeutralExecutorSchema
): TsupNeutralExecutorSchema => {
  return {
    ...tsupApplyDefault({
      plugins: [],
      ...options,
      platform: "neutral"
    }),
    transports: ["pino-pretty"]
  } as TsupNeutralExecutorSchema;
};

export default withRunExecutor<TsupNeutralExecutorSchema>(
  "TypeScript Build (Neutral Platform)",
  tsNeutralBuildExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions
    }
  }
);
