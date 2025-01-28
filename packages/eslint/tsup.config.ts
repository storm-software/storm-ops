import * as esbuild from "esbuild";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import { defineConfig } from "tsup";

const plugin: esbuild.Plugin = {
  name: "storm:rules-dts",
  setup(build) {
    build.onStart(async () => {
      console.info("Generating rules.d.ts type definitions");
      const getStormConfig = await import("./src/preset").then(
        m => m.getStormConfig
      );

      const { flatConfigsToRulesDTS } = await import("eslint-typegen/core");
      const dts = await flatConfigsToRulesDTS(getStormConfig(), {
        includeAugmentation: false
      });
      if (!dts) {
        console.warn("No rules.d.ts generated");
        return;
      }

      if (existsSync("src/rules.d.ts")) {
        console.info("Cleaning previous rules.d.ts file");
        await fs.rm("src/rules.d.ts");
      }

      console.info("Writing rules.d.ts");
      await fs.writeFile("src/rules.d.ts", dts);
    });
  }
};

export default defineConfig([
  {
    name: "eslint",
    target: "node22",
    entryPoints: ["src/preset.ts", "src/rules/*.ts", "src/utils/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    platform: "node",
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    external: ["eslint", "typescript", "nx", "@nx/*"],
    plugins: [plugin]
  }
]);
