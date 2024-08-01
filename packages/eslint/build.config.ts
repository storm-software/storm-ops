import fs from "node:fs/promises";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  failOnWarn: false,
  hooks: {
    async "build:before"() {
      const getStormConfig = await import("./src/preset").then(
        m => m.getStormConfig
      );
      const { flatConfigsToRulesDTS } = await import("eslint-typegen/core");
      const dts = await flatConfigsToRulesDTS(getStormConfig(), {
        includeAugmentation: false
      });
      await fs.writeFile("src/preset.d.ts", dts);
    }
  }
});
