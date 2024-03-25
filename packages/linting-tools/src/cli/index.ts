import {
  findWorkspaceRootSafe,
  writeDebug,
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess,
  writeTrace
} from "@storm-software/config-tools";
import type { StormConfig } from "@storm-software/config";
import { lint } from "cspell";
import { parseCircular, parseDependencyTree, prettyCircular } from "dpdm";
import { runAlex } from "../alex";
import { runManypkg } from "../manypkg";
import { Command, Option } from "commander";

let _config: Partial<StormConfig> = {};

export function createProgram(config: StormConfig) {
  try {
    _config = config;
    writeInfo(config, "⚡ Running Storm Linting Tools");

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

    const cspellConfig = new Option("--cspell-config <file>", "CSpell config file path").default(
      "@storm-software/linting-tools/cspell/config.js"
    );

    program
      .command("cspell")
      .description("Run spell-check lint for the workspace.")
      .addOption(cspellConfig)
      .action(cspellAction);

    const alexConfig = new Option("--alex-config <file>", "Alex.js config file path").default(
      "@storm-software/linting-tools/alex/.alexrc"
    );

    const alexIgnore = new Option("--alex-ignore <file>", "Alex.js Ignore file path").default(
      "@storm-software/linting-tools/alex/.alexignore"
    );

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

    const manypkgType = new Option("--manypkg-type <type>", "The manypkg command to run").default(
      "check"
    );

    const manypkgArgs = new Option(
      "--manypkg-args <args>",
      "The args provided to the manypkg command"
    ).default([]);

    const manypkgFix = new Option(
      "--manypkg-fix <args>",
      "The args provided to the manypkg command"
    ).default(true);

    program
      .command("manypkg")
      .description("Run package lint with Manypkg for the workspace.")
      .addOption(manypkgType)
      .addOption(manypkgArgs)
      .addOption(manypkgFix)
      .action(manypkgAction);

    const skipCspell = new Option("--skip-cspell", "Should skip CSpell linting");

    const skipAlex = new Option("--skip-alex", "Should skip Alex language linting");

    const skipDepsVersion = new Option(
      "--skip-deps-version",
      "Should skip dependency version consistency linting"
    );

    const skipCircularDeps = new Option(
      "--skip-circular-deps",
      "Should skip circular dependency linting"
    );

    const skipManypkg = new Option("--skip-manypkg", "Should skip Manypkg linting");

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
      .addOption(manypkgFix)
      .action(allAction);

    return program;
  } catch (e) {
    writeFatal(config, `A fatal error occurred while running the program: ${e.message}`);
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
  manypkgArgs,
  manypkgFix
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
  manypkgFix: boolean;
}) {
  try {
    writeInfo(_config, "⚡ Linting the Storm Workspace");

    const promises = [] as Promise<any>[];
    if (!skipCspell) {
      promises.push(cspellAction(cspellConfig));
    }

    if (!skipAlex) {
      promises.push(alexAction(alexConfig, alexIgnore));
    }

    if (!skipDepsVersion) {
      promises.push(depsVersionAction());
    }

    if (!skipCircularDeps) {
      promises.push(circularDepsAction());
    }

    if (!skipManypkg) {
      promises.push(manypkgAction(manypkgType, manypkgArgs, manypkgFix));
    }

    await Promise.all(promises);
    writeSuccess(_config, "Successfully linted the workspace ✅");
  } catch (e) {
    writeFatal(_config, `A fatal error occurred while linting the workspace: ${e.message}`);
    process.exit(1);
  }
}

async function cspellAction(cspellConfig: string) {
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
      root: process.env.STORM_WORKSPACE_ROOT ? process.env.STORM_WORKSPACE_ROOT : process.cwd(),
      defaultConfiguration: false,
      config: cspellConfig
    });
    if (result.errors) {
      writeError(_config, "Spelling linting has failed ❌");
      process.exit(1);
    }

    writeSuccess(_config, "Spelling linting is complete ✅");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function alexAction(alexConfig: string, alexIgnore: string) {
  try {
    writeInfo(_config, "⚡ Linting the workspace language with alexjs.com");

    if (await runAlex(alexConfig, alexIgnore)) {
      writeError(_config, "Language linting has failed ❌");
      process.exit(1);
    }

    writeSuccess(_config, "Language linting is complete ✅");
  } catch (e) {
    writeFatal(
      _config,
      `A fatal error occurred while language linting the workspace: ${e.message}`
    );
    process.exit(1);
  }
}

async function depsVersionAction() {
  try {
    writeInfo(_config, "⚡ Linting the workspace dependency version consistency");

    const { CDVC } = await import("check-dependency-version-consistency");
    const cdvc = new CDVC(".", { fix: true });

    // Show output for dependencies we fixed.
    if (cdvc.hasMismatchingDependenciesFixable) {
      writeDebug(_config, cdvc.toFixedSummary());
    }

    // Show output for dependencies that still have mismatches.
    if (cdvc.hasMismatchingDependenciesNotFixable) {
      writeError(_config, "Dependency version consistency linting has failed ❌");
      writeError(_config, cdvc.toMismatchSummary());
      process.exit(1);
    }

    writeSuccess(_config, "Dependency Version linting is complete ✅");
  } catch (e) {
    writeFatal(
      _config,
      `A fatal error occurred while dependency Version linting the workspace: ${e.message}`
    );
    process.exit(1);
  }
}

async function circularDepsAction() {
  try {
    writeInfo(_config, "⚡ Linting the workspace circular dependency");

    const tree = await parseDependencyTree("**/*.*", {
      tsconfig: "./tsconfig.base.json",
      transform: true,
      skipDynamicImports: false
    });

    const circulars = parseCircular(tree);
    writeTrace(_config, prettyCircular(circulars));

    writeSuccess(_config, "Circular dependency linting is complete ✅");
  } catch (e) {
    writeFatal(
      _config,
      `A fatal error occurred while circular dependency linting the workspace: ${e.message}`
    );
    process.exit(1);
  }
}

async function manypkgAction(manypkgType = "check", manypkgArgs: string[], manypkgFix: boolean) {
  try {
    writeInfo(_config, "⚡ Linting the workspace's packages with Manypkg");

    await runManypkg(manypkgType, manypkgArgs, manypkgFix);

    writeSuccess(_config, "Manypkg linting is complete ✅");
  } catch (e) {
    writeFatal(_config, `A fatal error occurred while manypkg linting the workspace: ${e.message}`);
    process.exit(1);
  }
}
