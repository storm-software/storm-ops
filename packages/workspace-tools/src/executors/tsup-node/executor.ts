import { ExecutorContext } from "@nx/devkit";
import esbuildPluginPino from "esbuild-plugin-pino";
import { withRunExecutor } from "../../base/base-executor";
import { getFileBanner } from "../../utils/get-file-banner";
import tsupExecutor from "../tsup/executor";
import { TsupNodeExecutorSchema } from "./schema";

export const tsNodeBuildExecutorFn = (
  options: TsupNodeExecutorSchema,
  context: ExecutorContext,
  config?: any
) => {
  options.plugins ??= [];
  options.transports ??= ["pino-pretty", "pino-loki"];

  if (
    options.transports &&
    Array.isArray(options.transports) &&
    options.transports.length > 0
  ) {
    options.plugins.push(esbuildPluginPino({ transports: options.transports }));
  }

  return tsupExecutor(
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

export default withRunExecutor<TsupNodeExecutorSchema>(
  "TypeScript Build (NodeJs Platform)",
  tsNodeBuildExecutorFn
);
