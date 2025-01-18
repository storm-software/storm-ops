#!/usr/bin/env node

import { getNpmPackageVersion } from "@nx/workspace/src/generators/utils/get-npm-package-version";
import { loadStormConfig } from "@storm-software/config-tools";
import {
  getStopwatch,
  writeFatal,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools/logger/console";
import { createWorkspace } from "create-nx-workspace";
import { prompt } from "enquirer";

async function main() {
  const stopwatch = getStopwatch("create-storm-workspace");
  const config = await loadStormConfig();
  try {
    writeInfo("⚡ Preparing to create the Storm Workspace", config);

    ["SIGTERM", "SIGINT", "SIGUSR2"].map(type => {
      process.once(type, () => {
        try {
          console.info(`process.on ${type}`);
          console.info("shutdown process done, exiting with code 0");
          process.exit(0);
        } catch (e) {
          console.warn("shutdown process failed, exiting with code 1");
          console.error(e);
          process.exit(1);
        }
      });
    });

    let name = process.argv.length > 2 ? process.argv[2] : null;
    if (!name) {
      const response = await prompt<{ name: string }>({
        type: "input",
        name: "name",
        message: "What is the name of the workspace?"
      });
      name = response.name;
    }

    let organization = process.argv.length > 3 ? process.argv[3] : null;
    if (!organization) {
      const response = await prompt<{ organization: string }>({
        type: "input",
        name: "organization",
        message: "What organization owns this repository?",
        initial: "storm-software"
      });
      organization = response.organization;
    }

    let namespace = process.argv.length > 4 ? process.argv[4] : null;
    if (!namespace) {
      const response = await prompt<{ namespace: string }>({
        type: "input",
        name: "namespace",
        message: "What is the namespace of this repository (npm scope)?",
        initial: organization ? organization : "storm-software"
      });
      namespace = response.namespace;
    }

    let includeApps =
      process.argv.length > 5 && process.argv[5]
        ? Boolean(process.argv[5])
        : null;
    if (!includeApps && typeof includeApps !== "boolean") {
      const response = await prompt<{ includeApps: boolean }>({
        type: "confirm",
        name: "includeApps",
        message:
          "Should a separate `apps` folder be created for this workspace (if Yes: `apps` and `libs` folders will be added, if No: `packages` folders will be added)?",
        initial: false
      });
      includeApps = response.includeApps;
    }

    let includeRust =
      process.argv.length > 6 && process.argv[6]
        ? Boolean(process.argv[6])
        : null;
    if (!includeRust && typeof includeRust !== "boolean") {
      const response = await prompt<{ includeRust: boolean }>({
        type: "confirm",
        name: "includeRust",
        message:
          "Should Rust be included in the workspace (adds a `rust` folder with a `Cargo.toml` file)?",
        initial: false
      });
      includeRust = response.includeRust;
    }

    let description = process.argv.length > 7 ? process.argv[7] : null;
    if (!description) {
      const response = await prompt<{ description: string }>({
        type: "input",
        name: "description",
        message:
          "Provide a description of the workspace to use in the package.json and README.md files.",
        initial: `⚡ The ${
          namespace ? namespace : name
        } monorepo contains utility applications, tools, and various libraries to create modern and scalable web applications.`
      });
      description = response.description;
    }

    let repositoryUrl = process.argv.length > 8 ? process.argv[8] : null;
    if (!repositoryUrl) {
      const response = await prompt<{ repositoryUrl: string }>({
        type: "input",
        name: "repositoryUrl",
        message: "What is the workspace's Git repository's URL?",
        initial: `https://github.com/${organization ? organization : "storm-software"}/${name}`
      });
      repositoryUrl = response.repositoryUrl;
    }

    // let nxCloud =
    //   process.argv.length > 9 && process.argv[9]
    //     ? Boolean(process.argv[9])
    //     : null;
    // if (!nxCloud && typeof nxCloud !== "boolean") {
    //   const response = await prompt<{ nxCloud: boolean }>({
    //     type: "confirm",
    //     name: "nxCloud",
    //     message:
    //       "Should Nx Cloud be enabled for the workspace (allows for remote workspace caching)?",
    //     initial: false
    //   });
    //   nxCloud = response.nxCloud;
    // }

    writeInfo(`⚡ Creating the Storm Workspace: ${name}`, config);

    const version = getNpmPackageVersion("@storm-software/workspace-tools");
    const { directory } = await createWorkspace(
      `@storm-software/workspace-tools@${version ? version : "latest"}`,
      {
        name,
        organization,
        namespace,
        description,
        includeApps,
        includeRust,
        repositoryUrl,
        nxCloud: "skip",
        packageManager: "pnpm",
        mode: "dark",
        interactive: false,
        defaultBase: "main",
        useGitHub: true,
        skipGit: false,
        cliName: "Storm Workspace Generator"
      }
    );

    writeSuccess(
      `⚡ Successfully created the workspace: ${directory}.`,
      config
    );
  } catch (error) {
    writeFatal(
      "❌ An error occurred while creating the workspace. Please correct the below issue:",
      config
    );
    console.error(error);
    process.exit(1);
  } finally {
    stopwatch();
  }
}

main();
