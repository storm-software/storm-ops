import {
  detectPackageManager,
  readJsonFile,
  type ExecutorContext
} from "@nx/devkit";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { exec } from "child_process";
import * as columnify from "columnify";
import { existsSync } from "fs";
import { execSync } from "node:child_process";
import { env as appendLocalEnv } from "npm-run-path";
import { PackageJson } from "nx/src/utils/package-json";
import { join, relative } from "path";
import { pnpmCatalogUpdate } from "../../utils/pnpm-deps-update";
import type { NpmPublishExecutorSchema } from "./schema.d";

export const LARGE_BUFFER = 1024 * 1000000;

function processEnv(color: boolean) {
  const env = {
    ...process.env,
    ...appendLocalEnv()
  };

  if (color) {
    env.FORCE_COLOR = `${color}`;
  }
  return env;
}

export default async function npmPublishExecutorFn(
  options: NpmPublishExecutorSchema,
  context: ExecutorContext
) {
  const pm = detectPackageManager();
  /**
   * We need to check both the env var and the option because the executor may have been triggered
   * indirectly via dependsOn, in which case the env var will be set, but the option will not.
   */
  const isDryRun = process.env.NX_DRY_RUN === "true" || options.dryRun || false;

  const projectConfig =
    context.projectsConfigurations!.projects[context.projectName!]!;

  const packageRoot = joinPaths(
    context.root,
    options.packageRoot ?? projectConfig.root
  );

  const packageJsonPath = joinPaths(packageRoot, "package.json");
  const packageJson = readJsonFile(packageJsonPath);
  const packageName = packageJson.name;

  await pnpmCatalogUpdate(packageRoot, context.root);

  /**
   * Whether or not dynamically replacing local dependency protocols (such as "workspace:*") is supported during `nx release publish` is
   * dependent on the package manager the user is using.
   *
   * npm does not support the workspace protocol at all, and `npm publish` does not support dynamically updating locally linked packages
   * during its packing phase, so we give the user a clear error message informing them of that.
   *
   * - `pnpm publish` provides ideal support, it has the possibility of providing JSON output consistent with npm
   * - `bun publish`, provides very good support, including all the flags we need apart from the JSON output, so we just have to accept that
   * it will look and feel different and print what it gives us and perform one bit of string manipulation for the dry-run case.
   * - `yarn npm publish`, IS NOT YET SUPPORTED, and will be tricky because it does not support the majority of the flags we need. However, it
   * does support replacing local dependency protocols with the correct version during its packing phase.
   */
  //   if (pm === "npm" || pm === "yarn") {
  //     const depTypes = ["dependencies", "devDependencies", "peerDependencies"];
  //     for (const depType of depTypes) {
  //       const deps = packageJson[depType];
  //       if (deps) {
  //         for (const depName in deps) {
  //           if (isLocallyLinkedPackageVersion(deps[depName])) {
  //             if (pm === "npm") {
  //               console.error(
  //                 `Error: Cannot publish package "${packageName}" because it contains a local dependency protocol in its "${depType}", and your package manager is npm.

  // Please update the local dependency on "${depName}" to be a valid semantic version (e.g. using \`nx release\`) before publishing, or switch to pnpm or bun as a package manager, which support dynamically replacing these protocols during publishing.`
  //               );
  //             } else if (pm === "yarn") {
  //               console.error(
  //                 `Error: Cannot publish package "${packageName}" because it contains a local dependency protocol in its "${depType}", and your package manager is yarn.

  // Currently, yarn is not supported for this use case because its \`yarn npm publish\` command does not support the customization needed.

  // Please update the local dependency on "${depName}" to be a valid semantic version (e.g. using \`nx release\`) before publishing, or switch to pnpm or bun as a package manager, which support dynamically replacing these protocols during publishing.`
  //               );
  //             }
  //             return {
  //               success: false
  //             };
  //           }
  //         }
  //       }
  //     }
  //   }

  // If package and project name match, we can make log messages terser
  const packageTxt =
    packageName === context.projectName
      ? `package "${packageName}"`
      : `package "${packageName}" from project "${context.projectName}"`;

  if (packageJson.private === true) {
    console.warn(
      `Skipped ${packageTxt}, because it has \`"private": true\` in ${packageJsonPath}`
    );
    return {
      success: true
    };
  }

  const warnFn = (message: string) => {
    console.log(message);
  };
  const { registry, tag, registryConfigKey } = await parseRegistryOptions(
    context.root,
    {
      packageRoot,
      packageJson
    },
    {
      registry: options.registry,
      tag: options.tag
    },
    warnFn
  );

  const npmViewCommandSegments = [
    `npm view ${packageName} versions dist-tags --json --"${registryConfigKey}=${registry}"`
  ];
  const npmDistTagAddCommandSegments = [
    `npm dist-tag add ${packageName}@${packageJson.version} ${tag} --"${registryConfigKey}=${registry}"`
  ];

  /**
   * In a dry-run scenario, it is most likely that all commands are being run with dry-run, therefore
   * the most up to date/relevant version might not exist on disk for us to read and make the npm view
   * request with.
   *
   * Therefore, so as to not produce misleading output in dry around dist-tags being altered, we do not
   * perform the npm view step, and just show npm/pnpm publish's dry-run output.
   */
  if (!isDryRun && !options.firstRelease) {
    const currentVersion = packageJson.version;
    try {
      const result = execSync(npmViewCommandSegments.join(" "), {
        env: processEnv(true),
        cwd: context.root,
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: false
      });

      const resultJson = JSON.parse(result.toString());
      const distTags = resultJson["dist-tags"] || {};
      if (distTags[tag] === currentVersion) {
        console.warn(
          `Skipped ${packageTxt} because v${currentVersion} already exists in ${registry} with tag "${tag}"`
        );
        return {
          success: true
        };
      }

      // If only one version of a package exists in the registry, versions will be a string instead of an array.
      const versions = Array.isArray(resultJson.versions)
        ? resultJson.versions
        : [resultJson.versions];

      if (versions.includes(currentVersion)) {
        try {
          if (!isDryRun) {
            execSync(npmDistTagAddCommandSegments.join(" "), {
              env: processEnv(true),
              cwd: context.root,
              stdio: "ignore",
              windowsHide: false
            });
            console.log(
              `Added the dist-tag ${tag} to v${currentVersion} for registry ${registry}.\n`
            );
          } else {
            console.log(
              `Would add the dist-tag ${tag} to v${currentVersion} for registry ${registry}, but "[dry-run]" was set.\n`
            );
          }
          return {
            success: true
          };
        } catch (err) {
          try {
            const stdoutData = JSON.parse(err.stdout?.toString() || "{}");

            // If the error is that the package doesn't exist, then we can ignore it because we will be publishing it for the first time in the next step
            if (
              !(
                stdoutData.error?.code?.includes("E404") &&
                stdoutData.error?.summary?.includes("no such package available")
              ) &&
              !(
                err.stderr?.toString().includes("E404") &&
                err.stderr?.toString().includes("no such package available")
              )
            ) {
              console.error("npm dist-tag add error:");
              if (stdoutData.error.summary) {
                console.error(stdoutData.error.summary);
              }
              if (stdoutData.error.detail) {
                console.error(stdoutData.error.detail);
              }

              if (context.isVerbose) {
                console.error("npm dist-tag add stdout:");
                console.error(JSON.stringify(stdoutData, null, 2));
              }
              return {
                success: false
              };
            }
          } catch (err) {
            console.error(
              "Something unexpected went wrong when processing the npm dist-tag add output\n",
              err
            );
            return {
              success: false
            };
          }
        }
      }
    } catch (err) {
      const stdoutData = JSON.parse(err.stdout?.toString() || "{}");
      // If the error is that the package doesn't exist, then we can ignore it because we will be publishing it for the first time in the next step
      if (
        !(
          stdoutData.error?.code?.includes("E404") &&
          stdoutData.error?.summary?.toLowerCase().includes("not found")
        ) &&
        !(
          err.stderr?.toString().includes("E404") &&
          err.stderr?.toString().toLowerCase().includes("not found")
        )
      ) {
        console.error(
          `Something unexpected went wrong when checking for existing dist-tags.\n`,
          err
        );
        return {
          success: false
        };
      }
    }
  }

  if (options.firstRelease && context.isVerbose) {
    console.log("Skipped npm view because --first-release was set");
  }

  /**
   * NOTE: If this is ever changed away from running the command at the workspace root and pointing at the package root (e.g. back
   * to running from the package root directly), then special attention should be paid to the fact that npm/pnpm publish will nest its
   * JSON output under the name of the package in that case (and it would need to be handled below).
   */
  const publishCommandSegments = [
    pm === "bun"
      ? // Unlike npm, bun publish does not support a custom registryConfigKey option
        `bun publish --cwd="${packageRoot}" --json --registry="${registry}" --tag=${tag}`
      : pm === "pnpm"
        ? // Unlike npm, pnpm publish does not support a custom registryConfigKey option, and will error on uncommitted changes by default if --no-git-checks is not set
          `pnpm publish "${packageRoot}" --json --registry="${registry}" --tag=${tag} --no-git-checks`
        : `npm publish "${packageRoot}" --json --"${registryConfigKey}=${registry}" --tag=${tag}`
  ];

  if (options.otp) {
    publishCommandSegments.push(`--otp=${options.otp}`);
  }

  publishCommandSegments.push(`--access=public`);

  if (isDryRun) {
    publishCommandSegments.push(`--dry-run`);
  }

  try {
    const output = execSync(publishCommandSegments.join(" "), {
      maxBuffer: LARGE_BUFFER,
      env: processEnv(true),
      cwd: context.root,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: false
    });
    // If in dry-run mode, the version on disk will not represent the version that would be published, so we scrub it from the output to avoid confusion.
    const dryRunVersionPlaceholder = "X.X.X-dry-run";

    const publishSummaryMessage = isDryRun
      ? `Would publish to ${registry} with tag "${tag}", but "[dry-run]" was set`
      : `Published to ${registry} with tag "${tag}"`;

    // bun publish does not support outputting JSON, so we need to modify and print the output string directly
    if (pm === "bun") {
      let outputStr = output.toString();
      if (isDryRun) {
        outputStr = outputStr.replace(
          new RegExp(`${packageJson.name}@${packageJson.version}`, "g"),
          `${packageJson.name}@${dryRunVersionPlaceholder}`
        );
      }
      console.log(outputStr);
      console.log(publishSummaryMessage);
      return {
        success: true
      };
    }

    /**
     * We cannot JSON.parse the output directly because if the user is using lifecycle scripts, npm/pnpm will mix its publish output with the JSON output all on stdout.
     * Additionally, we want to capture and show the lifecycle script outputs as beforeJsonData and afterJsonData and print them accordingly below.
     */
    const { beforeJsonData, jsonData, afterJsonData } =
      extractNpmPublishJsonData(output.toString());
    if (!jsonData) {
      console.error(
        `The ${pm} publish output data could not be extracted. Please report this issue on https://github.com/nrwl/nx`
      );
      return {
        success: false
      };
    }

    if (isDryRun) {
      for (const [key, val] of Object.entries(jsonData)) {
        if (typeof val !== "string") {
          continue;
        }
        jsonData[key] = val.replace(
          new RegExp(packageJson.version, "g"),
          dryRunVersionPlaceholder
        );
      }
    }

    if (
      typeof beforeJsonData === "string" &&
      beforeJsonData.trim().length > 0
    ) {
      console.log(beforeJsonData);
    }

    logTar(jsonData);

    if (typeof afterJsonData === "string" && afterJsonData.trim().length > 0) {
      console.log(afterJsonData);
    }

    // Print the summary message after the JSON data has been printed
    console.log(publishSummaryMessage);

    return {
      success: true
    };
  } catch (err) {
    try {
      // bun publish does not support outputting JSON, so we cannot perform any further processing
      if (pm === "bun") {
        console.error(`bun publish error:`);
        console.error(err.stderr?.toString() || "");
        console.error(err.stdout?.toString() || "");
        return {
          success: false
        };
      }

      const stdoutData = JSON.parse(err.stdout?.toString() || "{}");

      console.error(`${pm} publish error:`);
      if (stdoutData.error?.summary) {
        console.error(stdoutData.error.summary);
      }
      if (stdoutData.error?.detail) {
        console.error(stdoutData.error.detail);
      }

      if (context.isVerbose) {
        console.error(`${pm} publish stdout:`);
        console.error(JSON.stringify(stdoutData, null, 2));
      }

      if (!stdoutData.error) {
        throw err;
      }

      return {
        success: false
      };
    } catch (err) {
      console.error(
        `Something unexpected went wrong when processing the ${pm} publish output\n`,
        err
      );
      return {
        success: false
      };
    }
  }
}

async function parseRegistryOptions(
  cwd: string,
  pkg: {
    packageRoot: string;
    packageJson: PackageJson;
  },
  options: {
    registry?: string;
    tag?: string;
  },
  logWarnFn: (message: string) => void = console.warn
): Promise<{
  registry: string;
  tag: string;
  registryConfigKey: string;
}> {
  const npmRcPath = join(pkg.packageRoot, ".npmrc");
  if (existsSync(npmRcPath)) {
    const relativeNpmRcPath = relative(cwd, npmRcPath);
    logWarnFn(
      `\nIgnoring .npmrc file detected in the package root: ${relativeNpmRcPath}. Nested .npmrc files are not supported by npm. Only the .npmrc file at the root of the workspace will be used. To customize the registry or tag for specific packages, see https://nx.dev/recipes/nx-release/configure-custom-registries\n`
    );
  }

  const scope = pkg.packageJson.name.startsWith("@")
    ? pkg.packageJson.name.split("/")[0]
    : "";

  // If the package is scoped, then the registry argument that will
  // correctly override the registry in the .npmrc file must be scoped.
  const registryConfigKey = scope ? `${scope}:registry` : "registry";

  const publishConfigRegistry =
    pkg.packageJson.publishConfig?.[registryConfigKey];

  // Even though it won't override the actual registry that's actually used,
  // the user might think otherwise, so we should still warn if the user has
  // set a 'registry' in 'publishConfig' for a scoped package.
  if (publishConfigRegistry || pkg.packageJson.publishConfig?.registry) {
    const relativePackageJsonPath = relative(
      cwd,
      join(pkg.packageRoot, "package.json")
    );
    if (options.registry) {
      logWarnFn(
        `\nRegistry detected in the 'publishConfig' of the package manifest: ${relativePackageJsonPath}. This will override your registry option set in the project configuration or passed via the --registry argument, which is why configuring the registry with 'publishConfig' is not recommended. For details, see https://nx.dev/recipes/nx-release/configure-custom-registries\n`
      );
    } else {
      logWarnFn(
        `\nRegistry detected in the 'publishConfig' of the package manifest: ${relativePackageJsonPath}. Configuring the registry in this way is not recommended because it prevents the registry from being overridden in project configuration or via the --registry argument. To customize the registry for specific packages, see https://nx.dev/recipes/nx-release/configure-custom-registries\n`
      );
    }
  }

  const registry =
    // `npm publish` will always use the publishConfig registry if it exists, even over the --registry arg
    publishConfigRegistry ||
    options.registry ||
    (await getNpmRegistry(cwd, scope));
  const tag = options.tag || (await getNpmTag(cwd));
  if (!registry || !tag) {
    throw new Error(
      `The registry and tag options are required. Please provide them in the project configuration or via the --registry and --tag arguments.`
    );
  }

  return { registry, tag, registryConfigKey };
}

/**
 * Returns the npm registry that is used for publishing.
 *
 * @param scope the scope of the package for which to determine the registry
 * @param cwd the directory where the npm config should be read from
 */
async function getNpmRegistry(
  cwd: string,
  scope?: string
): Promise<string | undefined> {
  let registry: string | undefined;

  if (scope) {
    registry = await getNpmConfigValue(`${scope}:registry`, cwd);
  }

  if (!registry) {
    registry = await getNpmConfigValue("registry", cwd);
  }

  return registry;
}

/**
 * Returns the npm tag that is used for publishing.
 *
 * @param cwd the directory where the npm config should be read from
 */
async function getNpmTag(cwd: string): Promise<string | undefined> {
  // npm does not support '@scope:tag' in the npm config, so we only need to check for 'tag'.
  return getNpmConfigValue("tag", cwd);
}

async function getNpmConfigValue(
  key: string,
  cwd: string
): Promise<string | undefined> {
  try {
    const result = await execAsync(`npm config get ${key}`, cwd);
    return result === "undefined" ? undefined : result;
  } catch (_) {
    return Promise.resolve(undefined);
  }
}

async function execAsync(command: string, cwd: string): Promise<string> {
  // Must be non-blocking async to allow spinner to render
  return new Promise<string>((resolve, reject) => {
    exec(command, { cwd, windowsHide: false }, (error, stdout, stderr) => {
      if (error) {
        return reject((stderr ? `${stderr}\n` : "") + error);
      }
      return resolve(stdout.trim());
    });
  });
}

const expectedNpmPublishJsonKeys = [
  "id",
  "name",
  "version",
  "size",
  "filename"
];

function extractNpmPublishJsonData(str: string): {
  beforeJsonData: string;
  jsonData: Record<string, unknown> | null;
  afterJsonData: string;
} {
  const jsonMatches = str.match(/{(?:[^{}]|{[^{}]*})*}/g);
  if (jsonMatches) {
    for (const match of jsonMatches) {
      // Cheap upfront check to see if the stringified JSON data has the expected keys as substrings
      if (!expectedNpmPublishJsonKeys.every(key => str.includes(key))) {
        continue;
      }
      // Full JSON parsing to identify the JSON object
      try {
        const parsedJson = JSON.parse(match);
        if (
          !expectedNpmPublishJsonKeys.every(
            key => parsedJson[key] !== undefined
          )
        ) {
          continue;
        }
        const jsonStartIndex = str.indexOf(match);
        return {
          beforeJsonData: str.slice(0, jsonStartIndex),
          jsonData: parsedJson,
          afterJsonData: str.slice(jsonStartIndex + match.length)
        };
      } catch {
        // Ignore parsing errors for unrelated JSON blocks
      }
    }
  }

  // No applicable jsonData detected, the whole contents is the beforeJsonData
  return {
    beforeJsonData: str,
    jsonData: null,
    afterJsonData: ""
  };
}

const formatBytes = (bytes, space = true) => {
  let spacer = "";
  if (space) {
    spacer = " ";
  }

  if (bytes < 1000) {
    // B
    return `${bytes}${spacer}B`;
  }

  if (bytes < 1000000) {
    // kB
    return `${(bytes / 1000).toFixed(1)}${spacer}kB`;
  }

  if (bytes < 1000000000) {
    // MB
    return `${(bytes / 1000000).toFixed(1)}${spacer}MB`;
  }

  // GB
  return `${(bytes / 1000000000).toFixed(1)}${spacer}GB`;
};

const logTar = (tarball, opts = {}) => {
  // @ts-expect-error Expected to be a tarball
  const { unicode = true } = opts;
  console.log("");
  console.log(
    `${unicode ? "📦 " : "package:"} ${tarball.name}@${tarball.version}`
  );
  console.log("=== Tarball Contents ===");
  if (tarball.files.length) {
    console.log("");
    const columnData = columnify(
      tarball.files
        .map(f => {
          const bytes = formatBytes(f.size, false);
          return /^node_modules\//.test(f.path)
            ? null
            : { path: f.path, size: `${bytes}` };
        })
        .filter(f => f),
      {
        include: ["size", "path"],
        showHeaders: false
      }
    );
    columnData.split("\n").forEach(line => {
      console.log(line);
    });
  }
  if (tarball.bundled.length) {
    console.log("=== Bundled Dependencies ===");
    tarball.bundled.forEach(name => console.log("", name));
  }
  console.log("=== Tarball Details ===");
  console.log(
    columnify(
      [
        { name: "name:", value: tarball.name },
        { name: "version:", value: tarball.version },
        tarball.filename && { name: "filename:", value: tarball.filename },
        { name: "package size:", value: formatBytes(tarball.size) },
        { name: "unpacked size:", value: formatBytes(tarball.unpackedSize) },
        { name: "shasum:", value: tarball.shasum },
        {
          name: "integrity:",
          value:
            tarball.integrity.toString().slice(0, 20) +
            "[...]" +
            tarball.integrity.toString().slice(80)
        },
        tarball.bundled.length && {
          name: "bundled deps:",
          value: tarball.bundled.length
        },
        tarball.bundled.length && {
          name: "bundled files:",
          value: tarball.entryCount - tarball.files.length
        },
        tarball.bundled.length && {
          name: "own files:",
          value: tarball.files.length
        },
        { name: "total files:", value: tarball.entryCount }
      ].filter(x => x),
      {
        include: ["name", "value"],
        showHeaders: false
      }
    )
  );
  console.log("", "");
};
