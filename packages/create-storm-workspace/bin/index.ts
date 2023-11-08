#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-explicit-any */

import { getNpmPackageVersion } from "@nx/workspace/src/generators/utils/get-npm-package-version";
import type {
  NxClientMode,
  PresetGeneratorSchema
} from "@storm-software/workspace-tools";
import { createWorkspace } from "create-nx-workspace";
import { prompt } from "enquirer";

async function main() {
  try {
    let name = process.argv[2];
    if (!name) {
      const response = await prompt<{ name: string }>({
        type: "input",
        name: "name",
        message: "What is the name of the workspace?"
      });
      name = response.name;
    }

    let organization = process.argv[3];
    if (!organization) {
      const response = await prompt<{ organization: string }>({
        type: "input",
        name: "organization",
        message: "What organization owns this repository?",
        initial: "storm-software"
      });
      organization = response.organization;
    }

    let namespace = process.argv[4];
    if (!namespace) {
      const response = await prompt<{ namespace: string }>({
        type: "input",
        name: "namespace",
        message: "What is the namespace of this repository (npm scope)?",
        initial: organization ? organization : "storm-software"
      });
      namespace = response.namespace;
    }

    let includeApps = process.argv[5] ? Boolean(process.argv[5]) : null;
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

    let description = process.argv[6];
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

    let repositoryUrl = process.argv[7];
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

    let mode: NxClientMode = process.argv[8] as NxClientMode;
    if (!mode) {
      mode = (
        await prompt<{ mode: "light" | "dark" }>({
          name: "mode",
          message: "Which mode should be used?",
          initial: "dark" as any,
          type: "autocomplete",
          choices: [
            { name: "light", message: "light" },
            { name: "dark", message: "dark" }
          ]
        })
      ).mode;
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
        mode
      }
    );

    console.log(`⚡ Successfully created the workspace: ${directory}.`);
  } catch (error) {
    console.error(error);
  }
}

main();
