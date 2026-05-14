import { ProjectConfiguration } from "@nx/devkit";
import {
  formatProjectTag,
  hasProjectTag,
  ProjectTagConstants
} from "@storm-software/package-constants/tags";
import { ProjectTagVariant } from "../types";

export * from "@storm-software/package-constants/tags";

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

export const addPluginProjectTag = (
  project: ProjectConfiguration,
  plugin: string
) => {
  project.tags = project.tags ?? [];
  project.tags.push(
    formatProjectTag(ProjectTagConstants.Plugin.TAG_ID, plugin)
  );
};

export const setDefaultProjectTags = (
  project: ProjectConfiguration,
  plugin?: string
) => {
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
  addProjectTag(
    project,
    ProjectTagConstants.Platform.TAG_ID,
    project.targets?.build?.options?.platform === "node"
      ? ProjectTagConstants.Platform.NODE
      : project.targets?.build?.options?.platform === "worker"
        ? ProjectTagConstants.Platform.WORKER
        : project.targets?.build?.options?.platform === "browser"
          ? ProjectTagConstants.Platform.BROWSER
          : ProjectTagConstants.Platform.NEUTRAL,
    { overwrite: false }
  );

  if (plugin) {
    addPluginProjectTag(project, plugin);
  }
};
