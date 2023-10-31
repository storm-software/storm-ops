/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "semantic-release-plugin-decorators" {
  type PluginFn<Config = unknown> = (
    config: Config,
    context: any
  ) => any | Promise<any>;

  export declare function wrapStep<Config>(
    stepName: string,
    wrapFn: (
      pluginFn: PluginFn<Config>
    ) => PluginFn<Config> | Promise<PluginFn<Config>>,
    config?: { defaultReturn?: any; wrapperName?: any }
  );
}
