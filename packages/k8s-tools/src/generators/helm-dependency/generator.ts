import {
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  ProjectConfiguration,
  readProjectConfiguration,
  runTasksInSerial,
  Tree,
  updateProjectConfiguration
} from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import yaml from "js-yaml";
import type { HelmDependencyGeneratorSchema } from "./schema";

export async function helmDependencyGenerator(
  tree: Tree,
  options: HelmDependencyGeneratorSchema
) {
  const {
    getStopwatch,
    writeDebug,
    writeError,
    writeFatal,
    writeInfo,
    writeTrace,
    findWorkspaceRoot,
    loadStormConfig
  } = await import("@storm-software/config-tools");

  const stopwatch = getStopwatch("Storm Worker generator");

  let config: StormConfig | undefined;
  try {
    writeInfo(`⚡ Running the Storm Worker generator...\n\n`, config);

    const workspaceRoot = findWorkspaceRoot();

    writeDebug(
      `Loading the Storm Config from environment variables and storm.json file...
- workspaceRoot: ${workspaceRoot}`,
      config
    );

    config = await loadStormConfig(workspaceRoot);
    writeTrace(
      `Loaded Storm config into env: \n${Object.keys(process.env)
        .map(key => ` - ${key}=${JSON.stringify(process.env[key])}`)
        .join("\n")}`,
      config
    );

    const tasks: GeneratorCallback[] = [];

    tasks.push(async () => {
      const project = readProjectConfiguration(tree, options.project);

      if (!project.targets?.["helm-package"]) {
        throw new Error(
          `Project ${options.project} does not have a helm target. Please run the chart generator first.`
        );
      }

      updateProjectConfiguration(
        tree,
        options.project,
        addDependencyToConfig(
          project,
          options.repositoryName,
          options.repository
        )
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
    });

    return runTasksInSerial(...tasks);
  } catch (error) {
    return () => {
      writeFatal(
        "A fatal error occurred while running the generator - the process was forced to terminate",
        config
      );
      writeError(
        `An exception was thrown in the generator's process \n - Details: ${error.message}\n - Stacktrace: ${error.stack}`,
        config
      );
    };
  } finally {
    stopwatch();
  }
}

export default helmDependencyGenerator;
export const helmDependencySchematic = convertNxGenerator(
  helmDependencyGenerator
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
