import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { findFilePath } from "../utilities/file-utils";

export const getExecutorMarkdown = (
  _packageName: string,
  executorsJsonFile: string,
  executorsJson: Record<string, any>,
): string => {
  if (!executorsJson?.executors) {
    return "";
  }

  return Object.entries(executorsJson.executors)
    .map(([name, executor]: [string, any]) => {
      if (!name || !executor || executor.hidden) {
        return "";
      }

      let result = "";
      let title = "";
      let description = "";
      let required: string[] = [];

      if (executor.schema) {
        const schemaJsonPath = join(
          findFilePath(executorsJsonFile),
          executor.schema,
        );
        if (existsSync(schemaJsonPath)) {
          const schemaJson = JSON.parse(
            readFileSync(schemaJsonPath, "utf8") ?? "{}",
          );

          if (schemaJson.title) {
            title = `## ${schemaJson.title}\n\n`;
          }

          if (schemaJson.description) {
            description = `${schemaJson.description
              .replaceAll("`", "\\`")
              .replaceAll("*", "\\*")}\n\n`;
          }

          required =
            schemaJson.required && Array.isArray(schemaJson.required)
              ? schemaJson.required
              : [];
          if (
            schemaJson.properties &&
            Object.keys(schemaJson.properties).length > 0
          ) {
            result +=
              "### Options\n\nThe following executor options are available:\n\n";
            result += "| Option    | Type   | Description   | Default   | \n";
            result += "| --------- | ------ | ------------- | --------- | \n";

            result += Object.entries(schemaJson.properties)
              .map(([name, schema]: [string, any]) => {
                let result = "";
                if (name) {
                  result += `| ${required.includes(name) ? "**" : ""}${name}${
                    required.includes(name) ? " \\*" : "  "
                  }${required.includes(name) ? "**" : ""}   `;
                  if (schema.type) {
                    if (
                      schema.enum &&
                      Array.isArray(schema.enum) &&
                      schema.enum.length > 0
                    ) {
                      result += ` | ${schema.enum
                        .map((x: any) =>
                          !schema.type || schema.type === "string"
                            ? `"${x}"`
                            : `\`${x}\``,
                        )
                        .join(" \\| ")}    `;
                    } else if (schema.type === "array" && schema.items?.type) {
                      result += ` | \`${schema.items.type}[]\`  `;
                    } else {
                      result += ` | \`${schema.type}\`   `;
                    }
                  } else {
                    result += " | `string`  ";
                  }

                  if (schema.description) {
                    result += ` | ${schema.description
                      .replaceAll("`", "\\`")
                      .replaceAll("*", "\\*")}    `;
                  } else {
                    result += " |    ";
                  }

                  if (schema.default) {
                    result +=
                      schema.type === "string" || !schema.type
                        ? ` | "${schema.default}"    `
                        : schema.type === "array"
                          ? " | `[]`    "
                          : ` | \`${schema.default}\`    `;
                  } else {
                    result += " |    ";
                  }

                  result += " | \n";
                }

                return result;
              })
              .join(" ");

            result += "\n\n";
            if (required.length > 0) {
              result +=
                "**Please note:** _Option names followed by \\* above are required, and must be provided to run the executor._ \n\n";
            }
          }
        }
      }

      if (!title) {
        title = `## ${name}\n\n`;
      }

      if (!description && executor.description) {
        description = `${executor.description.replaceAll("`", "\\`").replaceAll("*", "\\*")}\n\n`;
      }

      return `${
        title + description
      }### Example \n\nThis executor can be used by executing the following in a command line utility: \n\n\`\`\`cmd \nnx run my-project:${name}\n\`\`\`\n\n**Please note:** _The ${name} executor should be included in the desired projects's \`project.json\` file.${
        required.length > 0
          ? "All required options must be included in the `options` property of the json."
          : ""
      }_ \n\n${result}`;
    })
    .join("\n\n");
};

export const getGeneratorMarkdown = (
  packageName: string,
  generatorsJsonFile: string,
  generatorsJson: Record<string, any>,
): string => {
  if (!generatorsJson?.generators) {
    return "";
  }

  return Object.entries(generatorsJson.generators)
    .map(([name, generator]: [string, any]) => {
      if (!name || !generator) {
        return "";
      }

      let result = "";
      let title = "";
      let description = "";
      let example = "";
      const required = [];

      if (generator.schema) {
        const schemaJsonPath = join(
          findFilePath(generatorsJsonFile),
          generator.schema,
        );
        if (existsSync(schemaJsonPath)) {
          const schemaJson = JSON.parse(
            readFileSync(schemaJsonPath, "utf8") ?? "{}",
          );

          if (schemaJson.title) {
            title = `## ${schemaJson.title}\n\n`;
          }

          if (schemaJson.description) {
            description = `${schemaJson.description.replaceAll("*", "\\*")}\n\n`;
          }

          if (
            schemaJson.properties &&
            Object.keys(schemaJson.properties).length > 0
          ) {
            const required =
              schemaJson.required && Array.isArray(schemaJson.required)
                ? schemaJson.required
                : [];

            result +=
              "### Options\n\nThe following executor options are available:\n\n";
            result += "| Option    | Type   | Description   | Default   | \n";
            result += "| --------- | ------ | ------------- | --------- | \n";

            result += Object.entries(schemaJson.properties)
              .map(([name, schema]: [string, any]) => {
                let resultSchema = "";
                if (name) {
                  resultSchema += `| ${required.includes(name) ? "**" : ""}${name}${
                    required.includes(name) ? " \\*" : "  "
                  }${required.includes(name) ? "**" : ""}   `;
                  if (schema.type) {
                    if (
                      schema.enum &&
                      Array.isArray(schema.enum) &&
                      schema.enum.length > 0
                    ) {
                      resultSchema += ` | ${schema.enum
                        .map((x: any) =>
                          !schema.type || schema.type === "string"
                            ? `"${x}"`
                            : `\`${x}\``,
                        )
                        .join(" \\| ")}    `;
                    } else if (schema.type === "array" && schema.items?.type) {
                      resultSchema += ` | \`${schema.items.type}[]\`  `;
                    } else {
                      resultSchema += ` | \`${schema.type}\`   `;
                    }
                  } else {
                    resultSchema += " | `string`  ";
                  }

                  if (schema.description) {
                    resultSchema += ` | ${schema.description.replaceAll("*", "\\*")}    `;
                  } else {
                    resultSchema += " |    ";
                  }

                  if (schema.default) {
                    resultSchema +=
                      schema.type === "string" || !schema.type
                        ? ` | "${schema.default}"    `
                        : schema.type === "array"
                          ? " | `[]`    "
                          : ` | \`${schema.default}\`    `;
                  } else {
                    resultSchema += " |    ";
                  }

                  resultSchema += " | \n";
                }

                return resultSchema;
              })
              .join(" ");

            result += "\n\n";
            if (required.length > 0) {
              result +=
                "**Please note:** _Option names followed by \\* above are required, and must be provided to run the executor._ \n\n";
            }
          }

          if (schemaJson.example) {
            if (
              Array.isArray(schemaJson.example) &&
              schemaJson.example.length > 0
            ) {
              example +=
                "### Examples \n\nThis generator can be used by executing the following examples in a command line utility: \n\n";
              example += schemaJson.example
                .map((exampleCmd: any) => {
                  let resultCmd = "";
                  if (
                    exampleCmd.description &&
                    typeof exampleCmd.description === "string"
                  ) {
                    resultCmd += `${exampleCmd.description.replaceAll("*", "\\*")}\n\n`;
                  }

                  if (
                    exampleCmd.command &&
                    typeof exampleCmd.command === "string"
                  ) {
                    resultCmd += `\`\`\`bash \n${exampleCmd.command}\n\`\`\`\n\n`;
                  } else if (typeof exampleCmd === "string") {
                    resultCmd += `\`\`\`bash \n${exampleCmd}\n\`\`\`\n\n`;
                  }

                  return resultCmd;
                })
                .join("\n\n");
            } else if (
              schemaJson.example.command &&
              typeof schemaJson.example.command === "string"
            ) {
              if (
                schemaJson.example.description &&
                typeof schemaJson.example.description === "string"
              ) {
                example = `### Example \n\n${schemaJson.example.description.replaceAll(
                  "*",
                  "\\*",
                )} \n\n`;
              } else {
                example =
                  "### Example \n\nThis generator can be used by executing the following in a command line utility: \n\n";
              }

              example += `\`\`\`bash \n${schemaJson.example.command}\n\`\`\`\n\n`;
            } else if (typeof schemaJson.example === "string") {
              example =
                "### Example \n\nThis generator can be used by executing the following in a command line utility: \n\n";
              example += `\`\`\`bash \n${schemaJson.example}\n\`\`\`\n\n`;
            } else {
              example =
                "### Example \n\nThis generator can be used by executing the following in a command line utility: \n\n";
              example += `\`\`\`bash \nnx g ${packageName}:${name}\n\`\`\`\n\n`;
            }

            if (required.length > 0) {
              example +=
                "** Please note:** _All required options must be included as parameters when calling the generator._ \n\n";
            }
          }
        }
      }

      if (!title) {
        title = `## ${name}\n\n`;
      }

      if (!description && generator.description) {
        description = `${generator.description.replaceAll("*", "\\*")}\n\n`;
      }

      return title + description + example + result;
    })
    .join("\n\n");
};
