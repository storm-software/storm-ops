/*-------------------------------------------------------------------

                  ⚡ Storm Software - Storm Stack

 This code was released as part of the Storm Stack project. Storm Stack
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/storm-ops
 Documentation:   https://stormsoftware.com/projects/storm-ops/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/storm-ops/license

 -------------------------------------------------------------------*/

import {
  writeError,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import type * as esbuild from "esbuild";
import { builtinModules } from "node:module";
import path from "node:path";

// packages that aren't detected but used
// TODO: these could be scoped at the root
const unusedIgnore = [
  // these are our dev dependencies
  /@types\/.*?/,
  /@typescript-eslint.*?/,
  /eslint.*?/,
  "esbuild",
  "husky",
  "is-ci",
  "lint-staged",
  "prettier",
  "typescript",
  "ts-node",
  "ts-jest",
  "@swc/core",
  "@swc/jest",
  "jest",

  // these are missing 3rd party deps
  "spdx-exceptions",
  "spdx-license-ids",

  // type-only, so it is not detected
  "ts-toolbelt",

  // these are indirectly used by build
  "buffer"
];

// packages that aren't missing but are detected
const missingIgnore = [".prisma", "@prisma/client", "ts-toolbelt"];

/**
 * Checks for unused and missing dependencies.
 */
export const depsCheckPlugin = (bundle?: boolean): esbuild.Plugin => ({
  name: "storm:deps-check",
  setup(build) {
    // we load the package.json of the project do do our analysis
    const pkgJsonPath = path.join(process.cwd(), "package.json");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkgContents = require(pkgJsonPath) as Record<string, object>;
    const regDependencies = Object.keys(pkgContents["dependencies"] ?? {});
    const devDependencies = Object.keys(pkgContents["devDependencies"] ?? {});
    const peerDependencies = Object.keys(pkgContents["peerDependencies"] ?? {});
    const dependencies = [
      ...regDependencies,
      ...(bundle ? devDependencies : [])
    ];

    // we prepare to collect dependencies that are only packages
    const collectedDependencies = new Set<string>();
    const onlyPackages = /^[^./](?!:)|^\.[^./]|^\.\.[^/]/;
    build.onResolve({ filter: onlyPackages }, args => {
      // we limit this search to the parent folder, don't go back
      if (args.importer.includes(process.cwd())) {
        // handle cases where there is extra path @org/pkg/folder
        if (args.path[0] === "@") {
          // we have a package that lives in org's scope, trim it
          const [org, pkg] = args.path.split("/");
          collectedDependencies.add(`${org}/${pkg}`);
        } else {
          // we have a regular package without scope, we trim it
          const [pkg] = args.path.split("/");
          collectedDependencies.add(pkg!);
        }
      }

      return { external: true }; // we don't care for the bundling
    });

    build.onEnd(() => {
      // we take all the dependencies that aren't collected and are native
      const unusedDependencies = [...dependencies].filter(dep => {
        return !collectedDependencies.has(dep) || builtinModules.includes(dep);
      });

      // we take all the collected deps that aren't deps and aren't native
      const missingDependencies = [...collectedDependencies].filter(dep => {
        return !dependencies.includes(dep) && !builtinModules.includes(dep);
      });

      // we exclude the deps that match our unusedIgnore patterns
      const filteredUnusedDeps = unusedDependencies.filter(dep => {
        return !unusedIgnore.some(pattern => dep.match(pattern));
      });

      // we exclude the deps that match our unusedIgnore patterns
      const filteredMissingDeps = missingDependencies.filter(dep => {
        return (
          !missingIgnore.some(pattern => dep.match(pattern)) &&
          !peerDependencies.includes(dep)
        );
      });

      writeWarning(
        `Unused Dependencies: ${JSON.stringify(filteredUnusedDeps)}`
      );
      writeError(
        `Missing Dependencies: ${JSON.stringify(filteredMissingDeps)}`
      );

      if (filteredMissingDeps.length > 0) {
        throw new Error(`Missing dependencies detected - please install them:
${JSON.stringify(filteredMissingDeps)}
`);
      }
    });
  }
});
