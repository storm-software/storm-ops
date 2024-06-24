import { createConfigs } from "./configs";
import type {
  StormESLintPlugin,
  StormESLintPluginConfigKeys,
  StormESLintPluginConfigs,
  StormESLintPluginMeta
} from "./types";
import { createMeta } from "./utils/create-meta";
import { createRules } from "./utils/create-rules";

const plugin = {
  meta: createMeta() as StormESLintPluginMeta,
  configs: {} as StormESLintPluginConfigs<typeof StormESLintPluginConfigKeys>,
  rules: {
    ...createRules()
  },
  processors: {}
} satisfies StormESLintPlugin<
  StormESLintPluginConfigs<typeof StormESLintPluginConfigKeys>
>;

plugin.configs = createConfigs(plugin);

export default plugin;
