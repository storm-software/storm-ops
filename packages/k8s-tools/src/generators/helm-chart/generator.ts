import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  readProjectConfiguration,
  runTasksInSerial,
  Tree,
  updateProjectConfiguration
} from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import { join } from "path";
import type { HelmChartGeneratorSchema } from "./schema";

export async function helmChartGenerator(
  tree: Tree,
  options: HelmChartGeneratorSchema
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

  const stopwatch = getStopwatch("Storm Helm Chart generator");

  let config: StormConfig | undefined;
  try {
    writeInfo(`⚡ Running the Storm Helm Chart generator...\n\n`, config);

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

      if (project.targets?.["helm-package"]) {
        throw new Error(
          `Project ${options.project} already has a helm target. Please remove it before running this command.`
        );
      }

      updateProjectConfiguration(tree, options.project, {
        ...project,
        targets: {
          ...project.targets,
          "helm-package": {
            executor: "@storm-software/k8s-tools:helm-package",
            outputs: ["{options.outputFolder}"],
            options: {
              chartFolder: `${project.root}/${options.chartFolder}`,
              outputFolder: "{workspaceRoot}/dist/charts/{projectRoot}",
              push: false,
              remote: "oci://localhost:5000/helm-charts",
              dependencies: {
                update: true,
                build: true,
                repositories: []
              }
            }
          }
        }
      });

      generateFiles(
        tree,
        join(__dirname, "files", "chart"),
        join(project.root, options.chartFolder ?? ""),
        options
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

export default helmChartGenerator;
export const helmChartSchematic = convertNxGenerator(helmChartGenerator);
