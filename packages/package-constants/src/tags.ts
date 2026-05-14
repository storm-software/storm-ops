import {
  ProjectTagDistStyleValue,
  ProjectTagLanguageValue,
  ProjectTagPlatformValue,
  ProjectTagRegistryValue,
  ProjectTagTypeValue,
  ProjectTagVariant
} from "./types";

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
  ProjectLinking: {
    TAG_ID: "project-linking" as ProjectTagVariant,

    REFERENCE: "reference" as string,
    ALIAS: "alias" as string
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
  },
  Plugin: {
    TAG_ID: "plugin" as ProjectTagVariant
  },
  Builder: {
    TAG_ID: "builder" as ProjectTagVariant,

    TSC: "tsc" as ProjectTagLanguageValue,
    TSUP: "tsup" as ProjectTagLanguageValue,
    TSDOWN: "tsdown" as ProjectTagLanguageValue,
    VITE: "vite" as ProjectTagLanguageValue,
    ROLLDOWN: "rolldown" as ProjectTagLanguageValue
  }
} as const;

export const formatProjectTag = (variant: ProjectTagVariant, value: string) => {
  return `${variant}:${value}`;
};

export const hasProjectTag = (project: any, variant: ProjectTagVariant) => {
  project.tags = project.tags ?? [];

  const prefix = formatProjectTag(variant, "");
  return project.tags.some(
    tag => tag.startsWith(prefix) && tag.length > prefix.length
  );
};

export const getProjectTag = (
  project: any,
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
  project: any,
  variant: ProjectTagVariant,
  value: string
): boolean => {
  const tag = getProjectTag(project, variant);

  return !!(tag && tag?.toUpperCase() === value.toUpperCase());
};
