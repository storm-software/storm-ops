import {
  formatFiles,
  ProjectConfiguration,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration
} from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import { writeDebug } from "@storm-software/config-tools";
import { withRunGenerator } from "@storm-software/workspace-tools/base/base-generator";
import yaml from "js-yaml";
import type { HelmDependencyGeneratorSchema } from "./schema";

export async function helmDependencyGeneratorFn(
  tree: Tree,
  options: HelmDependencyGeneratorSchema,
  config?: StormConfig
) {
  writeDebug("📝  Preparing to add Helm Dependency", config);

  const project = readProjectConfiguration(tree, options.project);

  if (!project.targets?.["helm-package"]) {
    throw new Error(
      `Project ${options.project} does not have a helm target. Please run the chart generator first.`
    );
  }

  updateProjectConfiguration(
    tree,
    options.project,
    addDependencyToConfig(project, options.repositoryName, options.repository)
  );

  updateChartYaml(
    tree,
    project,
    options.chartName!,
    options.chartVersion!,
    options.repository
  );

  if (options.format) {
    await formatFiles(tree);
  }

  return {
    success: true
  };
}

export default withRunGenerator<HelmDependencyGeneratorSchema>(
  "Helm Dependency",
  helmDependencyGeneratorFn
);

function addDependencyToConfig(
  project: ProjectConfiguration,
  name: string,
  url: string
): ProjectConfiguration {
  return {
    ...project,
    targets: {
      ...project.targets,
      helm: {
        ...project.targets?.["helm-package"],
        options: {
          ...project.targets?.["helm-package"]?.options,
          dependencies: {
            ...project.targets?.["helm-package"]?.options.dependencies,
            repositories: project.targets?.["helm-package"]?.options
              .dependencies.repositories
              ? [
                  ...project.targets["helm-package"].options.dependencies
                    .repositories,
                  { name: name, url: url }
                ]
              : [{ name: name, url: url }]
          }
        }
      }
    }
  };
}

function updateChartYaml(
  tree: Tree,
  project: ProjectConfiguration,
  name: string,
  version: string,
  repository: string
) {
  const chartFolder = project.targets?.["helm-package"]?.options.chartFolder;
  const chartPath = `${chartFolder}/Chart.yaml`;

  if (!tree.exists(chartPath)) {
    throw new Error("Chart.yaml not found");
  }

  try {
    const result = tree.read(chartPath, "utf8")?.toString();
    if (!result) {
      throw new Error("Failed to read Chart.yaml");
    }

    const chartContents = yaml.load(result) as {
      dependencies: { name: string; version: string; repository: string }[];
    };

    if (!chartContents.dependencies) {
      chartContents.dependencies = [];
    }

    const existingDependency = chartContents.dependencies.find(
      dep => dep.name === name
    );

    if (existingDependency) {
      existingDependency.version = version;
      existingDependency.repository = repository;
    } else {
      chartContents.dependencies.push({
        name: name,
        version: version,
        repository: repository
      });

      tree.write(chartPath, yaml.dump(chartContents));
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to parse Chart.yaml");
  }
}
