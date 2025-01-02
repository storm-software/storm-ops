import {
  CreateNodesContext,
  joinPathFragments,
  ProjectGraphExternalNode,
  readJsonFile,
  type CreateDependencies,
  type CreateNodes,
  type ProjectConfiguration
} from "@nx/devkit";
import { loadStormConfig } from "@storm-software/config-tools/create-storm-config";
import { findWorkspaceRoot } from "@storm-software/config-tools/utilities/find-workspace-root";
import { getPackageInfo } from "@storm-software/workspace-tools/utils/package-helpers";
import {
  hasProjectTag,
  isEqualProjectTag,
  ProjectTagConstants,
  setDefaultProjectTags
} from "@storm-software/workspace-tools/utils/project-tags";
import { CargoToml } from "@storm-software/workspace-tools/utils/toml";
import { existsSync } from "node:fs";
import type { ExternalContainerExecutorSchema } from "../../executors/container-publish/schema";

export const name = "storm-software/docker/dockerfile";
export const description = "Plugin for parsing Dockerfile files";

export interface DockerFilePluginOptions {
  defaultEngine?: ExternalContainerExecutorSchema["engine"];
}

export const createNodes: CreateNodes<DockerFilePluginOptions> = [
  "*/**/{Dockerfile,Dockerfile.*}",
  async (
    dockerFilePath: string,
    opts: DockerFilePluginOptions = {
      defaultEngine: "docker"
    },
    _: CreateNodesContext
  ) => {
    if (!dockerFilePath) {
      return {};
    }

    const root = dockerFilePath.substring(dockerFilePath.lastIndexOf("/") + 1);
    const projectJsonPath = joinPathFragments(root, "project.json");
    if (!existsSync(projectJsonPath)) {
      return {};
    }

    const projectJson = readJsonFile<ProjectConfiguration>(projectJsonPath);
    if (projectJson?.name) {
      return {};
    }

    const workspaceRoot = findWorkspaceRoot();
    const config = await loadStormConfig(workspaceRoot);

    Object.keys(projectJson).forEach(key => {
      if (!project[key]) {
        project[key] = projectJson[key];
      }
    });

    const project: ProjectConfiguration = {
      root,
      name: projectJson?.name
    };

    const engine = opts.defaultEngine ?? "docker";
    const labels = [
      `org.opencontainers.image.ref.name=${project.name}`,
      `org.opencontainers.image.title=${titleCase(project.name)}`,
      `org.opencontainers.image.authors=${config.organization ? titleCase(config.organization) : "Storm Software"}`,
      `org.opencontainers.image.vendor=${config.organization ? titleCase(config.organization) : "Storm Software"}`,
      `org.opencontainers.image.documentation=${config.docs}`,
      `org.opencontainers.image.url=${config.homepage}`,
      `org.opencontainers.image.source=${config.repository}`
    ];
    let tag = "latest";

    const packageManager = getPackageInfo(project);
    if (packageManager) {
      if (packageManager.type === "Cargo.toml") {
        tag = (packageManager.content as CargoToml).package.version;
        labels.push(
          `org.opencontainers.image.description=${(packageManager.content as CargoToml).package.description}`
        );
      } else if (packageManager.type === "package.json") {
        tag = packageManager.content.version;
        labels.push(
          `org.opencontainers.image.description=${packageManager.content.description}`
        );
      }
    }

    project.targets = {
      ...project.targets,
      container: {
        executor: "@nx-tools/nx-container:build",
        options: {
          file: dockerFilePath,
          engine,
          labels,
          push: true,
          platforms: ["linux/amd64"],
          metadata: {
            images: [
              `${config.namespace ? config.namespace : "storm-software"}/${project.name?.replace(`${config.namespace}-`, "")}`,
              `ghcr.io/${config.organization ? config.organization : "storm-software"}/${project.name}`
            ],
            tags: [
              "type=schedule",
              "type=ref,event=branch",
              "type=ref,event=tag",
              "type=ref,event=pr",
              "type=semver,pattern={{version}}",
              "type=semver,pattern={{major}}.{{minor}}",
              "type=semver,pattern={{major}}",
              "type=sha"
            ]
          }
        },
        defaultConfiguration: "production",
        configurations: {
          development: {
            quiet: false,
            "build-args": [
              "ENVIRONMENT=development",
              "DEBUG_IMAGE=true",
              `RELEASE=${tag}`
            ]
          },
          production: {
            quiet: true,
            "build-args": [
              "ENVIRONMENT=production",
              "DEBUG_IMAGE=false",
              `RELEASE=${tag}`
            ]
          }
        }
      }
    };

    if (
      (isEqualProjectTag(
        project,
        ProjectTagConstants.ProjectType.TAG_ID,
        ProjectTagConstants.ProjectType.APPLICATION
      ) ||
        project.projectType === "application") &&
      hasProjectTag(project, ProjectTagConstants.Registry.TAG_ID)
    ) {
      if (project.targets["nx-release-publish"]) {
        project.targets["nx-release-publish"] = {
          ...project.targets["nx-release-publish"],
          executor: "@storm-software/k8s-tools:container-publish",
          options: {
            packageRoot: project.root
          }
        };
      } else {
        project.targets["nx-release-publish"] = {
          cache: true,
          inputs: [
            "linting",
            "testing",
            "documentation",
            "rust",
            "^production"
          ],
          dependsOn: ["build", "^nx-release-publish"],
          executor: "@storm-software/k8s-tools:container-publish",
          options: {
            packageRoot: project.root
          }
        };
      }
    }

    setDefaultProjectTags(project);

    const projects: Record<string, ProjectConfiguration> = {};
    const externalNodes: Record<string, ProjectGraphExternalNode> = {};

    projects[project.root] = {
      ...project,
      release: {
        ...project.release,
        version: {
          ...project.release?.version,
          generator: "@storm-software/workspace-tools:release-version"
        }
      }
    };

    return {
      projects,
      externalNodes
    };
  }
];

export const createDependencies: CreateDependencies = (_, context) => {
  return [];
};

const titleCase = (input?: string): string | undefined => {
  if (!input) {
    return "";
  }

  return (
    input
      // eslint-disable-next-line no-useless-escape
      .split(/(?=[A-Z])|[\.\-\s_]/)
      .map(s => s.trim())
      .filter(s => !!s)
      .map(s =>
        s
          ? s.toLowerCase().charAt(0).toUpperCase() + s.toLowerCase().slice(1)
          : s
      )
      .join(" ")
  );
};
