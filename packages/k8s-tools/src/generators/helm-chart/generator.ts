import {
  formatFiles,
  generateFiles,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration
} from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import { withRunGenerator } from "@storm-software/workspace-tools/base/base-generator";
import { join } from "path";
import type { HelmChartGeneratorSchema } from "./schema";

export async function helmChartGeneratorFn(
  tree: Tree,
  options: HelmChartGeneratorSchema,
  config?: StormConfig
) {
  const { writeTrace } = await import("@storm-software/config-tools");

  writeTrace("📝  Preparing to write Helm Chart", config);

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

  return {
    success: true
  };
}

export default withRunGenerator<HelmChartGeneratorSchema>(
  "Helm Chart",
  helmChartGeneratorFn
);
