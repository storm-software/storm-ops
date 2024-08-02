import fs from "node:fs/promises";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  failOnWarn: false,
  clean: false,
  declaration: "compatible",
  rollup: {
    output: {
      banner: `import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
`
    }
  },
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
