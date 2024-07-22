import { defineBuildConfig } from "unbuild";
import fs from "node:fs/promises";

export default defineBuildConfig({
  failOnWarn: false,
  hooks: {
    async "build:before"() {
      const stormPreset = await import("./src/preset").then(m => m.default);
      const { flatConfigsToRulesDTS } = await import("eslint-typegen/core");
      const dts = await flatConfigsToRulesDTS(stormPreset(), {
        includeAugmentation: false
      });
      await fs.writeFile("src/preset.d.ts", dts);
    }
  }
});
