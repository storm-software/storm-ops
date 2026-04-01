/**
 * The pnpm library used by Storm Software for building TypeScript applications.
 *
 * @remarks
 * A package containing various utilities to support custom workspace configurations
 *
 * @packageDocumentation
 */

import { INTERNAL_PACKAGES } from "@storm-software/package-constants/internal-packages";
import defu from "defu";
import path from "node:path";
import { pathToFileURL } from "node:url";

const config = {
  hooks: {
    updateConfig(config) {
      const result = defu(config, {
        enableGlobalVirtualStore: true,
        enablePrePostScripts: false,
        ignorePatchFailures: false,
        optimisticRepeatInstall: true,
        resolutionMode: "lowest-direct",
        preferWorkspacePackages: true,
        shellEmulator: true,
        catalogMode: "prefer",
        cleanupUnusedCatalogs: true,
        linkWorkspacePackages: true,
        dedupeDirectDeps: true,
        dedupePeerDependents: true,
        useNodeVersion: "25.5.0",
        minimumReleaseAge: 800,
        minimumReleaseAgeExclude: [...INTERNAL_PACKAGES]
      });

      if (result.hoistPattern?.length === 1 && result.hoistPattern[0] === "*") {
        result.hoistPattern = [];
      }

      // From @pnpm/plugin-esm-node-path
      config.extraEnv.NODE_OPTIONS = `${
        process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : ""
      }--import=data:text/javascript,${encodeURIComponent(
        `import{register}from'node:module';register('${
          pathToFileURL(path.resolve(__dirname, "esm_loader.mjs")).href
        }','${pathToFileURL(path.resolve("./")).href}');`
      )}`;

      return config;
    },
    readPackage(pkg) {
      for (const [devDepName, devDepRange] of Object.entries(
        pkg.devDependencies
      )) {
        if (
          devDepName.startsWith("@types/") &&
          !pkg.dependencies[devDepName] &&
          !pkg.peerDependencies[devDepName]
        ) {
          const pkgName = devDepName.substring("@types/".length);
          if (pkg.dependencies[pkgName]) {
            pkg.dependencies[devDepName] = devDepRange;
          } else if (pkg.peerDependencies[pkgName]) {
            pkg.peerDependencies[devDepName] = "*";
          }
        }
      }
      return pkg;
    }
  }
};

export default config;
