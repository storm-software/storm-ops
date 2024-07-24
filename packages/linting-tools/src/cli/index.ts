import type { StormConfig } from "@storm-software/config";
import {
  findWorkspaceRootSafe,
  writeDebug,
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess,
  writeTrace
} from "@storm-software/config-tools";
import { Command, Option } from "commander";
import { lint } from "cspell";
import { parseCircular, parseDependencyTree, prettyCircular } from "dpdm";
import { runAlex } from "../alex";
import { MANY_PKG_TYPE_OPTIONS, runManypkg } from "../manypkg";

let _config: Partial<StormConfig> = {};

export function createProgram(config: StormConfig) {
  try {
    _config = config;
    writeInfo("⚡ Running Storm Linting Tools", config);

    const root = findWorkspaceRootSafe();
    process.env.STORM_WORKSPACE_ROOT ??= root;
    process.env.NX_WORKSPACE_ROOT_PATH ??= root;
    root && process.chdir(root);

    const program = new Command("storm-lint");
    program.version("1.0.0", "-v --version", "display CLI version");

    program
      .description("⚡ Lint the Storm Workspace")
      .showHelpAfterError()
      .showSuggestionAfterError();

    const cspellConfig = new Option(
      "--cspell-config <file>",
      "CSpell config file path"
    ).default("@storm-software/linting-tools/cspell/config.js");

    program
      .command("cspell")
      .description("Run spell-check lint for the workspace.")
      .addOption(cspellConfig)
      .action(cspellAction);

    const alexConfig = new Option(
      "--alex-config <file>",
      "Alex.js config file path"
    ).default("@storm-software/linting-tools/alex/.alexrc");

    const alexIgnore = new Option(
      "--alex-ignore <file>",
      "Alex.js Ignore file path"
    ).default("@storm-software/linting-tools/alex/.alexignore");

    program
      .command("alex")
      .description("Run spell-check lint for the workspace.")
      .addOption(alexConfig)
      .addOption(alexIgnore)
      .action(alexAction);

    program
      .command("deps-version")
      .description("Run dependency version consistency lint for the workspace.")
      .action(depsVersionAction);

    program
      .command("circular-deps")
      .description("Run circular dependency lint for the workspace.")
      .action(circularDepsAction);

    const manypkgType = new Option(
      "--manypkg-type <type>",
      "The manypkg command to run"
    )
      .choices(MANY_PKG_TYPE_OPTIONS)
      .argParser(val =>
        !val || !MANY_PKG_TYPE_OPTIONS.includes(val.trim().toLowerCase())
          ? "fix"
          : val.trim().toLowerCase()
      )
      .default("fix");

    const manypkgArgs = new Option(
      "--manypkg-args <args>",
      "The args provided to the manypkg command"
    )
      .argParser(val =>
        !val || !val.replaceAll("", ",")
          ? []
          : val.split(",").map(v => v.trim().toLowerCase())
      )
      .default([]);

    program
      .command("manypkg")
      .description("Run package lint with Manypkg for the workspace.")
      .addOption(manypkgType)
      .addOption(manypkgArgs)
      .action(manypkgAction);

    const skipCspell = new Option(
      "--skip-cspell",
      "Should skip CSpell linting"
    ).default(true);

    const skipAlex = new Option(
      "--skip-alex",
      "Should skip Alex language linting"
    ).default(true);

    const skipDepsVersion = new Option(
      "--skip-deps-version",
      "Should skip dependency version consistency linting"
    ).default(false);

    const skipCircularDeps = new Option(
      "--skip-circular-deps",
      "Should skip circular dependency linting"
    ).default(false);

    const skipManypkg = new Option(
      "--skip-manypkg",
      "Should skip Manypkg linting"
    ).default(false);

    program
      .command("all")
      .description("Run all linters for the workspace.")
      .addOption(skipCspell)
      .addOption(skipAlex)
      .addOption(skipDepsVersion)
      .addOption(skipCircularDeps)
      .addOption(skipManypkg)
      .addOption(cspellConfig)
      .addOption(alexConfig)
      .addOption(alexIgnore)
      .addOption(manypkgType)
      .addOption(manypkgArgs)
      .action(allAction);

    return program;
  } catch (e) {
    writeFatal(
      `A fatal error occurred while running the program: ${e.message}`,
      config
    );
    process.exit(1);
  }
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
  manypkgType,
  manypkgArgs
}: {
  skipCspell: boolean;
  skipAlex: boolean;
  skipDepsVersion: boolean;
  skipCircularDeps: boolean;
  skipManypkg: boolean;
  cspellConfig: string;
  alexConfig: string;
  alexIgnore: string;
  manypkgType: string;
  manypkgArgs: string[];
}) {
  try {
    writeInfo("⚡ Linting the Storm Workspace", _config);

    const promises = [] as Promise<any>[];
    if (!skipCspell) {
      promises.push(cspellAction({ cspellConfig }));
    }

    if (!skipAlex) {
      promises.push(alexAction({ alexConfig, alexIgnore }));
    }

    if (!skipDepsVersion) {
      promises.push(depsVersionAction());
    }

    if (!skipCircularDeps) {
      promises.push(circularDepsAction());
    }

    if (!skipManypkg) {
      promises.push(manypkgAction({ manypkgType, manypkgArgs }));
    }

    await Promise.all(promises);
    writeSuccess("Successfully linted the workspace ✅", _config);
  } catch (e) {
    writeFatal(
      `A fatal error occurred while linting the workspace: ${e.message}`,
      _config
    );
    process.exit(1);
  }
}

async function cspellAction({
  cspellConfig = "@storm-software/linting-tools/cspell/config.js"
}: {
  cspellConfig: string;
}) {
  try {
    console.log("⚡Linting the workspace spelling");
    const result = await lint(["**/*.{txt,js,jsx,ts,tsx,md,mdx}"], {
      cache: true,
      summary: true,
      issues: true,
      progress: false,
      relative: true,
      dot: true,
      debug: true,
      gitignore: true,
      root: process.env.STORM_WORKSPACE_ROOT
        ? process.env.STORM_WORKSPACE_ROOT
        : process.cwd(),
      defaultConfiguration: false,
      config: cspellConfig
    });
    if (result.errors) {
      writeError("Spelling linting has failed ❌", _config);
      process.exit(1);
    }

    writeSuccess("Spelling linting is complete ✅", _config);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function alexAction({
  alexConfig = "@storm-software/linting-tools/alex/.alexrc",
  alexIgnore = "@storm-software/linting-tools/alex/.alexignore"
}: {
  alexConfig: string;
  alexIgnore: string;
}) {
  try {
    writeInfo("⚡ Linting the workspace language with alexjs.com", _config);

    if (await runAlex(alexConfig, alexIgnore)) {
      writeError("Language linting has failed ❌", _config);
      process.exit(1);
    }

    writeSuccess("Language linting is complete ✅", _config);
  } catch (e) {
    writeFatal(
      `A fatal error occurred while language linting the workspace: ${e.message}`,
      _config
    );
    process.exit(1);
  }
}

async function depsVersionAction() {
  try {
    writeInfo(
      "⚡ Linting the workspace dependency version consistency",
      _config
    );

    const { CDVC } = await import("check-dependency-version-consistency");
    const cdvc = new CDVC(".", { fix: true });

    // Show output for dependencies we fixed.
    if (cdvc.hasMismatchingDependenciesFixable) {
      writeDebug(cdvc.toFixedSummary(), _config);
    }

    // Show output for dependencies that still have mismatches.
    if (cdvc.hasMismatchingDependenciesNotFixable) {
      writeError(
        "Dependency version consistency linting has failed ❌",
        _config
      );
      writeError(cdvc.toMismatchSummary(), _config);
      process.exit(1);
    }

    writeSuccess("Dependency Version linting is complete ✅", _config);
  } catch (e) {
    writeFatal(
      `A fatal error occurred while dependency Version linting the workspace: ${e.message}`,
      _config
    );
    process.exit(1);
  }
}

async function circularDepsAction() {
  try {
    writeInfo("⚡ Linting the workspace circular dependency", _config);

    const tree = await parseDependencyTree("**/*.*", {
      tsconfig: "./tsconfig.base.json",
      transform: true,
      skipDynamicImports: false
    });

    const circulars = parseCircular(tree);
    writeTrace(prettyCircular(circulars), _config);

    writeSuccess("Circular dependency linting is complete ✅", _config);
  } catch (e) {
    writeFatal(
      `A fatal error occurred while circular dependency linting the workspace: ${e.message}`,
      _config
    );
    process.exit(1);
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
    writeInfo("⚡ Linting the workspace's packages with Manypkg", _config);

    await runManypkg(manypkgType, manypkgArgs);

    writeSuccess("Manypkg linting is complete ✅", _config);
  } catch (e) {
    writeFatal(
      `A fatal error occurred while manypkg linting the workspace: ${e.message}`,
      _config
    );
    process.exit(1);
  }
}
