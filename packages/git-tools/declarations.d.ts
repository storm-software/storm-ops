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

declare module "doctoc/lib/transform" {
  export declare function transform(
    content: string,
    mode?: string,
    maxHeaderLevel?: number,
    title?: string,
    noTitle?: boolean,
    entryPrefix?: string,
    processAll?: boolean,
    updateOnly?: boolean
  ): any;
}

declare module "any-shell-escape" {
  export default function shellescape(args: string[]): string;
}
