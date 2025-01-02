import { formatFiles, type Tree, writeJson } from "@nx/devkit";
import { type StormConfig, StormConfigSchema } from "@storm-software/config";
import {
  findWorkspaceRoot,
  writeInfo,
  writeSuccess,
  writeTrace
} from "@storm-software/config-tools";
import * as z from "zod";
import { JsonSchema7Type, zodToJsonSchema } from "zod-to-json-schema";
import { withRunGenerator } from "../../base/base-generator";
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
  writeInfo("📦  Running Storm Configuration JSON Schema generator", config);

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
