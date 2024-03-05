import type { ExecutorContext } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { tsupExecutorFn } from "../tsup/executor";
import {
  getFileBanner,
  nodeConfig,
  applyDefaultOptions as baseApplyDefaultOptions,
} from "@storm-software/build-tools";
import type { TsupNodeExecutorSchema } from "./schema";

export const tsupNodeBuildExecutorFn = (
  options: TsupNodeExecutorSchema,
  context: ExecutorContext,
  config?: any,
) => {
  /*if (options.transports && Array.isArray(options.transports) && options.transports.length > 0) {
    // options.plugins.push(esbuildPluginPino({ transports: options.transports }));
  }*/

  return tsupExecutorFn(
    {
      ...options,
      platform: "node",
      banner: getFileBanner(
        context.projectName
          ? context.projectName
              .split(/(?=[A-Z])|[\.\-\s_]/)
              .map((s) => s.trim())
              .filter((s) => !!s)
              .map((s) =>
                s ? s.toUpperCase()[0] + s.toLowerCase().slice(1) : "",
              )
              .join(" ")
          : "TypeScript (NodeJs Platform)",
      ),
      define: {
        ...options.define,
      },
      env: {
        ...process.env,
      },
      getConfig: nodeConfig,
    },
    context,
    config,
  );
};

const applyDefaultOptions = (
  options: TsupNodeExecutorSchema,
): TsupNodeExecutorSchema => {
  return {
    ...baseApplyDefaultOptions({
      plugins: [],
      ...options,
      platform: "node",
    }),
    transports: ["pino-pretty", "pino-loki"],
    getConfig: nodeConfig,
  };
};

export default withRunExecutor<TsupNodeExecutorSchema>(
  "TypeScript Build (NodeJs Platform)",
  tsupNodeBuildExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions,
    },
  },
);
