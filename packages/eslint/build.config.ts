import fs from "node:fs/promises";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  failOnWarn: false,
  clean: false,
  declaration: "compatible",
  rollup: {
    output: {
      banner: `import { dirname as banner_dirname } from 'node:path';
import { fileURLToPath as banner_fileURLToPath } from 'node:url';

const __filename = banner_fileURLToPath(import.meta.url);
const __dirname = banner_dirname(__filename);
`
    }
  },
  hooks: {
    async "build:before"() {
      console.info("Generating rules.d.ts");

      const getStormConfig = await import("./src/preset").then(
        m => m.getStormConfig
      );

      console.info("Cleaning previous rules.d.ts file");
      await fs.rm("src/rules.d.ts");

      const { flatConfigsToRulesDTS } = await import("eslint-typegen/core");
      const dts = await flatConfigsToRulesDTS(getStormConfig(), {
        includeAugmentation: false
      });

      console.info("Writing rules.d.ts");
      await fs.writeFile("src/rules.d.ts", dts);
    }
  }
});
