import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";
import fs from "node:fs/promises";
import {
  astro,
  formatters,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  node,
  perfectionist,
  react,
  regexp,
  sortPackageJson,
  stylistic,
  test,
  toml,
  typescript,
  unicorn,
  unocss,
  yaml
} from "../src/configs";
import { combine } from "../src/utils/combine";

const configs = await combine(
  {
    plugins: {
      "": {
        rules: Object.fromEntries(builtinRules.entries())
      }
    }
  },
  astro(),
  formatters(),
  imports(),
  javascript(),
  jsx(),
  jsdoc(),
  jsonc(),
  markdown(),
  node(),
  perfectionist(),
  react(),
  sortPackageJson(),
  stylistic(),
  test(),
  toml(),
  regexp(),
  typescript(),
  unicorn(),
  unocss(),
  yaml()
);

const configNames = configs.map(i => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(" | ")}
`;

await fs.writeFile("src/typegen.d.ts", dts);
