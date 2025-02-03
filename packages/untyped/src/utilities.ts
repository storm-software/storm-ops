import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { Path } from "glob";

/**
 * Get the output file for the schema file
 *
 * @param file - The schema file
 * @param extension - The extension of the output file
 * @returns The output file path
 */
export const getOutputFile = (
  file: Path,
  extension: "json" | "d.ts" | "md",
) => {
  let fileName = file.name
    .slice(0, file.name.lastIndexOf("."))
    .replace(".untyped", "")
    .replace("untyped", "")
    .replace(".schema", "")
    .replace("schema", "");
  if (!fileName) {
    fileName = "schema";
  }
  if (fileName !== "schema") {
    fileName = `${fileName}.schema`;
  }

  return joinPaths(file.parentPath, `${fileName}.${extension}`);
};
