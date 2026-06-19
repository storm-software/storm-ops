export type ProjectTagVariant =
  | "language"
  | "type"
  | "dist-style"
  | "provider"
  | "platform"
  | "registry"
  | "plugin";
export const ProjectTagVariant = {
  LANGUAGE: "language" as ProjectTagVariant,
  TYPE: "type" as ProjectTagVariant,
  DIST_STYLE: "dist-style" as ProjectTagVariant,
  PROVIDER: "provider" as ProjectTagVariant,
  PLATFORM: "platform" as ProjectTagVariant,
  REGISTRY: "registry" as ProjectTagVariant,
  PLUGIN: "plugin" as ProjectTagVariant
};

export type ProjectTagLanguageValue = "typescript" | "rust";
export const ProjectTagLanguageValue = {
  TYPESCRIPT: "typescript" as ProjectTagLanguageValue,
  RUST: "rust" as ProjectTagLanguageValue
};

export type ProjectTagTypeValue = "library" | "application";
export const ProjectTagTypeValue = {
  LIBRARY: "library" as ProjectTagTypeValue,
  APPLICATION: "application" as ProjectTagTypeValue
};

export type ProjectTagDistStyleValue = "normal" | "clean";
export const ProjectTagDistStyleValue = {
  NORMAL: "normal" as ProjectTagDistStyleValue,
  CLEAN: "clean" as ProjectTagDistStyleValue
};

export type ProjectTagPlatformValue = "node" | "browser" | "neutral" | "worker";
export const ProjectTagPlatformValue = {
  NODE: "node" as ProjectTagPlatformValue,
  BROWSER: "browser" as ProjectTagPlatformValue,
  NEUTRAL: "neutral" as ProjectTagPlatformValue,
  WORKER: "worker" as ProjectTagPlatformValue
};

export type ProjectTagRegistryValue = "cargo" | "npm" | "container" | "cyclone";
export const ProjectTagRegistryValue = {
  CARGO: "cargo" as ProjectTagRegistryValue,
  NPM: "npm" as ProjectTagRegistryValue,
  CONTAINER: "container" as ProjectTagRegistryValue,
  CYCLONE: "cyclone" as ProjectTagRegistryValue
};
