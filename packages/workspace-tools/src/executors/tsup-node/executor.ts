import { ExecutorContext } from "@nx/devkit";
import esbuildPluginPino from "esbuild-plugin-pino";
import { withRunExecutor } from "../../base/base-executor";
import { getFileBanner } from "../../utils/get-file-banner";
import {
  applyDefaultOptions as tsupApplyDefault,
  tsupExecutorFn
} from "../tsup/executor";
import { TsupNodeExecutorSchema } from "./schema";

export const tsNodeBuildExecutorFn = (
  options: TsupNodeExecutorSchema,
  context: ExecutorContext,
  config?: any
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
      platform: "node",
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
          : "TypeScript (NodeJs Platform)"
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
  options: TsupNodeExecutorSchema
): TsupNodeExecutorSchema => {
  options = tsupApplyDefault({ ...options, platform: "node" });

  options.plugins ??= [];
  options.transports ??= ["pino-pretty", "pino-loki"];

  return options;
};

export default withRunExecutor<TsupNodeExecutorSchema>(
  "TypeScript Build (NodeJs Platform)",
  tsNodeBuildExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions
    }
  }
);
