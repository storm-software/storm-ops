import { StormConfig } from "@storm-software/config";
import {
  writeError,
  writeTrace
} from "@storm-software/config-tools/logger/console";
import { Path } from "glob";
import { writeFile } from "node:fs/promises";
import { Schema } from "untyped";
import { getOutputFile } from "../utilities";

export function generateMarkdown(schema: Schema) {
  return `
<!-- Generated by @storm-software/untyped -->
<!-- Do not edit this file directly -->

${generateMarkdownLevel(schema, schema.title || "", "#").join("\n")}

`;
}

function generateMarkdownLevel(schema: Schema, title: string, level: string) {
  const lines: string[] = [];

  lines.push(`${level} ${title}`);

  if (schema.type === "object") {
    for (const key in schema.properties) {
      const val = schema.properties[key] as Schema;
      lines.push("", ...generateMarkdownLevel(val, `\`${key}\``, level + "#"));
    }
    return lines;
  }

  // Type and default
  lines.push(
    `- **Type**: \`${schema.markdownType || schema.tsType || schema.type}\``
  );
  if ("default" in schema) {
    lines.push(`- **Default**: \`${JSON.stringify(schema.default)}\``);
  }
  lines.push("");

  // Title
  if (schema.title) {
    lines.push("> " + schema.title, "");
  }

  // Signuture (function)
  // if (schema.type === "function") {
  //   lines.push("```ts", genFunctionType(schema, {}), "```", "");
  // }

  // Description
  if (schema.description) {
    lines.push("", schema.description, "");
  }

  return lines;
}

export function generateMarkdownFile(
  schema: Schema,
  file: Path,
  config?: StormConfig
) {
  try {
    const declarations = getOutputFile(file, "md");
    writeTrace(`Writing type markdown file ${declarations}`, config);

    return writeFile(declarations, generateMarkdown(schema));
  } catch (error) {
    writeError(
      `Error writing markdown file for ${file.name}

Error:
${error?.message ? error.message : JSON.stringify(error)}${
        error?.stack
          ? `
Stack Trace: ${error.stack}`
          : ""
      }

Parsed schema:
${JSON.stringify(schema)}
`,
      config
    );

    throw error;
  }
}