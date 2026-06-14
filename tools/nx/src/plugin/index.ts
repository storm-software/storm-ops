/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

 This code was released as part of the Powerlines project. Powerlines
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/powerlines.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/powerlines
 Documentation:            https://docs.stormsoftware.com/projects/powerlines
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { CreateNodesResultV2, CreateNodesV2 } from "@nx/devkit";
import { createNodesFromFiles, readJsonFile } from "@nx/devkit";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import type { ProjectType } from "nx/src/config/workspace-json-project-json.js";

/* eslint-disable no-console */

export const name = "storm-ops/plugin";

const dependencies = [
  "untyped",
  "unbuild",
  "esbuild",
  "package-constants",
  "config-tools",
  "config"
];

export const createNodesV2: CreateNodesV2 = [
  "packages/**/project.json",
  async (configFiles, optionsV2, contextV2): Promise<CreateNodesResultV2> => {
    return createNodesFromFiles(
      async (configFile, _, context) => {
        try {
          if (!existsSync(join(contextV2.workspaceRoot, configFile))) {
            return {};
          }

          const projectJson = readJsonFile(
            join(contextV2.workspaceRoot, configFile)
          );
          if (!projectJson?.name || dependencies.includes(projectJson.name)) {
            return {};
          }

          const projectRoot = dirname(configFile);
          if (!projectRoot) {
            console.error(
              `[${name}]: package.json and Powerlines configuration files (i.e. powerlines.config.ts) must be located in the project root directory: ${configFile}`
            );

            return {};
          }

          const root = projectRoot
            .replaceAll("\\", "/")
            .replace(context.workspaceRoot.replaceAll("\\", "/"), "")
            .replace(/^\//g, "")
            .replace(/\/$/g, "");

          return {
            projects: {
              [root]: {
                root,
                projectType: "library" as ProjectType,
                sourceRoot: join(root, "src"),
                implicitDependencies: ["workspace-tools"]
              }
            }
          };
        } catch (error) {
          console.error(
            `[${name}]: ${error?.message ? error.message : "Unknown fatal error"}`
          );

          return {};
        }
      },
      configFiles,
      optionsV2,
      contextV2
    );
  }
];
