#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-explicit-any */

import { getNpmPackageVersion } from "@nx/workspace/src/generators/utils/get-npm-package-version";
import type { PresetGeneratorSchema } from "@storm-software/workspace-tools";
import { createWorkspace } from "create-nx-workspace";
import { prompt } from "enquirer";

async function main() {
  try {
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

    let description = process.argv.length > 6 ? process.argv[6] : null;
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

    let repositoryUrl = process.argv.length > 7 ? process.argv[7] : null;
    if (!repositoryUrl) {
      const response = await prompt<{ repositoryUrl: string }>({
        type: "input",
        name: "repositoryUrl",
        message: "What is the workspace's Git repository's URL?",
        initial: `https://github.com/${
          organization ? organization : "storm-software"
        }/${name}`
      });
      repositoryUrl = response.repositoryUrl;
    }

    console.log(`⚡ Creating the Storm Workspace: ${name}`);

    const version = getNpmPackageVersion("@storm-software/workspace-tools");
    const { directory } = await createWorkspace<PresetGeneratorSchema>(
      `@storm-software/workspace-tools@${version ? version : "latest"}`,
      {
        name,
        organization,
        namespace,
        description,
        includeApps,
        repositoryUrl,
        packageManager: "pnpm",
        nxCloud: false,
        mode: "dark"
      }
    );

    console.log(`⚡ Successfully created the workspace: ${directory}.`);
  } catch (error) {
    console.log(
      "❌ An error occurred while creating the workspace. Please correct the below issue:"
    );
    console.error(error);
  }
}

main();
