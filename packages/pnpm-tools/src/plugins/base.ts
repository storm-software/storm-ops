import betterDefaultsPlugin from "@pnpm/plugin-better-defaults";
import esmNodePathPlugin from "@pnpm/plugin-esm-node-path";
import defu from "defu";

export default {
  hooks: {
    updateConfig(config) {
      const overrides = defu(
        {
          enableGlobalVirtualStore: true,
          enablePrePostScripts: false,
          ignorePatchFailures: false,
          optimisticRepeatInstall: true,
          resolutionMode: "lowest-direct",
          verifyDepsBeforeRun: "install"
        },
        betterDefaultsPlugin.hooks.updateConfig(config),
        esmNodePathPlugin.hooks.updateConfig(config)
      );
      Object.assign(config, overrides);
      if (config.hoistPattern?.length === 1 && config.hoistPattern[0] === "*") {
        config.hoistPattern = [];
      }

      return config;
    }
  }
};
