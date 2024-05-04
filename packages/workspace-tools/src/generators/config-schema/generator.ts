import { formatFiles, type Tree, writeJson } from "@nx/devkit";
import { type StormConfig, StormConfigSchema } from "@storm-software/config";
import * as z from "zod";
import { JsonSchema7Type, zodToJsonSchema } from "zod-to-json-schema";
import { withRunGenerator } from "../../base/base-generator";
import type { ConfigSchemaGeneratorSchema } from "./schema";
import { writeTrace } from "@storm-software/config-tools";

export type ModuleSchema = {
  name: string;
  schema: z.ZodObject<any>;
};

export async function configSchemaGeneratorFn(
  tree: Tree,
  options: ConfigSchemaGeneratorSchema,
  config?: StormConfig
) {
  const { findWorkspaceRoot, writeInfo, writeSuccess } = await import(
    "@storm-software/config-tools"
  );

  writeInfo("📦  Running Storm Configuration JSON Schema generator", config);

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

  writeTrace(`Determining the Storm Configuration JSON Schema...`, config);

  const jsonSchema = zodToJsonSchema(StormConfigSchema, {
    name: "StormConfiguration"
  });
  writeTrace(jsonSchema, config);

  let outputPath = options.outputFile
    ? options.outputFile.replaceAll("{workspaceRoot}", "")
    : "storm.schema.json";
  outputPath = outputPath.replaceAll(
    config?.workspaceRoot ?? findWorkspaceRoot(),
    outputPath.startsWith("./") ? "" : "./"
  );

  writeTrace(
    `📝  Writing Storm Configuration JSON Schema to "${outputPath}"`,
    config
  );

  writeJson<
    JsonSchema7Type & {
      $schema?: string | undefined;
      definitions?:
        | {
            [key: string]: JsonSchema7Type;
          }
        | undefined;
    }
  >(tree, outputPath, jsonSchema, { spaces: 2 });
  await formatFiles(tree);

  writeSuccess(
    "🚀  Storm Configuration JSON Schema creation has completed successfully!",
    config
  );

  return {
    success: true
  };
}

export default withRunGenerator<ConfigSchemaGeneratorSchema>(
  "Configuration Schema Creator",
  configSchemaGeneratorFn
);
