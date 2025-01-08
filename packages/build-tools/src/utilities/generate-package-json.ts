import { hfs } from "@humanfs/node";
import type { ProjectGraphProjectNode } from "@nx/devkit";
import { calculateProjectBuildableDependencies } from "@nx/js/src/utils/buildable-libs-utils";
import type { StormConfig } from "@storm-software/config";
import { writeTrace } from "@storm-software/config-tools/logger/console";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { findWorkspaceRoot } from "@storm-software/config-tools/utilities/find-workspace-root";
import { Glob } from "glob";
import {
  createProjectGraphAsync,
  readProjectsConfigurationFromProjectGraph
} from "nx/src/project-graph/project-graph";

export const addPackageDependencies = async (
  workspaceRoot: string,
  projectRoot: string,
  projectName: string,
  packageJson: Record<string, any>
): Promise<Record<string, any>> => {
  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });

  const projectConfigurations =
    readProjectsConfigurationFromProjectGraph(projectGraph);
  if (!projectConfigurations?.projects?.[projectName]) {
    throw new Error(
      "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
    );
  }

  const projectJsonPath = joinPaths(workspaceRoot, projectRoot, "project.json");
  if (!(await hfs.isFile(projectJsonPath))) {
    throw new Error("Cannot find project.json configuration");
  }

  if (!projectConfigurations?.projects?.[projectName]) {
    throw new Error(
      "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
    );
  }

  const projectDependencies = calculateProjectBuildableDependencies(
    undefined,
    projectGraph,
    workspaceRoot,
    projectName,
    process.env.NX_TASK_TARGET_TARGET || "build",
    process.env.NX_TASK_TARGET_CONFIGURATION || "production",
    true
  );

  const localPackages = [] as Record<string, any>[];
  for (const project of projectDependencies.dependencies.filter(
    dep =>
      dep.node.type === "lib" &&
      dep.node.data.root !== projectRoot &&
      dep.node.data.root !== workspaceRoot
  )) {
    const projectNode = project.node as ProjectGraphProjectNode;

    if (projectNode.data.root) {
      const projectPackageJsonPath = joinPaths(
        workspaceRoot,
        projectNode.data.root,
        "package.json"
      );
      if (await hfs.isFile(projectPackageJsonPath)) {
        const projectPackageJson = await hfs.json(projectPackageJsonPath);

        if (projectPackageJson.private !== false) {
          localPackages.push(projectPackageJson);
        }
      }
    }
  }

  if (localPackages.length > 0) {
    writeTrace(
      `📦  Adding local packages to package.json: ${localPackages.map(p => p.name).join(", ")}`
    );

    packageJson.peerDependencies = localPackages.reduce((ret, localPackage) => {
      if (!ret[localPackage.name]) {
        ret[localPackage.name] = `>=${localPackage.version || "0.0.1"}`;
      }

      return ret;
    }, packageJson.peerDependencies ?? {});
    packageJson.peerDependenciesMeta = localPackages.reduce(
      (ret, localPackage) => {
        if (!ret[localPackage.name]) {
          ret[localPackage.name] = {
            optional: false
          };
        }

        return ret;
      },
      packageJson.peerDependenciesMeta ?? {}
    );
    packageJson.devDependencies = localPackages.reduce((ret, localPackage) => {
      if (!ret[localPackage.name]) {
        ret[localPackage.name] = localPackage.version || "0.0.1";
      }

      return ret;
    }, packageJson.peerDependencies ?? {});
  } else {
    writeTrace("📦  No local packages dependencies to add to package.json");
  }

  return packageJson;
};

export const addWorkspacePackageJsonFields = async (
  config: StormConfig,
  projectRoot: string,
  sourceRoot: string,
  projectName: string,
  includeSrc = false,
  packageJson: Record<string, any>
): Promise<Record<string, any>> => {
  const workspaceRoot = config.workspaceRoot
    ? config.workspaceRoot
    : findWorkspaceRoot();
  const workspacePackageJson = await hfs.json(
    joinPaths(workspaceRoot, "package.json")
  );

  packageJson.type ??= "module";
  packageJson.sideEffects ??= false;

  if (includeSrc === true) {
    let distSrc = sourceRoot.replace(projectRoot, "");
    if (distSrc.startsWith("/")) {
      distSrc = distSrc.substring(1);
    }

    packageJson.source ??= `${joinPaths(distSrc, "index.ts").replaceAll("\\", "/")}`;
  }

  packageJson.files ??= ["dist/**/*"];
  if (includeSrc === true && !packageJson.files.includes("src")) {
    packageJson.files.push("src/**/*");
  }

  packageJson.publishConfig ??= {
    access: "public"
  };

  packageJson.description ??= workspacePackageJson.description;
  packageJson.homepage ??= workspacePackageJson.homepage;
  packageJson.bugs ??= workspacePackageJson.bugs;
  packageJson.license ??= workspacePackageJson.license;
  packageJson.keywords ??= workspacePackageJson.keywords;
  packageJson.funding ??= workspacePackageJson.funding;
  packageJson.author ??= workspacePackageJson.author;

  packageJson.maintainers ??= workspacePackageJson.maintainers;
  if (!packageJson.maintainers && packageJson.author) {
    packageJson.maintainers = [packageJson.author];
  }

  packageJson.contributors ??= workspacePackageJson.contributors;
  if (!packageJson.contributors && packageJson.author) {
    packageJson.contributors = [packageJson.author];
  }

  packageJson.repository ??= workspacePackageJson.repository;
  packageJson.repository.directory ??= projectRoot
    ? projectRoot
    : joinPaths("packages", projectName);

  return packageJson;
};

export const addPackageJsonExport = (
  file: string,
  type: "commonjs" | "module" = "module",
  sourceRoot?: string
): Record<string, any> => {
  let entry = file.replaceAll("\\", "/");
  if (sourceRoot) {
    entry = entry.replace(sourceRoot, "");
  }

  return {
    "import": {
      "types": `./dist/${entry}.d.${type === "module" ? "ts" : "mts"}`,
      "default": `./dist/${entry}.${type === "module" ? "js" : "mjs"}`
    },
    "require": {
      "types": `./dist/${entry}.d.${type === "commonjs" ? "ts" : "cts"}`,
      "default": `./dist/${entry}.${type === "commonjs" ? "js" : "cjs"}`
    },
    "default": {
      "types": `./dist/${entry}.d.ts`,
      "default": `./dist/${entry}.js`
    }
  };
};

export const addPackageJsonExports = async (
  sourceRoot: string,
  packageJson: Record<string, any>
): Promise<Record<string, any>> => {
  packageJson.exports ??= {};

  const files = await new Glob("**/*.{ts,tsx}", {
    absolute: false,
    cwd: sourceRoot,
    root: sourceRoot
  }).walk();
  files.forEach(file => {
    addPackageJsonExport(file, packageJson.type, sourceRoot);

    const split = file.split(".");
    split.pop();
    const entry = split.join(".").replaceAll("\\", "/");

    packageJson.exports[`./${entry}`] ??= addPackageJsonExport(
      entry,
      packageJson.type,
      sourceRoot
    );
  });

  packageJson.main =
    packageJson.type === "commonjs" ? "./dist/index.js" : "./dist/index.cjs";
  packageJson.module =
    packageJson.type === "module" ? "./dist/index.js" : "./dist/index.mjs";
  packageJson.types = "./dist/index.d.ts";

  packageJson.exports ??= {};
  packageJson.exports = Object.keys(packageJson.exports).reduce((ret, key) => {
    if (key.endsWith("/index") && !ret[key.replace("/index", "")]) {
      ret[key.replace("/index", "")] = packageJson.exports[key];
    }

    return ret;
  }, packageJson.exports);

  packageJson.exports["./package.json"] ??= "./package.json";
  packageJson.exports["."] =
    packageJson.exports["."] ??
    addPackageJsonExport("index", packageJson.type, sourceRoot);

  return packageJson;
};
