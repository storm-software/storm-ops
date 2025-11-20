/**
 * The pnpm library used by Storm Software for building TypeScript applications.
 *
 * @remarks
 * A package containing various utilities to support custom workspace configurations
 *
 * @packageDocumentation
 */

import defu from "defu";
import path from "node:path";
import { pathToFileURL } from "node:url";

export default {
  hooks: {
    updateConfig(config) {
      const result = defu(config, {
        enableGlobalVirtualStore: true,
        enablePrePostScripts: false,
        ignorePatchFailures: false,
        optimisticRepeatInstall: true,
        resolutionMode: "lowest-direct",
        verifyDepsBeforeRun: "install",
        preferWorkspacePackages: true,
        shellEmulator: true,
        catalogMode: "prefer",
        cleanupUnusedCatalogs: true,
        linkWorkspacePackages: true,
        minimumReleaseAge: 800,
        minimumReleaseAgeExclude: [
          "@storm-software/*",
          "@stryke/*",
          "@powerlines/*",
          "powerlines",
          "@earthquake/*",
          "earthquake"
        ]
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
