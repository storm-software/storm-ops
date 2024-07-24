/* eslint-disable @typescript-eslint/no-explicit-any */
import { checks } from "@manypkg/cli/src/checks";
import type { Options } from "@manypkg/cli/src/checks/utils";
import { ExitError } from "@manypkg/cli/src/errors";
import { npmTagAll } from "@manypkg/cli/src/npm-tag";
import { runCmd } from "@manypkg/cli/src/run";
import { upgradeDependency } from "@manypkg/cli/src/upgrade";
import { install, writePackage } from "@manypkg/cli/src/utils";
import {
  getPackages,
  type Package,
  type Packages
} from "@manypkg/get-packages";
import pLimit from "p-limit";
import spawn from "spawndamnit";

type RootPackage = Package & {
  packageJson: {
    manypkg?: Options;
  };
};
type PackagesWithConfig = Packages & {
  rootPackage?: RootPackage;
};

const defaultOptions = {
  defaultBranch: "main"
};

const runChecks = (
  allWorkspaces: Map<string, Package>,
  rootWorkspace: RootPackage | undefined,
  shouldFix: boolean,
  options: Options
) => {
  let hasErrored = false;
  let requiresInstall = false;
  const ignoredRules = new Set(options.ignoredRules || []);
  for (const [ruleName, check] of Object.entries(checks)) {
    if (ignoredRules.has(ruleName)) {
      continue;
    }

    if (check.type === "all") {
      for (const [, workspace] of allWorkspaces) {
        const errors = check.validate(
          workspace,
          allWorkspaces,
          rootWorkspace,
          options
        );
        if (shouldFix && check.fix !== undefined) {
          for (const error of errors) {
            const output = check.fix(error as any, options) || {
              requiresInstall: false
            };
            if (output.requiresInstall) {
              requiresInstall = true;
            }
          }
        } else {
          for (const error of errors) {
            hasErrored = true;
            console.error(check.print(error as any, options));
          }
        }
      }
    }
    if (check.type === "root" && rootWorkspace) {
      const errors = check.validate(rootWorkspace, allWorkspaces, options);
      if (shouldFix && check.fix !== undefined) {
        for (const error of errors) {
          const output = check.fix(error as any, options) || {
            requiresInstall: false
          };
          if (output.requiresInstall) {
            requiresInstall = true;
          }
        }
      } else {
        for (const error of errors) {
          hasErrored = true;
          console.error(check.print(error as any, options));
        }
      }
    }
  }
  return { requiresInstall, hasErrored };
};

const execLimit = pLimit(4);

async function execCmd(args: string[]) {
  const { packages } = await getPackages(process.cwd());
  let highestExitCode = 0;
  await Promise.all(
    packages.map(pkg => {
      return execLimit(async () => {
        const { code } = await spawn(args[0], args.slice(1), {
          cwd: pkg.dir,
          stdio: "inherit"
        });
        highestExitCode = Math.max(code, highestExitCode);
      });
    })
  );
  throw new ExitError(highestExitCode);
}

export const MANY_PKG_TYPE_OPTIONS = [
  "fix",
  "check",
  "exec",
  "run",
  "upgrade",
  "npm-tag"
];

export async function runManypkg(manypkgType = "fix", manypkgArgs: string[]) {
  if (manypkgType === "exec") {
    return execCmd(manypkgArgs.slice(0));
  }
  if (manypkgType === "run") {
    return runCmd(manypkgArgs.slice(0), process.cwd());
  }
  if (manypkgType === "upgrade") {
    return upgradeDependency(manypkgArgs.slice(0));
  }
  if (manypkgType === "npm-tag") {
    return npmTagAll(manypkgArgs.slice(0));
  }

  if (manypkgType !== "check" && manypkgType !== "fix") {
    console.error(
      `command ${manypkgType} not found, only check, exec, run, upgrade, npm-tag and fix exist`
    );
    process.exit(1);
  }

  const { packages, rootPackage, rootDir } = (await getPackages(
    process.env.STORM_WORKSPACE_ROOT
      ? process.env.STORM_WORKSPACE_ROOT
      : process.cwd()
  )) as PackagesWithConfig;

  const options: Options = {
    ...defaultOptions,
    ...rootPackage?.packageJson.manypkg
  };

  const packagesByName = new Map<string, Package>(
    packages.map(x => [x.packageJson.name, x])
  );

  console.log(`🔍 Checking ${packages.length} packages...`);
  if (rootPackage) {
    packagesByName.set(rootPackage.packageJson.name, rootPackage);
  }
  const { hasErrored, requiresInstall } = runChecks(
    packagesByName,
    rootPackage,
    manypkgType === "fix",
    options
  );

  if (manypkgType === "fix") {
    await Promise.all(
      [...packagesByName].map(([_, workspace]) => {
        writePackage(workspace);
      })
    );
    if (requiresInstall) {
      await install("pnpm", rootDir);
    }

    if (hasErrored) {
      console.log("🎉 Fixed workspace packages!");
    } else {
      console.log("🎉 Workspace packages are valid!");
    }
  } else if (hasErrored) {
    console.info(
      "⚠️ The above errors may be fixable if the --manypkg-fix flag is used"
    );
  } else {
    console.log("🎉 Workspace packages are valid!");
  }
}
