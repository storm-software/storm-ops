import {
  joinPathFragments,
  ProjectConfiguration,
  readJsonFile
} from "@nx/devkit";
import { PackageJson } from "@storm-software/workspace-tools/executors/clean-package/types";
import {
  isEqualProjectTag,
  ProjectTagConstants
} from "@storm-software/workspace-tools/utils/project-tags";
import {
  CargoToml,
  parseCargoToml
} from "@storm-software/workspace-tools/utils/toml";
import { existsSync } from "node:fs";

export type PackageManagerType = "package.json" | "Cargo.toml";
export const PackageManagerTypes = {
  PackageJson: "package.json" as PackageManagerType,
  CargoToml: "Cargo.toml" as PackageManagerType
};

export type PackageManager = {
  content: PackageJson | CargoToml;
  type: "package.json" | "Cargo.toml";
};

export const getPackageManager = (
  project: ProjectConfiguration
): null | PackageManager => {
  if (
    isEqualProjectTag(
      project,
      ProjectTagConstants.Language.TAG_ID,
      ProjectTagConstants.Language.RUST
    ) &&
    existsSync(joinPathFragments(project.root, "Cargo.toml"))
  ) {
    return {
      type: "Cargo.toml",
      content: parseCargoToml(joinPathFragments(project.root, "Cargo.toml"))
    };
  } else if (
    isEqualProjectTag(
      project,
      ProjectTagConstants.Language.TAG_ID,
      ProjectTagConstants.Language.TYPESCRIPT
    ) &&
    existsSync(joinPathFragments(project.root, "package.json"))
  ) {
    return {
      type: "package.json",
      content: readJsonFile(
        joinPathFragments(project.root, "package.json")
      ) as PackageJson
    };
  }

  return null;
};
