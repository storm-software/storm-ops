import type { StormWorkspaceConfig } from "@storm-software/config";
import {
  findWorkspaceRootSafe,
  writeDebug,
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools";
import { CDVC } from "check-dependency-version-consistency";
import { Command } from "commander";
import { lint } from "cspell";
import { parseCircular, parseDependencyTree, prettyCircular } from "dpdm";
import { runAlex } from "../alex";
import { runCodeowners } from "../codeowners";
import { MANY_PKG_TYPE_OPTIONS, runManypkg } from "../manypkg";

let _config: Partial<StormWorkspaceConfig> = {};

export function createProgram(config: StormWorkspaceConfig) {
  _config = config;
  writeInfo("⚡  Running Storm Linting Tools", config);

  const root = findWorkspaceRootSafe();
  process.env.STORM_WORKSPACE_ROOT ??= root;
  process.env.NX_WORKSPACE_ROOT_PATH ??= root;
  if (root) {
    process.chdir(root);
  }

  const program = new Command("storm-lint");
  program.version("1.0.0", "-v --version", "display CLI version");

  program
    .description("⚡  Lint the Storm Workspace")
    .showHelpAfterError()
    .showSuggestionAfterError();

  program
    .command("cspell")
    .description("Run spell-check lint for the workspace.")
    .option(
      "--cspell-config <file>",
      "CSpell config file path",
      "@storm-software/linting-tools/cspell/config.json"
    )
    .action(cspellAction);

  program
    .command("alex")
    .description("Run spell-check lint for the workspace.")
    .option(
      "--alex-config <file>",
      "Alex.js config file path",
      "@storm-software/linting-tools/alex/config.json"
    )
    .option(
      "--alex-ignore <file>",
      "Alex.js Ignore file path",
      "@storm-software/linting-tools/alex/.alexignore"
    )
    .action(alexAction);

  program
    .command("deps-version")
    .description("Run dependency version consistency lint for the workspace.")
    .option(
      "--ignore-deps-version <deps...>",
      "One or more dependencies to ignore for the dependency version consistency linting (comma-separated)",
      (value: string, previous: string[]) => {
        if (previous === undefined) {
          return value.split(",").map(v => v.trim().toLowerCase());
        }
        return [
          ...previous,
          ...value.split(",").map(v => v.trim().toLowerCase())
        ];
      }
    )
    .option(
      "--ignore-packages-deps-version <packages...>",
      "One or more packages to ignore for the dependency version consistency linting (comma-separated)",
      (value: string, previous: string[]) => {
        if (previous === undefined) {
          return value.split(",").map(v => v.trim().toLowerCase());
        }
        return [
          ...previous,
          ...value.split(",").map(v => v.trim().toLowerCase())
        ];
      }
    )
    .option(
      "--ignore-paths-deps-version <paths...>",
      "One or more paths to ignore for the dependency version consistency linting (comma-separated)",
      (value: string, previous: string[]) => {
        if (previous === undefined) {
          return value.split(",").map(v => v.trim().toLowerCase());
        }
        return [
          ...previous,
          ...value.split(",").map(v => v.trim().toLowerCase())
        ];
      }
    )
    .action(depsVersionAction);

  program
    .command("circular-deps")
    .description("Run circular dependency lint for the workspace.")
    .action(circularDepsAction);

  program
    .command("manypkg")
    .description("Run package lint with Manypkg for the workspace.")
    .option(
      "--manypkg-type <type>",
      "The manypkg command to run",
      val =>
        !val || !MANY_PKG_TYPE_OPTIONS.includes(val.trim().toLowerCase())
          ? "fix"
          : val.trim().toLowerCase(),
      "fix"
    )
    .option(
      "--manypkg-args <args...>",
      "The args provided to the manypkg command",
      (value: string, previous: string[]) => {
        if (previous === undefined) {
          return value.split(",").map(v => v.trim().toLowerCase());
        }
        return [
          ...previous,
          ...value.split(",").map(v => v.trim().toLowerCase())
        ];
      }
    )
    .action(manypkgAction);

  program
    .command("codeowners")
    .description("Run CODEOWNERS linting for the workspace.")
    .action(codeownersAction);

  program
    .command("all")
    .description("Run all linters for the workspace.")
    .option("--skip-cspell", "Should skip CSpell linting", true)
    .option("--skip-alex", "Should skip Alex language linting", true)
    .option(
      "--skip-deps-version",
      "Should skip dependency version consistency linting",
      false
    )
    .option(
      "--skip-circular-deps",
      "Should skip circular dependency linting",
      false
    )
    .option("--skip-manypkg", "Should skip Manypkg linting", false)
    .option(
      "--cspell-config <file>",
      "CSpell config file path",
      "@storm-software/linting-tools/cspell/config.json"
    )
    .option(
      "--alex-config <file>",
      "Alex.js config file path",
      "@storm-software/linting-tools/alex/config.json"
    )
    .option(
      "--alex-ignore <file>",
      "Alex.js Ignore file path",
      "@storm-software/linting-tools/alex/.alexignore"
    )
    .option(
      "--ignore-deps-version <deps...>",
      "One or more dependencies to ignore for the dependency version consistency linting (comma-separated)",
      (value: string, previous: string[]) => {
        if (previous === undefined) {
          return value.split(",").map(v => v.trim().toLowerCase());
        }
        return [
          ...previous,
          ...value.split(",").map(v => v.trim().toLowerCase())
        ];
      }
    )
    .option(
      "--ignore-packages-deps-version <packages...>",
      "One or more packages to ignore for the dependency version consistency linting (comma-separated)",
      (value: string, previous: string[]) => {
        if (previous === undefined) {
          return value.split(",").map(v => v.trim().toLowerCase());
        }
        return [
          ...previous,
          ...value.split(",").map(v => v.trim().toLowerCase())
        ];
      }
    )
    .option(
      "--ignore-paths-deps-version <paths...>",
      "One or more paths to ignore for the dependency version consistency linting (comma-separated)",
      (value: string, previous: string[]) => {
        if (previous === undefined) {
          return value.split(",").map(v => v.trim().toLowerCase());
        }
        return [
          ...previous,
          ...value.split(",").map(v => v.trim().toLowerCase())
        ];
      }
    )
    .option(
      "--manypkg-type <type>",
      "The manypkg command to run",
      val =>
        !val || !MANY_PKG_TYPE_OPTIONS.includes(val.trim().toLowerCase())
          ? "fix"
          : val.trim().toLowerCase(),
      "fix"
    )
    .option(
      "--manypkg-args <args...>",
      "The args provided to the manypkg command",
      (value: string, previous: string[]) => {
        if (previous === undefined) {
          return value.split(",").map(v => v.trim().toLowerCase());
        }
        return [
          ...previous,
          ...value.split(",").map(v => v.trim().toLowerCase())
        ];
      }
    )
    .option("--skip-codeowners", "Should skip CODEOWNERS linting", true)
    .action(allAction);

  return program;
}

async function allAction({
  skipCspell,
  skipAlex,
  skipDepsVersion,
  skipCircularDeps,
  skipManypkg,
  cspellConfig,
  alexConfig,
  alexIgnore,
  ignoreDepsVersion = [],
  ignorePackagesDepsVersion = [],
  ignorePathsDepsVersion = [],
  manypkgType,
  manypkgArgs = []
}: {
  skipCspell: boolean;
  skipAlex: boolean;
  skipDepsVersion: boolean;
  skipCircularDeps: boolean;
  skipManypkg: boolean;
  cspellConfig: string;
  alexConfig: string;
  alexIgnore: string;
  ignoreDepsVersion: string[];
  ignorePackagesDepsVersion: string[];
  ignorePathsDepsVersion: string[];
  manypkgType: string;
  manypkgArgs: string[];
}) {
  try {
    writeDebug("⚡  Linting the Storm Workspace", _config);

    const promises = [] as Promise<any>[];
    if (!skipCspell) {
      promises.push(cspellAction({ cspellConfig }));
    }

    if (!skipAlex) {
      promises.push(alexAction({ alexConfig, alexIgnore }));
    }

    if (!skipDepsVersion) {
      promises.push(
        depsVersionAction({
          ignoreDepsVersion,
          ignorePackagesDepsVersion,
          ignorePathsDepsVersion
        })
      );
    }

    if (!skipCircularDeps) {
      promises.push(circularDepsAction());
    }

    if (!skipManypkg) {
      promises.push(manypkgAction({ manypkgType, manypkgArgs }));
    }

    await Promise.all(promises);
    writeSuccess("Successfully linted the workspace  ✅", _config);
  } catch (e) {
    writeFatal(
      `A fatal error occurred while linting the workspace: ${e.message}`,
      _config
    );
    throw new Error(e.message, { cause: e });
  }
}

async function cspellAction({
  cspellConfig = "@storm-software/linting-tools/cspell/config.json"
}: {
  cspellConfig: string;
}) {
  try {
    writeInfo("⚡  Linting the workspace spelling");
    const result = await lint(["**/*.{txt,js,jsx,ts,tsx,md,mdx}"], {
      cache: true,
      summary: true,
      issues: true,
      progress: false,
      relative: true,
      dot: true,
      debug: true,
      gitignore: true,
      root:
        _config.workspaceRoot ||
        process.env.STORM_WORKSPACE_ROOT ||
        process.cwd(),
      defaultConfiguration: false,
      config: cspellConfig
    });
    if (result.errors && result.filesWithIssues) {
      throw new Error(
        `CSpell found ${result.errors} errors in ${result.filesWithIssues} files`
      );
    }

    writeSuccess("Spelling linting is complete  ✅", _config);
  } catch (e) {
    writeError(`Spelling linting has failed  ✘ \n\n${e.message}`, _config);
    throw new Error(e.message, { cause: e });
  }
}

async function codeownersAction() {
  try {
    writeInfo("⚡  Linting the workspace CODEOWNERS file");

    await runCodeowners();

    writeSuccess("CODEOWNERS linting is complete  ✅", _config);
  } catch (e) {
    writeError("CODEOWNERS linting has failed  ✘", _config);
    writeFatal(
      `A fatal error occurred while CODEOWNERS linting the workspace: \n\n${e.message} \n`,
      _config
    );
    throw new Error(e.message, { cause: e });
  }
}

async function alexAction({
  alexConfig = "@storm-software/linting-tools/alex/config.json",
  alexIgnore = "@storm-software/linting-tools/alex/.alexignore"
}: {
  alexConfig: string;
  alexIgnore: string;
}) {
  try {
    writeDebug("⚡  Linting the workspace language with alexjs.com", _config);

    const result = await runAlex(alexConfig, alexIgnore);
    if (result) {
      throw new Error(`Alex CLI Error Code: ${result}`);
    }

    writeSuccess("Language linting is complete  ✅", _config);
  } catch (e) {
    writeError(`Language linting has failed  ✘ \n\n${e.message} `, _config);
    writeFatal(
      `A fatal error occurred while language linting the workspace: \n\n${e.message} \n`,
      _config
    );
    throw new Error(e.message, { cause: e });
  }
}

async function depsVersionAction({
  ignoreDepsVersion = [],
  ignorePackagesDepsVersion = [],
  ignorePathsDepsVersion = []
}: {
  ignoreDepsVersion: string[];
  ignorePackagesDepsVersion: string[];
  ignorePathsDepsVersion: string[];
}) {
  try {
    writeDebug(
      "⚡  Linting the workspace dependency version consistency",
      _config
    );

    const cdvc = new CDVC(".", {
      fix: true,
      ignoreDep: ignoreDepsVersion,
      ignorePackage: ignorePackagesDepsVersion,
      ignorePath: ignorePathsDepsVersion
    });

    // Show output for dependencies we fixed.
    if (cdvc.hasMismatchingDependenciesFixable) {
      writeDebug(cdvc.toFixedSummary(), _config);
    }

    // Show output for dependencies that still have mismatches.
    if (cdvc.hasMismatchingDependenciesNotFixable) {
      throw new Error(cdvc.toMismatchSummary());
    }

    writeSuccess("Dependency Version linting is complete  ✅", _config);
  } catch (e) {
    writeError(
      `Dependency version consistency linting has failed ✘ \n\n${e.message} `,
      _config
    );
    writeFatal(
      `A fatal error occurred while dependency Version linting the workspace: ${e.message}`,
      _config
    );
    throw new Error(e.message, { cause: e });
  }
}

async function circularDepsAction() {
  try {
    writeDebug("⚡  Linting the workspace circular dependency", _config);

    const circulars = parseCircular(
      await parseDependencyTree(["**/*"], {
        exclude: new RegExp(
          "^(.*/(node_modules|dist|tmp|coverage|.nx|.cache|.next|__test__|__fixtures__)/).*"
        ),
        extensions: [".ts", ".tsx"],
        tsconfig: "./tsconfig.base.json",
        transform: true,
        skipDynamicImports: false
      }),
      true
    );
    if (circulars && circulars.length > 0) {
      throw new Error(
        prettyCircular(
          circulars,
          "Circular dependencies found in this Storm workspace: \n"
        )
      );
    }

    writeSuccess("Circular dependency linting is complete  ✅", _config);
  } catch (e) {
    writeError(
      `Circular dependency linting has failed  ✘ \n\n${e.message} `,
      _config
    );
    writeFatal(
      `A fatal error occurred while circular dependency linting the workspace: ${e.message}`,
      _config
    );
    throw new Error(e.message, { cause: e });
  }
}

async function manypkgAction({
  manypkgType = "fix",
  manypkgArgs = []
}: {
  manypkgType: string;
  manypkgArgs: string[];
}) {
  try {
    writeDebug("⚡  Linting the workspace's packages with Manypkg", _config);

    await runManypkg(_config, manypkgType, manypkgArgs);

    writeSuccess("Manypkg linting is complete  ✅", _config);
  } catch (e) {
    writeError(`Manypkg linting has failed  ✘ \n\n${e.message} `, _config);
    writeFatal(
      `A fatal error occurred while manypkg linting the workspace: ${e.message}`,
      _config
    );
    throw new Error(e.message, { cause: e });
  }
}
