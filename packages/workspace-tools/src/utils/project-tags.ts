import { ProjectConfiguration } from "@nx/devkit";
import {
  ProjectTagDistStyleValue,
  ProjectTagTypeValue,
  ProjectTagVariant
} from "../../declarations";

export const formatProjectTag = (variant: ProjectTagVariant, value: string) => {
  return `${variant}:${value}`;
};

export const hasProjectTag = (
  project: ProjectConfiguration,
  variant: ProjectTagVariant
) => {
  project.tags = project.tags ?? [];

  const prefix = formatProjectTag(variant, "");
  return project.tags.some(
    tag => tag.startsWith(prefix) && tag.length > prefix.length
  );
};

export const getProjectTag = (
  project: ProjectConfiguration,
  variant: ProjectTagVariant
): string | undefined => {
  if (!hasProjectTag(project, variant)) {
    return undefined;
  }

  project.tags = project.tags ?? [];
  const prefix = formatProjectTag(variant, "");
  const tag = project.tags.find(tag => tag.startsWith(prefix));

  return tag?.replace(prefix, "");
};

export const isEqualProjectTag = (
  project: ProjectConfiguration,
  variant: ProjectTagVariant,
  value: string
): boolean => {
  const tag = getProjectTag(project, variant);

  return !!(tag && tag?.toUpperCase() === value.toUpperCase());
};

export const addProjectTag = (
  project: ProjectConfiguration,
  variant: ProjectTagVariant,
  value: string,
  options: {
    overwrite?: boolean;
  } = {
    overwrite: false
  }
) => {
  project.tags = project.tags ?? [];
  if (options.overwrite || !hasProjectTag(project, variant)) {
    project.tags = project.tags.filter(
      tag => !tag.startsWith(formatProjectTag(variant, ""))
    );
    project.tags.push(formatProjectTag(variant, value));
  }
};

export const setDefaultProjectTags = (project: ProjectConfiguration) => {
  project.tags = project.tags ?? [];

  addProjectTag(
    project,
    ProjectTagVariant.TYPE,
    project.projectType === "application"
      ? ProjectTagTypeValue.APPLICATION
      : ProjectTagTypeValue.LIBRARY,
    { overwrite: true }
  );
  addProjectTag(
    project,
    ProjectTagVariant.DIST_STYLE,
    project.targets && Object.keys(project.targets).includes("clean-package")
      ? ProjectTagDistStyleValue.CLEAN
      : ProjectTagDistStyleValue.NORMAL,
    { overwrite: true }
  );
};
