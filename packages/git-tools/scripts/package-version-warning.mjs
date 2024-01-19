#!/usr/bin/env zx

// biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
cd(__dirname);

import { prepareWorkspace } from "../../config-tools/utilities/prepare-workspace.js";
import { checkPackageVersion } from "./check-package-version.js";

const _STORM_CONFIG = await prepareWorkspace();

// biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
cd(_STORM_CONFIG.workspaceRoot);

checkPackageVersion(process.argv.slice(2));
