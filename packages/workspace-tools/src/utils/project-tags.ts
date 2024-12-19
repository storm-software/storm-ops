import { ProjectConfiguration } from "@nx/devkit";
import {
  ProjectTagDistStyleValue,
  ProjectTagLanguageValue,
  ProjectTagPlatformValue,
  ProjectTagRegistryValue,
  ProjectTagTypeValue,
  ProjectTagVariant
} from "../../declarations.d";

export const ProjectTagConstants = {
  Language: {
    TAG_ID: "language" as ProjectTagVariant,

    TYPESCRIPT: "typescript" as ProjectTagLanguageValue,
    RUST: "rust" as ProjectTagLanguageValue
  },
  ProjectType: {
    TAG_ID: "type" as ProjectTagVariant,

    LIBRARY: "library" as ProjectTagTypeValue,
    APPLICATION: "application" as ProjectTagTypeValue
  },
  DistStyle: {
    TAG_ID: "dist-style" as ProjectTagVariant,

    NORMAL: "normal" as ProjectTagDistStyleValue,
    CLEAN: "clean" as ProjectTagDistStyleValue
  },
  Provider: {
    TAG_ID: "provider" as ProjectTagVariant
  },
  Platform: {
    TAG_ID: "platform" as ProjectTagVariant,

    NODE: "node" as ProjectTagPlatformValue,
    BROWSER: "browser" as ProjectTagPlatformValue,
    NEUTRAL: "neutral" as ProjectTagPlatformValue,
    WORKER: "worker" as ProjectTagPlatformValue
  },
  Registry: {
    TAG_ID: "registry" as ProjectTagVariant,

    CARGO: "cargo" as ProjectTagRegistryValue,
    NPM: "npm" as ProjectTagRegistryValue,
    CONTAINER: "container" as ProjectTagRegistryValue,
    CYCLONE: "cyclone" as ProjectTagRegistryValue
  }
} as const;

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
    ProjectTagConstants.ProjectType.TAG_ID,
    project.projectType === "application"
      ? ProjectTagConstants.ProjectType.APPLICATION
      : ProjectTagConstants.ProjectType.LIBRARY,
    { overwrite: true }
  );
  addProjectTag(
    project,
    ProjectTagConstants.DistStyle.TAG_ID,
    project.targets && Object.keys(project.targets).includes("clean-package")
      ? ProjectTagConstants.DistStyle.CLEAN
      : ProjectTagConstants.DistStyle.NORMAL,
    { overwrite: true }
  );
};
