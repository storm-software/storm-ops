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
  }
  // hooks: {
  //   async "build:before"() {
  //     const getStormConfig = await import("./src/preset").then(
  //       m => m.getStormConfig
  //     );
  //     const { flatConfigsToRulesDTS } = await import("eslint-typegen/core");
  //     const dts = await flatConfigsToRulesDTS(getStormConfig(), {
  //       includeAugmentation: false
  //     });
  //     await fs.writeFile("src/rules.d.ts", dts);
  //   }
  // }
});
