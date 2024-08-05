import type { ExecutorContext } from "@nx/devkit";
import {
  applyDefaultOptions,
  getFileBanner,
  nodeConfig
} from "@storm-software/build-tools";
import { StormConfig } from "@storm-software/config";
import { withRunExecutor } from "../../base/base-executor";
import { tsupExecutorFn } from "../tsup/executor";
import type { TsupNodeExecutorSchema } from "./schema";

export const tsupNodeBuildExecutorFn = (
  options: TsupNodeExecutorSchema,
  context: ExecutorContext,
  config: StormConfig
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
      },
      getConfig: nodeConfig
    },
    context,
    config
  );
};

export default withRunExecutor<TsupNodeExecutorSchema>(
  "TypeScript Build (NodeJs Platform)",
  tsupNodeBuildExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (
        options: TsupNodeExecutorSchema
      ): TsupNodeExecutorSchema => {
        return {
          ...applyDefaultOptions({
            plugins: [],
            ...options,
            platform: "node"
          }),
          getConfig: nodeConfig,
          transports: ["pino-pretty", "pino-loki"]
        };
      }
    }
  }
);
