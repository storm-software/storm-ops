import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "fs";
import {
  buildProjectGraphWithoutDaemon,
  readProjectsConfigurationFromProjectGraph
} from "nx/src/project-graph/project-graph";
import { join } from "path";
import { format } from "prettier";
import { findFileName, findFilePath } from "../common/file-utils";
import { ReadMeOptions } from "../types";
import { doctoc } from "./doctoc";
import { createTokens, formatReadMeFromSectionName } from "./utils";

export const runReadme = async ({
  templates = "@storm-software/git-tools/readme/templates",
  project,
  output,
  clean = true,
  prettier = true
}: ReadMeOptions) => {
  const projectGraph = await buildProjectGraphWithoutDaemon();
  const projectConfigs =
    readProjectsConfigurationFromProjectGraph(projectGraph);

  if (project) {
    await runProjectReadme(project, {
      templates,
      output,
      clean,
      prettier
    });
  } else {
    for (const projectName of Object.keys(projectConfigs.projects)) {
      await runProjectReadme(projectName, {
        templates,
        output,
        clean,
        prettier
      });
    }
  }
};

export const runProjectReadme = async (
  projectName: string,
  { templates, output, clean = true, prettier = true }: ReadMeOptions
) => {
  const projectGraph = await buildProjectGraphWithoutDaemon();
  const projectConfigs =
    readProjectsConfigurationFromProjectGraph(projectGraph);

  const project = projectConfigs.projects[projectName];

  const inputFile = join(project.root, "README.md");
  if (existsSync(inputFile)) {
    console.info(`Formatting README file at "${inputFile}"`);
    if (!existsSync(inputFile)) {
      console.warn(`Cannot find the input file at ${inputFile}`);
    } else {
      const outputFilePath = output
        ? output.includes("README.md")
          ? output
          : join(findFilePath(output), "README.md")
        : inputFile;

      if (clean && existsSync(outputFilePath)) {
        if (outputFilePath === inputFile) {
          console.warn(
            "Skipping cleaning since output directory + file name is the same as input directory + file name."
          );
        } else {
          console.info(
            "Cleaning output directory (set `clean` parameter to false to skip)..."
          );
          rmSync(outputFilePath);
        }
      }

      let newContent = readdirSync(templates).reduce(
        (ret: string, fileName: string) => {
          console.info(`Using template "${fileName}" to format file...`);

          const templateFilePath = join(templates, fileName);
          const templateContent = readFileSync(templateFilePath, "utf8");

          const section = findFileName(templateFilePath)
            .replace(templates, "")
            .replace("README.", "")
            .replace(".md", "");

          return formatReadMeFromSectionName(section, templateContent, ret);
        },
        readFileSync(inputFile, "utf8")
      );

      const packageJsonPath = join(findFilePath(inputFile), "package.json");
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(
          readFileSync(packageJsonPath, "utf8") ?? "{}"
        );
        if (packageJson?.version) {
          console.info("Adding version...");
          newContent = newContent.replace(
            "<!-- VERSION -->",
            packageJson.version
          );
        }
      }

      if (prettier) {
        console.info(`Formatting output with Prettier`);
        newContent = format(newContent, {
          parser: "markdown",
          trailingComma: "none",
          tabWidth: 2,
          semi: true,
          singleQuote: false,
          quoteProps: "preserve",
          insertPragma: false,
          bracketSameLine: true,
          printWidth: 80,
          bracketSpacing: true,
          arrowParens: "avoid",
          endOfLine: "lf"
        });
      }

      console.info(`Writing output markdown to "${outputFilePath}"`);
      writeFileSync(outputFilePath, newContent);

      try {
        const { start, end } = createTokens("doctoc");
        if (newContent.includes(start) || newContent.includes(end)) {
          console.info("Formatting Table of Contents...");

          doctoc(outputFilePath);
        } else {
          console.warn(
            `Contents do not contain start/end comments for section "doctoc", skipping  table of contents generation...`
          );
        }
      } catch (e) {
        console.warn(
          `Failed to format Table of Contents for ${outputFilePath}.`
        );
        console.warn(e);
      }

      console.log(`ReadMe Formatting successfully ran for ${projectName}.`);
    }
  }
};
