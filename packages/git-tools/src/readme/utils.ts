import { readFileSync } from "node:fs";
import { findFileName } from "../utilities/file-utils";

export const formatReadMe = (
  templatePath: string,
  readMeContent: string,
): string => {
  const templateContent = readFileSync(templatePath, "utf8");

  const section = findFileName(templatePath)
    .replace(templatePath, "")
    .replace("README.", "")
    .replace(".md", "");
  return formatReadMeFromSectionName(section, templateContent, readMeContent);
};

export const formatReadMeFromSectionName = (
  sectionName: string,
  templateContent: string,
  readMeContent: string,
  skipLint = true,
): string => {
  const { regex, start, end } = createRegExp(sectionName);
  if (!regex.test(readMeContent)) {
    console.warn(
      `Contents do not contain start/end comments for section "${sectionName}".
Start: "${start}"
End: "${end}"
Regex: "${regex}"
Content: "${readMeContent}"`,
    );
    return readMeContent;
  }

  return readMeContent.replace(
    regex,
    `${start}
${skipLint ? "<!-- prettier-ignore-start -->\n" + "<!-- markdownlint-disable -->\n" : ""}

${templateContent}

${skipLint ? "<!-- markdownlint-restore -->\n" + "<!-- prettier-ignore-end -->\n" : ""}
${end}`,
  );
};

export const createTokens = (sectionName: string) => {
  const start = `<!-- START ${sectionName} -->`;
  const end = `<!-- END ${sectionName} -->`;
  return { start, end };
};

export const createRegExp = (sectionName: string) => {
  const { start, end } = createTokens(sectionName);

  const regex = new RegExp(`${start}([\\s\\S]*?)${end}`);
  return { regex, start, end };
};
