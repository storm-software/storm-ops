#!/usr/bin/env node

import { exitWithSuccess, handleProcess, loadStormConfig } from "@storm-software/config-tools";
import { checkPackageVersion } from "../src/utilities/check-package-version";

const config = await loadStormConfig();
handleProcess(config);

checkPackageVersion(process.argv.slice(1));
exitWithSuccess(config);
