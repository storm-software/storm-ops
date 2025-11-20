/**
 * The pnpm library used by Storm Software for building TypeScript applications.
 *
 * @remarks
 * A package containing various utilities to support custom workspace configurations
 *
 * @packageDocumentation
 */

import betterDefaultsPlugin from "@pnpm/plugin-better-defaults";
import esmNodePathPlugin from "@pnpm/plugin-esm-node-path";
import defu from "defu";

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
        minimumReleaseAge: 1400,
        minimumReleaseAgeExclude: [
          "@storm-software/*",
          "@stryke/*",
          "@powerlines/*",
          "powerlines",
          "@earthquake/*",
          "earthquake"
        ],
        trustPolicy: "no-downgrade"
      });
      if (result.hoistPattern?.length === 1 && result.hoistPattern[0] === "*") {
        result.hoistPattern = [];
      }

      return esmNodePathPlugin.hooks.updateConfig(
        betterDefaultsPlugin.hooks.updateConfig(result)
      );
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
