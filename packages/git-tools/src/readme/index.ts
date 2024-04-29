import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";
import {
  createProjectGraphAsync,
  readProjectsConfigurationFromProjectGraph
} from "nx/src/project-graph/project-graph.js";
import type { ReadMeOptions } from "../types";
import { findFileName, findFilePath } from "../utilities/file-utils";
import { doctoc } from "./doctoc";
import { getExecutorMarkdown, getGeneratorMarkdown } from "./nx-docs";
import { createTokens, formatReadMeFromSectionName } from "./utils";

export const runReadme = async ({
  templates = "./docs/readme-templates",
  project,
  output,
  clean = true,
  prettier = true
}: ReadMeOptions) => {
  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });
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
  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });
  const projectConfigs =
    readProjectsConfigurationFromProjectGraph(projectGraph);

  const project = projectConfigs.projects[projectName];

  const inputFile = join(project?.root ?? "./", "README.md");
  if (existsSync(inputFile)) {
    console.info(`Formatting ${projectName}'s README file at "${inputFile}"`);

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

    let packageName = projectName;
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
      if (packageJson?.name) {
        packageName = packageJson.name;
      }
    }

    if (newContent.includes("<!-- START executors -->")) {
      const executorsJsonPath = join(findFilePath(inputFile), "executors.json");
      if (existsSync(executorsJsonPath)) {
        const executorsJson = JSON.parse(
          readFileSync(executorsJsonPath, "utf8") ?? "{}"
        );
        if (executorsJson?.executors) {
          console.info("Adding executors...");

          newContent = formatReadMeFromSectionName(
            "executors",
            getExecutorMarkdown(packageName, executorsJsonPath, executorsJson),
            newContent
          );
        }
      }
    }

    if (newContent.includes("<!-- START generators -->")) {
      const generatorsJsonPath = join(
        findFilePath(inputFile),
        "generators.json"
      );
      if (existsSync(generatorsJsonPath)) {
        const generatorsJson = JSON.parse(
          readFileSync(generatorsJsonPath, "utf8") ?? "{}"
        );
        if (generatorsJson?.generators) {
          console.info("Adding generators...");

          newContent = formatReadMeFromSectionName(
            "generators",
            getGeneratorMarkdown(
              packageName,
              generatorsJsonPath,
              generatorsJson
            ),
            newContent
          );
        }
      }
    }

    if (prettier) {
      const prettier = await import("prettier");
      console.info("Formatting output with Prettier");

      newContent = await prettier.format(newContent, {
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
      console.warn(`Failed to format Table of Contents for ${outputFilePath}.`);
      console.warn(e);
    }

    console.log(`ReadMe Formatting successfully ran for ${projectName}.`);
  } else {
    console.warn(`Cannot find the input file at ${inputFile}`);
  }
};
