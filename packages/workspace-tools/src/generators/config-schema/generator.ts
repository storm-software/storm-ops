import { formatFiles, type Tree, writeJson } from "@nx/devkit";
import { type StormConfig, StormConfigSchema } from "@storm-software/config";
import { join } from "node:path";
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { withRunGenerator } from "../../base/base-generator";
// import { getProjectConfigurations } from "../../utils/get-project-configurations";
import type { ConfigSchemaGeneratorSchema } from "./schema";

export type ModuleSchema = {
  name: string;
  schema: z.ZodObject<any>;
};

export async function configSchemaGeneratorFn(
  tree: Tree,
  options: ConfigSchemaGeneratorSchema,
  config?: StormConfig
) {
  const { findWorkspaceRoot } = await import("@storm-software/config-tools");

  // const projectConfigurations = getProjectConfigurations<
  //   ProjectConfiguration & { config: any }
  // >();
  const workspaceRoot = config?.workspaceRoot ?? findWorkspaceRoot();

  // const modules = await Promise.all(
  //   Object.keys(projectConfigurations).map(async (key) => {
  //     if (projectConfigurations[key]?.config) {
  //       const configPath = join(workspaceRoot, projectConfigurations[key].config);
  //       if (existsSync(configPath)) {
  //         const mod = await import(configPath);
  //         if (mod.default) {
  //           return { name: key, schema: mod.default } as ModuleSchema;
  //         }
  //       }
  //     }

  //     return null;
  //   })
  // );

  // const workspaceSchema = z.object({
  //   modules: z
  //     .object(
  //       modules
  //         .filter((module) => !!module)
  //         .reduce((ret: Record<string, z.ZodObject<any>>, module: ModuleSchema | null) => {
  //           if (module?.schema && !ret[module.name]) {
  //             ret[module.name] = module.schema;
  //           }

  //           return ret;
  //         }, {})
  //     )
  //     .describe("Configuration of each used extension")
  // });

  // const ModulesSchema = z
  //   .union([workspaceSchema, StormConfigSchema])
  //   .describe(
  //     "The values set in the Storm config file. This file is expected to be named `storm.json`, `storm.config.ts`, or `storm.config.js` and be located in the root of the workspace"
  //   );

  writeJson(
    tree,
    options.outputFile
      ? join(workspaceRoot, options.outputFile)
      : join(workspaceRoot, "storm.schema.json"),
    zodToJsonSchema(StormConfigSchema, { name: "StormConfiguration" })
  );
  await formatFiles(tree);

  return {
    success: true
  };
}

export default withRunGenerator<ConfigSchemaGeneratorSchema>(
  "Configuration Schema Creator",
  configSchemaGeneratorFn
);
