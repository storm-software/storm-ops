import { formatFiles, type Tree, writeJson } from "@nx/devkit";
import {
  schemaRegistry,
  type StormWorkspaceConfig,
  workspaceConfigSchema
} from "@storm-software/config";
import {
  findWorkspaceRoot,
  writeInfo,
  writeSuccess,
  writeTrace
} from "@storm-software/config-tools";
import * as z from "zod";
import { withRunGenerator } from "../../base/base-generator";
import type { ConfigSchemaGeneratorSchema } from "./schema.d";

export type ModuleSchema = {
  name: string;
  schema: z.ZodType;
};
export async function configSchemaGeneratorFn(
  tree: Tree,
  options: ConfigSchemaGeneratorSchema,
  config?: StormWorkspaceConfig
) {
  writeInfo(
    "📦  Running Storm Workspace Configuration JSON Schema generator",
    config
  );

  writeTrace(
    `Determining the Storm Workspace Configuration JSON Schema...`,
    config
  );

  const jsonSchema = z.toJSONSchema(workspaceConfigSchema, {
    target: "draft-7",
    metadata: schemaRegistry
  });

  jsonSchema.$id ??=
    "https://public.storm-cdn.com/schemas/storm-workspace.schema.json";
  jsonSchema.title ??= "Storm Workspace Configuration JSON Schema";
  jsonSchema.description ??=
    "This JSON Schema defines the structure of the Storm Workspace configuration file (`storm-workspace.json`). It is used to validate the configuration file and ensure that it adheres to the expected format.";

  writeTrace(jsonSchema, config);

  if (!options.outputFile) {
    throw new Error(
      "The `outputFile` option is required. Please specify the output file path."
    );
  }

  const outputPath = options.outputFile
    .replaceAll("{workspaceRoot}", "")
    .replaceAll(
      config?.workspaceRoot ?? findWorkspaceRoot(),
      options.outputFile.startsWith("./") ? "" : "./"
    );

  writeTrace(
    `📝  Writing Storm Configuration JSON Schema to "${outputPath}"`,
    config
  );

  writeJson(tree, outputPath, jsonSchema, { spaces: 2 });
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
  configSchemaGeneratorFn,
  {
    hooks: {
      applyDefaultOptions: (
        options: ConfigSchemaGeneratorSchema
      ): ConfigSchemaGeneratorSchema => {
        options.outputFile ??= "{workspaceRoot}/storm-workspace.schema.json";

        return options;
      }
    }
  }
);
